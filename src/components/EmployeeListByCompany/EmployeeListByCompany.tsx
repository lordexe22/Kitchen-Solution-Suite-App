/* src/components/EmployeeListByCompany/EmployeeListByCompany.tsx */

import { useEffect, useState, useCallback } from 'react';
import { getEmployees } from '../../services/employees';
import type { EmployeeResponse } from '../../services/employees';
import type { EmployeeListFilters } from '../../services/employees';
import { useCompanies } from '../../hooks/useCompanies';
import { useCompaniesStore } from '../../store/Companies.store';
import { useBranchesStore } from '../../store/Branches.store';
import type { BranchWithSocials } from '../../store/Branches.types';
import { fetchCompanyBranches } from '../../services/branches/branches.service';
import CompanyAccordion from '../CompanyAccordion/CompanyAccordion';
import BranchAccordion from '../BranchAccordion/BranchAccordion';
import EmployeeRow from '../EmployeeRow';
import EmployeePermissionsModal from '../EmployeePermissionsModal';
import ServerErrorBanner from '../ServerErrorBanner';
import styles from './EmployeeListByCompany.module.css';

// #interface GroupedEmployees
interface GroupedEmployees {
  [companyId: number]: {
    [branchId: number]: EmployeeResponse[];
  };
}
// #end-interface

// #interface EmployeeListByCompanyProps
interface EmployeeListByCompanyProps {
  filters?: EmployeeListFilters;
}
// #end-interface

// #component EmployeeListByCompany
/**
 * Componente que agrupa y muestra empleados en estructura jerárquica:
 * Empresa → Sucursal → Lista de Empleados
 * 
 * Utiliza Accordion anidado para expandir/contraer secciones.
 * Al hacer click en un empleado, abre EmployeePermissionsModal.
 */
const EmployeeListByCompany = ({ filters }: EmployeeListByCompanyProps) => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [groupedEmployees, setGroupedEmployees] = useState<GroupedEmployees>({});
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);

  const { companies, loadCompanies } = useCompanies();
  const branchesByCompany = useBranchesStore((state) => state.branchesByCompany);
  const setBranchesForCompany = useBranchesStore((state) => state.setBranchesForCompany);
  const hasBranchesForCompany = useBranchesStore((state) => state.hasBranchesForCompany);

  // #function loadAllData - carga secuencial de compañías, sucursales y empleados
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      // Step 1: Cargar compañías
      await loadCompanies();
      
      // Esperar a que el store se actualice y obtener las compañías actuales
      const currentCompanies = useCompaniesStore.getState().companies;

      // Step 2: Cargar sucursales de cada compañía
      const pendingFetches = currentCompanies
        .filter((company) => !hasBranchesForCompany(company.id))
        .map(async (company) => {
          try {
            const branches = await fetchCompanyBranches(company.id);
            setBranchesForCompany(company.id, branches as BranchWithSocials[]);
          } catch (err) {
            console.error('[EmployeeListByCompany] Error cargando sucursales', { companyId: company.id, err });
          }
        });

      if (pendingFetches.length > 0) {
        await Promise.all(pendingFetches);
      }

      // Step 3: Cargar empleados
      console.log('[EmployeeListByCompany] Cargando empleados con filtros:', filters);
      const data = await getEmployees(filters);
      setEmployees(data);

      // Step 4: Agrupar empleados por compañía y sucursal
      const grouped: GroupedEmployees = {};
      const currentBranches = useBranchesStore.getState().branchesByCompany;
      
      data.forEach(emp => {
        let companyId: number | null = null;
        
        for (const [cId, branches] of Object.entries(currentBranches)) {
          const companyIdNum = Number(cId);
          if (branches.some(b => b.id === emp.branchId)) {
            companyId = companyIdNum;
            break;
          }
        }
        
        if (companyId === null) {
          companyId = 0;
        }
        
        if (!grouped[companyId]) {
          grouped[companyId] = {};
        }
        
        if (!grouped[companyId][emp.branchId]) {
          grouped[companyId][emp.branchId] = [];
        }
        
        grouped[companyId][emp.branchId].push(emp);
      });
      
      setGroupedEmployees(grouped);
    } catch (error) {
      console.error('[EmployeeListByCompany] Error cargando datos:', error);
      setServerError('Error al cargar la lista de empleados. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, loadCompanies, hasBranchesForCompany, setBranchesForCompany]);
  // #end-function

  // #effect Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);
  // #end-effect

  // #function handleEmployeeUpdate
  const handleEmployeeUpdate = (updated: EmployeeResponse) => {
    setEmployees(prev => prev.map(emp => emp.id === updated.id ? updated : emp));
    // Reagrupar empleados tras actualización
    const grouped: GroupedEmployees = {};
    
    employees.forEach(emp => {
      let companyId: number | null = null;
      
      for (const [cId, branches] of Object.entries(branchesByCompany)) {
        const companyIdNum = Number(cId);
        if (branches.some(b => b.id === emp.branchId)) {
          companyId = companyIdNum;
          break;
        }
      }
      
      if (companyId === null) {
        companyId = 0;
      }
      
      if (!grouped[companyId]) {
        grouped[companyId] = {};
      }
      
      if (!grouped[companyId][emp.branchId]) {
        grouped[companyId][emp.branchId] = [];
      }
      
      grouped[companyId][emp.branchId].push(emp);
    });
    
    setGroupedEmployees(grouped);
    setSelectedEmployee(null);
  };
  // #end-function



  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Cargando empleados...</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>No hay empleados registrados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {serverError && <ServerErrorBanner message={serverError} onClose={() => setServerError(null)} />}

      <div className={styles.listContainer}>
        {Object.entries(groupedEmployees).map(([companyIdStr, branchesByBranchId]) => {
          const companyId = Number(companyIdStr);
          const company = companies.find(c => c.id === companyId);
          
          if (!company) return null;

          return (
            <CompanyAccordion
              key={`company-${companyId}`}
              company={company}
            >
              <div className={styles.branchesContainer}>
                {Object.entries(branchesByBranchId).map(([branchIdStr, empList]) => {
                  const branchId = Number(branchIdStr);
                  const typedEmpList = empList as EmployeeResponse[];
                  
                  // Buscar branch en el store
                  let branchData: BranchWithSocials | null = null;
                  const companyBranches = branchesByCompany[companyId];
                  if (companyBranches) {
                    branchData = companyBranches.find(b => b.id === branchId) ?? null;
                  }
                  
                  // Si no encontramos la rama, usar un objeto fallback
                  const now = new Date().toISOString();
                  const branch: BranchWithSocials = branchData || {
                    id: branchId,
                    companyId: companyId,
                    name: `Sucursal ${branchId}`,
                    createdAt: now,
                    updatedAt: now,
                    isActive: true,
                    deletedAt: null,
                    location: null,
                    schedules: [],
                    socials: []
                  };

                  return (
                    <BranchAccordion
                      key={`branch-${companyId}-${branchId}`}
                      branch={branch}
                      displayIndex={branchId}
                      expandable={true}
                    >
                      <div className={styles.employeesListContainer}>
                        {typedEmpList.map(emp => (
                          <div
                            key={emp.id}
                            onClick={() => setSelectedEmployee(emp)}
                            className={styles.employeeRowWrapper}
                          >
                            <EmployeeRow employee={emp} onClick={() => setSelectedEmployee(emp)} />
                          </div>
                        ))}
                      </div>
                    </BranchAccordion>
                  );
                })}
              </div>
            </CompanyAccordion>
          );
        })}
      </div>

      {selectedEmployee && (
        <EmployeePermissionsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdate={handleEmployeeUpdate}
        />
      )}
    </div>
  );
};
// #end-component

export default EmployeeListByCompany;
