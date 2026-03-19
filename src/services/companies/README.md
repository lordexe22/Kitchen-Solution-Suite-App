# companies

## Propósito

Servicio encargado de todas las operaciones CRUD sobre compañías del usuario autenticado: listado, creación, actualización, eliminación, archivado, reactivación, verificación de disponibilidad de nombre y gestión del logo.

## Operaciones

| Función | Descripción |
|---|---|
| `getAllCompanies(params?)` | Lista las compañías del usuario con filtrado y paginación |
| `createCompany(data)` | Crea una nueva compañía |
| `updateCompany(id, data)` | Actualiza datos de una compañía existente |
| `deleteCompany(id)` | Elimina permanentemente una compañía |
| `archiveCompany(id)` | Archiva una compañía sin eliminarla |
| `reactivateCompany(id)` | Reactiva una compañía archivada |
| `checkNameAvailability(name)` | Verifica si un nombre está disponible |
| `uploadCompanyLogo(id, file)` | Sube o reemplaza el logo de una compañía |
| `deleteCompanyLogo(id)` | Elimina el logo de una compañía |

## Uso

```ts
import { getAllCompanies, createCompany } from '../services/companies';
```

## Exports

- Funciones: todas las listadas en la tabla
- Tipos: `GetAllCompaniesParams`, `GetAllCompaniesResponse`, `CreateCompanyResponse`, `UpdateCompanyResponse`, `DeleteCompanyResponse`, `CheckNameResponse`

## Dependencias

- `httpClient` — cliente HTTP de la aplicación (`api/httpClient.instance`)
- `Company`, `CompanyFormData` — tipos del dominio (`types/companies.types`)
