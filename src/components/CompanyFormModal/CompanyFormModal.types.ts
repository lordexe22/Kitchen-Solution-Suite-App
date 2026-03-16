/* src/components/CompanyFormModal/CompanyFormModal.types.ts */
import type { Company, CompanyFormData } from '../../types/companies.types';

// #interface CompanyFormModalProps - Props del componente CompanyFormModal
/**
 * @description
 * Props recibidas por el componente modal de creación y edición de compañías.
 *
 * @purpose
 * Proveer al componente los datos necesarios para operar en modo creación o edición,
 * y los callbacks para comunicar el resultado al componente padre.
 *
 * @context
 * Utilizado por CompanyFormModal, montado desde el dashboard de compañías.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface CompanyFormModalProps {
  // #v-field company - compañía a editar (opcional)
  /** compañía existente a editar; si está ausente el modal opera en modo creación */
  company?: Company;
  // #end-v-field
  // #f-field onClose - callback para cerrar el modal
  /** callback invocado para cerrar el modal */
  onClose: () => void;
  // #end-f-field
  // #f-field onSubmit - callback para crear o actualizar una compañía
  /** callback para crear o actualizar; recibe los datos del form y retorna la compañía guardada */
  onSubmit: (data: CompanyFormData, setFormError: (error: string) => void) => Promise<Company>;
  // #end-f-field
  // #f-field onUploadLogo - callback para subir el logo de la compañía
  /** callback opcional para subir una imagen como logo de la compañía */
  onUploadLogo?: (companyId: number, file: File) => Promise<Company>;
  // #end-f-field
  // #f-field onDeleteLogo - callback para eliminar el logo de la compañía
  /** callback opcional para eliminar el logo actual de la compañía */
  onDeleteLogo?: (companyId: number) => Promise<Company>;
  // #end-f-field
}
// #end-interface
