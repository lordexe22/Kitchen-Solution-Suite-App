// src/pages/dashboard/DevToolsPage/DevToolsPage.tsx
import { useState, useEffect } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import styles from './DevToolsPage.module.css';

type RecordData = Record<string, unknown>;

interface FieldInfo {
  name: string;
  type: string;
  isRequired?: boolean;
  isUnique?: boolean;
  isPrimaryKey?: boolean;
  hasDefault?: boolean;
  foreignKey?: {
    referencesTable: string;
    referencesField: string;
  };
}

interface TableSchema {
  tableName: string;
  description?: string;
  fields: FieldInfo[];
  primaryKeys: string[];
}

const API_BASE = 'http://localhost:3000/api/dashboard/devtools';

const DevToolsPage = () => {
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<RecordData[]>([]);
  const [tableSchema, setTableSchema] = useState<TableSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);
  const [createFormData, setCreateFormData] = useState<RecordData>({});
  const [editId, setEditId] = useState<string | number | null>(null);
  const [editFormData, setEditFormData] = useState<RecordData>({});
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);

  useEffect(() => {
    fetchTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableSchema(selectedTable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable]);

  const withCredentials = (init?: RequestInit): RequestInit => ({
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/tables`, withCredentials());

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setTables(result.data);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar tablas';
      setError(errorMessage);
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableSchema = async (table: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/tables/${table}/schema`, withCredentials());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: No se pudo obtener el schema de la tabla`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log(`✅ Schema cargado para tabla "${table}" con ${result.data.fields?.length || 0} campos`);
        setTableSchema(result.data);
        initializeCreateForm(result.data);
        setError(null);
      } else {
        throw new Error('Respuesta del servidor no válida');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar schema';
      console.error('❌ Error fetching schema:', err);
      setError(`Error al cargar schema: ${errorMessage}`);
      setTableSchema(null);
    } finally {
      setLoading(false);
    }
  };

  const initializeCreateForm = (schema: TableSchema) => {
    const form: RecordData = {};
    schema.fields.forEach(col => {
      if (!col.isPrimaryKey) {
        form[col.name] = col.type === 'boolean' ? false : '';
      }
    });
    setCreateFormData(form);
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    filters.forEach(({ key, value }) => {
      if (key && value) params.append(key, value);
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const fetchTableData = async () => {
    if (!selectedTable) {
      setError('Por favor selecciona una tabla');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCurrentRecordIndex(0);
      const response = await fetch(`${API_BASE}/${selectedTable}${buildQueryString()}`, withCredentials());

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setTableData(result.data);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos';
      setError(errorMessage);
      console.error('Error fetching table data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFilterRow = () => setFilters((prev) => [...prev, { key: '', value: '' }]);
  const updateFilterRow = (idx: number, field: 'key' | 'value', v: string) => {
    setFilters((prev) => prev.map((f, i) => (i === idx ? { ...f, [field]: v } : f)));
  };
  const removeFilterRow = (idx: number) => setFilters((prev) => prev.filter((_, i) => i !== idx));

  const createFakeUser = async () => {
    if (selectedTable !== 'users') {
      setError('La creación de datos falsos está disponible solo para la tabla "users" por ahora.');
      return;
    }

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const firstNames = ['Juan', 'María', 'Carlos', 'Laura', 'Pedro', 'Ana'];
    const lastNames = ['Pérez', 'García', 'Rodríguez', 'López', 'Martínez'];
    const firstName = firstNames[rand(0, firstNames.length - 1)];
    const lastName = lastNames[rand(0, lastNames.length - 1)];
    const email = `${firstName}.${lastName}.${Date.now()}@example.com`.toLowerCase();
    const types = ['admin', 'employee'];
    const type = types[rand(0, types.length - 1)];

    const payload: RecordData = {
      email,
      firstName,
      lastName,
      type,
      state: 'active',
    };

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/${selectedTable}`, withCredentials({
        method: 'POST',
        body: JSON.stringify(payload),
      }));

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        await fetchTableData();
      } else {
        throw new Error(result.error || 'No se pudo crear el usuario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear usuario';
      setError(errorMessage);
      console.error('Error creating fake user:', err);
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async () => {
    if (Object.keys(createFormData).length === 0) {
      setError('Completa al menos un campo para crear un registro.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/${selectedTable}`, withCredentials({
        method: 'POST',
        body: JSON.stringify(createFormData),
      }));

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const result = await response.json();
      if (result.success) {
        initializeCreateForm(tableSchema!);
        await fetchTableData();
      } else {
        throw new Error(result.error || 'No se pudo crear el registro');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear registro';
      setError(errorMessage);
      console.error('Error creating record:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEditRecord = (id: string | number, current: RecordData) => {
    setEditId(id);
    setEditFormData({ ...current });
  };

  const saveEditRecord = async () => {
    if (editId == null) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/${selectedTable}/${editId}`, withCredentials({
        method: 'PUT',
        body: JSON.stringify(editFormData),
      }));

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const result = await response.json();
      if (result.success) {
        setEditId(null);
        setEditFormData({});
        await fetchTableData();
      } else {
        throw new Error(result.error || 'No se pudo actualizar el registro');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar registro';
      setError(errorMessage);
      console.error('Error updating record:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string | number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/${selectedTable}/${id}`, withCredentials({ method: 'DELETE' }));

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const result = await response.json();
      if (result.success) {
        await fetchTableData();
      } else {
        throw new Error(result.error || 'No se pudo eliminar el registro');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar registro';
      setError(errorMessage);
      console.error('Error deleting record:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentRecord = tableData[currentRecordIndex] || null;
  const currentRecordId = currentRecord ? (currentRecord.id as string | number) : null;

  const renderInputField = (
    fieldName: string,
    fieldInfo: FieldInfo | undefined,
    value: unknown,
    onChange: (newValue: unknown) => void
  ) => {
    const type = fieldInfo?.type || 'string';
    const isRequired = fieldInfo?.isRequired;

    // Manejo de tipo boolean
    if (type === 'boolean') {
      return (
        <select 
          value={String(value)} 
          onChange={(e) => onChange(e.target.value === 'true')}
          className={styles.input}
        >
          <option value="true">Sí (true)</option>
          <option value="false">No (false)</option>
        </select>
      );
    }

    // Manejo de tipo number
    if (type === 'number') {
      return (
        <input
          type="number"
          value={value === '' || value == null ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          placeholder={`Número${isRequired ? ' (requerido)' : ''}`}
          className={styles.input}
        />
      );
    }

    // Manejo de tipo date
    if (type === 'date') {
      return (
        <input
          type="datetime-local"
          value={value ? String(value).slice(0, 16) : ''}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          placeholder={`Fecha${isRequired ? ' (requerida)' : ''}`}
        />
      );
    }

    // Manejo de tipo string (default)
    return (
      <input
        type="text"
        value={value === '' || value == null ? '' : String(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${fieldName}${isRequired ? ' (requerido)' : ''}`}
        className={styles.input}
      />
    );
  };

  return (
    <div className={styles.container}>
      <AppHeader 
        appLogoUrl={appLogoUrl} 
        appName='Kitchen Solutions' 
        onLogin={() => {}}
        onLogout={() => {}}
      />
      <div className={styles.content}>
        <DashboardNavbar />
        <main className={styles.main}>
          <h1 className={styles.title}>DevTools - Database Browser</h1>

          {error && (
            <div className={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Controls: Select table + filters + load */}
          <div className={styles.controls}>
            <div className={styles.selectGroup}>
              <label htmlFor="table-select">Seleccionar Tabla:</label>
              <select 
                id="table-select"
                value={selectedTable} 
                onChange={(e) => setSelectedTable(e.target.value)}
                className={styles.select}
                disabled={loading}
              >
                <option value="">-- Selecciona una tabla --</option>
                {tables.map((table) => (
                  <option key={table} value={table}>
                    {table}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filters}>
              <div className={styles.filtersHeader}>
                <span>Filtros</span>
                <button className={styles.secondaryButton} onClick={addFilterRow} disabled={!selectedTable || loading}>+ Añadir filtro</button>
              </div>
              {filters.map((f, idx) => (
                <div key={idx} className={styles.filterRow}>
                  <select
                    value={f.key}
                    onChange={(e) => updateFilterRow(idx, 'key', e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">-- Seleccionar campo --</option>
                    {tableSchema?.fields.map((field) => (
                      <option key={field.name} value={field.name}>
                        {field.name} ({field.type})
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="valor"
                    value={f.value}
                    onChange={(e) => updateFilterRow(idx, 'value', e.target.value)}
                  />
                  <button className={styles.iconButton} onClick={() => removeFilterRow(idx)} title="Eliminar filtro">🗑️</button>
                </div>
              ))}
            </div>

            <button 
              onClick={fetchTableData}
              className={styles.button}
              disabled={loading || !selectedTable}
            >
              {loading ? 'Cargando...' : 'Cargar Datos'}
            </button>
          </div>

          {/* Create section - Smart Form Builder */}
          {selectedTable && tableSchema && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3>Crear Registro</h3>
                {selectedTable === 'users' && (
                  <button className={styles.secondaryButton} onClick={createFakeUser} disabled={loading}>
                    Crear usuario falso
                  </button>
                )}
              </div>
              <div className={styles.formTable}>
                <div className={styles.formTableHeader}>
                  <div className={styles.fieldName}>Campo</div>
                  <div className={styles.fieldValue}>Valor</div>
                </div>
                {tableSchema.fields.map((field) => {
                  if (field.isPrimaryKey) return null;
                  return (
                    <div key={field.name} className={styles.formTableRow}>
                      <div className={styles.fieldName}>
                        <label>{field.name}</label>
                        <span className={styles.fieldHint}>
                          {field.type} {field.isRequired ? '(requerido)' : '(opcional)'}
                        </span>
                      </div>
                      <div className={styles.fieldValue}>
                        {renderInputField(
                          field.name,
                          field,
                          createFormData[field.name] ?? '',
                          (newValue) => setCreateFormData({ ...createFormData, [field.name]: newValue })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.actionsRight}>
                <button className={styles.button} onClick={createRecord} disabled={loading || !selectedTable}>
                  Crear Registro
                </button>
              </div>
            </div>
          )}

          {/* Data Viewer - JSON with Record Navigation */}
          {tableData.length > 0 && (
            <div className={styles.dataSection}>
              <h2 className={styles.subtitle}>
                Datos de "{selectedTable}" ({tableData.length} registros)
              </h2>

              {/* Record Navigation */}
              <div className={styles.recordNavigation}>
                <button 
                  onClick={() => setCurrentRecordIndex(Math.max(0, currentRecordIndex - 1))}
                  disabled={currentRecordIndex === 0}
                  className={styles.secondaryButton}
                >
                  ← Anterior
                </button>
                <span className={styles.recordInfo}>
                  Registro {currentRecordIndex + 1} de {tableData.length}
                </span>
                <button 
                  onClick={() => setCurrentRecordIndex(Math.min(tableData.length - 1, currentRecordIndex + 1))}
                  disabled={currentRecordIndex === tableData.length - 1}
                  className={styles.secondaryButton}
                >
                  Siguiente →
                </button>
              </div>

              {/* JSON Record Viewer */}
              {currentRecord && (
                <div className={styles.jsonViewer}>
                  <pre>{JSON.stringify(currentRecord, null, 2)}</pre>
                </div>
              )}

              {/* Record Actions */}
              {currentRecord && (
                <div className={styles.recordActions}>
                  <button 
                    className={styles.secondaryButton} 
                    onClick={() => startEditRecord(currentRecordId!, currentRecord)}
                  >
                    Editar Registro
                  </button>
                  <button 
                    className={styles.dangerButton} 
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                        deleteRecord(currentRecordId!);
                      }
                    }}
                  >
                    Eliminar Registro
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Edit panel - Smart Form */}
          {editId != null && tableSchema && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3>Editar Registro (ID: {String(editId)})</h3>
                <button className={styles.iconButton} onClick={() => setEditId(null)} title="Cerrar">✖️</button>
              </div>
              <div className={styles.formTable}>
                <div className={styles.formTableHeader}>
                  <div className={styles.fieldName}>Campo</div>
                  <div className={styles.fieldValue}>Valor</div>
                </div>
                {tableSchema.fields.map((field) => {
                  if (field.isPrimaryKey) return null;
                  return (
                    <div key={field.name} className={styles.formTableRow}>
                      <div className={styles.fieldName}>
                        <label>{field.name}</label>
                        <span className={styles.fieldHint}>
                          {field.type} {field.isRequired ? '(requerido)' : '(opcional)'}
                        </span>
                      </div>
                      <div className={styles.fieldValue}>
                        {renderInputField(
                          field.name,
                          field,
                          editFormData[field.name] ?? '',
                          (newValue) => setEditFormData({ ...editFormData, [field.name]: newValue })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.actionsRight}>
                <button className={styles.button} onClick={saveEditRecord} disabled={loading || !selectedTable}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && tableData.length === 0 && selectedTable && (
            <div className={styles.emptyState}>
              No hay datos para mostrar en esta tabla. Crea un nuevo registro usando el formulario anterior.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DevToolsPage;
