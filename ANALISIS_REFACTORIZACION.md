# Análisis Profundo: Refactorización de Arquitectura de Páginas

## 📋 Resumen Ejecutivo

Se ha identificado una **alta duplicación de código** en la arquitectura actual de páginas. Las páginas `SchedulePage`, `SocialsPage` y `ProductsPage` siguen un patrón idéntico:

1. Renderizar `AppHeader` + `DashboardNavbar`
2. Cargar lista de compañías
3. Para cada compañía, mostrar lista de sucursales
4. Dentro de cada sucursal, mostrar contenido específico de la sección

**Propuesta:** Consolidar todas estas páginas en una única página de **Gestión de Sucursales Dinámica** que cambia el contenido según la sección seleccionada en el navbar.

---

## 🔍 Análisis Actual

### Estructura de Archivos (Antes)

```
src/pages/dashboard/
├── CompaniesPage/
│   ├── CompaniesPage.tsx (304 líneas)
│   └── CompaniesPage.module.css
├── SchedulePage/
│   ├── SchedulePage.tsx (288 líneas)
│   └── SchedulePage.module.css
├── SocialsPage/
│   ├── SocialsPage.tsx (283 líneas)
│   └── SocialsPage.module.css
├── ProductsPage/
│   ├── ProductsPage.tsx (784 líneas)
│   └── ProductsPage.module.css
├── EmployeesPage/
│   ├── EmployeesPage.tsx (~30 líneas)
│   └── EmployeesPage.module.css
└── WelcomePage/
    └── ...
```

### Patrón Duplicado Identificado

Todas estas páginas comparten la misma estructura:

```tsx
<div className={styles.container}>
  <AppHeader ... />
  <div className={styles.content}>
    <DashboardNavbar />          {/* ← Mismo en todas */}
    <main className={styles.main}>
      {/* Header con título y subtítulo */}
      <div className={styles.header}>
        <h1 className={styles.title}>...</h1>
        <p className={styles.subtitle}>...</p>
      </div>

      {/* Error handling */}
      {error && <div className={styles.error}>...</div>}

      {/* Loading state */}
      {isLoading && <div className={styles.loading}>...</div>}

      {/* Empty state */}
      {!isLoading && companies.length === 0 && <EmptyState ... />}

      {/* Main content: Companies → Branches → Content */}
      {companies.length > 0 && (
        <div className={styles.accordionList}>
          {companies.map((company) => (
            <CompanyAccordion ... >
              <BranchSection companyId={company.id} />
            </CompanyAccordion>
          ))}
        </div>
      )}
    </main>
  </div>
</div>
```

### Componentes Internos Específicos

Cada página define su propio componente interno `*Section`:

| Página | Componente Interno | Responsabilidad |
|--------|-------------------|-----------------|
| **CompaniesPage** | `BranchesSection` | CRUD de sucursales, editar nombres, ubicaciones |
| **SchedulePage** | `BranchSchedulesSection` | Cargar/editar horarios por sucursal |
| **SocialsPage** | `BranchSocialsSection` | Cargar/editar redes sociales por sucursal |
| **ProductsPage** | `BranchProductsSection` | Categorías y productos con drag-drop |

### Análisis de Líneas de Código

```
CompaniesPage:     304 líneas (estructura general + lógica específica)
SchedulePage:      288 líneas (estructura general + lógica específica)
SocialsPage:       283 líneas (estructura general + lógica específica)
ProductsPage:      784 líneas (estructura general + lógica muy compleja)
EmployeesPage:      30 líneas (solo estructura)
─────────────────────────────
TOTAL:           1,689 líneas

Código duplicado (estructura): ~400 líneas (24%)
Código específico: ~1,289 líneas (76%)
```

---

## 💡 Propuesta de Solución

### Arquitectura Propuesta (Después)

```
src/pages/dashboard/
├── BranchManagementPage/          {← NUEVA PÁGINA ÚNICA}
│   ├── BranchManagementPage.tsx   (estructura general + estado global)
│   ├── BranchManagementPage.module.css
│   ├── sections/
│   │   ├── BranchesEditSection.tsx    (antes en CompaniesPage)
│   │   ├── BranchSchedulesSection.tsx (antes en SchedulePage)
│   │   ├── BranchSocialsSection.tsx   (antes en SocialsPage)
│   │   ├── BranchProductsSection.tsx  (antes en ProductsPage)
│   │   └── useSelectedSection.ts      (hook para gestionar sección activa)
│   └── index.ts
├── CompaniesPage/        {← CONSERVADO: gestión pura de compañías}
├── EmployeesPage/        {← CONSERVADO: puede expandirse}
├── WelcomePage/          {← CONSERVADO}
└── ...
```

### Cambios en Routing (App.tsx)

**Antes:**
```tsx
<Route path="/dashboard/schedules" element={<SchedulesPage />} />
<Route path="/dashboard/socials" element={<SocialsPage />} />
<Route path="/dashboard/products" element={<ProductsPage />} />
```

**Después:**
```tsx
<Route path="/dashboard/branches/:section?" element={<BranchManagementPage />} />
// Rutas válidas:
// - /dashboard/branches                    (por defecto: schedules)
// - /dashboard/branches/schedules
// - /dashboard/branches/socials
// - /dashboard/branches/products
```

### Actualización de DashboardNavbar

**Antes:**
```tsx
NAV_ITEMS: [
  { id: 'schedules', label: 'Horarios', path: '/dashboard/schedules' },
  { id: 'socials', label: 'Redes Sociales', path: '/dashboard/socials' },
  { id: 'products', label: 'Productos', path: '/dashboard/products' },
]
```

**Después:**
```tsx
NAV_ITEMS: [
  { id: 'schedules', label: 'Horarios', path: '/dashboard/branches/schedules' },
  { id: 'socials', label: 'Redes Sociales', path: '/dashboard/branches/socials' },
  { id: 'products', label: 'Productos', path: '/dashboard/branches/products' },
]
```

---

## 🏗️ Estructura Detallada del Componente Principal

### BranchManagementPage.tsx

```tsx
// Responsabilidades:
// 1. Layout base (AppHeader + DashboardNavbar + main)
// 2. Cargar compañías (hook useCompanies)
// 3. Determinar sección activa desde URL
// 4. Mostrar/ocultar secciones basado en parámetro
// 5. Gestionar estado global para error handling

type SectionType = 'schedules' | 'socials' | 'products';

interface SectionConfig {
  id: SectionType;
  title: string;
  subtitle: string;
  icon: string;
  component: React.ComponentType<BranchSectionProps>;
}

const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
  schedules: {
    id: 'schedules',
    title: '🕐 Horarios de Atención',
    subtitle: 'Configura los horarios de todas tus sucursales...',
    icon: '🕐',
    component: BranchSchedulesSection,
  },
  socials: {
    id: 'socials',
    title: '🌐 Redes Sociales',
    subtitle: 'Configura las redes sociales de todas tus sucursales...',
    icon: '🌐',
    component: BranchSocialsSection,
  },
  products: {
    id: 'products',
    title: '🍽️ Productos y Categorías',
    subtitle: 'Crea categorías para organizar tus productos...',
    icon: '📦',
    component: BranchProductsSection,
  },
};
```

### Hook useSelectedSection

```tsx
// Custom hook para gestionar sección activa desde URL
// Retorna:
// - activeSection: SectionType actual
// - navigateToSection: función para cambiar sección
// - sectionConfig: configuración de la sección actual

export const useSelectedSection = (defaultSection: SectionType = 'schedules') => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  
  const isValidSection = (s: string | undefined): s is SectionType =>
    s && Object.keys(SECTION_CONFIGS).includes(s);

  const activeSection = isValidSection(section) ? section : defaultSection;

  const navigateToSection = (newSection: SectionType) => {
    navigate(`/dashboard/branches/${newSection}`);
  };

  return { activeSection, navigateToSection, sectionConfig: SECTION_CONFIGS[activeSection] };
};
```

---

## 📊 Comparativa de Impacto

### Reducción de Código

| Métrica | Antes | Después | Reducción |
|---------|-------|---------|-----------|
| Archivos de página | 5 | 1 | 80% ↓ |
| Componentes de sección | 4 (inline) | 4 (módulos) | 0% |
| Líneas duplicadas | ~400 | 0 | 100% ↓ |
| Rutas en App.tsx | 5 | 1 | 80% ↓ |
| Archivos CSS | 5 | 1 | 80% ↓ |
| **Total líneas (estructura)** | ~1,689 | ~900 | **47% ↓** |

### Beneficios

1. **Mantenibilidad**: Un solo lugar para cambiar layout base
2. **DRY (Don't Repeat Yourself)**: Eliminación de código duplicado
3. **Escalabilidad**: Agregar nuevas secciones es trivial
4. **Performance**: Navegación entre secciones sin page reload (SPA puro)
5. **Consistencia**: Todas las secciones heredan el mismo comportamiento
6. **Testing**: Menos páginas = menos casos de prueba de estructura

### Desventajas / Consideraciones

1. **Learning curve**: Desarrolladores nuevos necesitarán entender el sistema modular
2. **Transición**: Hay trabajo para realizar la migración
3. **Bookmarking**: URLs cambian (⚠️ usuarios con bookmarks anteriores)
4. **SEO**: Menor impacto (no es crítico en aplicación de dashboard privada)

---

## 🎯 Plan de Implementación

### Fase 1: Preparación
1. Crear directorio `src/pages/dashboard/BranchManagementPage`
2. Crear `useSelectedSection.ts` hook
3. Definir tipos e interfaces compartidas
4. Crear `SECTION_CONFIGS` como fuente única de verdad

### Fase 2: Migración de Secciones
1. Extraer `BranchesEditSection` de `CompaniesPage`
2. Extraer `BranchSchedulesSection` de `SchedulePage`
3. Extraer `BranchSocialsSection` de `SocialsPage`
4. Extraer `BranchProductsSection` de `ProductsPage`
5. Crear archivo de índices (`sections/index.ts`)

### Fase 3: Crear Página Unificada
1. Crear `BranchManagementPage.tsx` con layout base
2. Implementar lógica de sección activa (URL params)
3. Renderizar sección dinámicamente basada en configuración
4. Integrar manejo de errores global

### Fase 4: Actualizar Routing
1. Reemplazar 5 rutas con 1 ruta parametrizada en `App.tsx`
2. Actualizar `DashboardNavbar.config.ts` con nuevas rutas
3. Testear navegación entre secciones

### Fase 5: Limpieza y Optimización
1. **No eliminar páginas antiguas aún** (mantener durante período de transición)
2. Documentar patrones en nuevas secciones
3. Considerar eliminar páginas antiguas una vez validado
4. Optimizar CSS (consolidar estilos comunes)

### Fase 6: Actualización de Compañías (Opcional)
1. Decidir si `CompaniesPage` permanece como página independiente
2. Si se mantiene: crear su propia sección dentro del nuevo sistema
3. Si se consolida: integrar `BranchesEditSection` en la sección "branches"

---

## 🔧 Ejemplo de Implementación Mínima

### Pseudocódigo de BranchManagementPage

```tsx
import { useParams } from 'react-router-dom';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import { useCompanies } from '../../../hooks/useCompanies';
import { useSelectedSection } from './useSelectedSection';

// Importar todas las secciones
import BranchSchedulesSection from './sections/BranchSchedulesSection';
import BranchSocialsSection from './sections/BranchSocialsSection';
import BranchProductsSection from './sections/BranchProductsSection';
import BranchesEditSection from './sections/BranchesEditSection';

import styles from './BranchManagementPage.module.css';

const BranchManagementPage = () => {
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  const { companies, isLoading, error, loadCompanies } = useCompanies();
  const { activeSection, sectionConfig } = useSelectedSection();
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Mapeo dinámico de sección a componente
  const sectionComponents = {
    schedules: BranchSchedulesSection,
    socials: BranchSocialsSection,
    products: BranchProductsSection,
  };

  const SectionComponent = sectionComponents[activeSection];

  return (
    <div className={styles.container}>
      <AppHeader appLogoUrl={appLogoUrl} appName="Kitchen Solutions" />
      
      <div className={styles.content}>
        <DashboardNavbar />
        
        <main className={styles.main}>
          {/* Header dinámico desde configuración */}
          <div className={styles.header}>
            <h1 className={styles.title}>{sectionConfig.title}</h1>
            <p className={styles.subtitle}>{sectionConfig.subtitle}</p>
          </div>

          {/* Error handling */}
          {(error || globalError) && (
            <div className={styles.error}>
              <p>❌ {error || globalError}</p>
              <button onClick={() => setGlobalError(null)}>✕</button>
            </div>
          )}

          {/* Loading */}
          {isLoading && <div className={styles.loading}>Cargando...</div>}

          {/* Empty state */}
          {!isLoading && companies.length === 0 && (
            <EmptyState
              title="No hay compañías"
              description="Crea tu primera compañía para comenzar"
            />
          )}

          {/* Contenido dinámico */}
          {companies.length > 0 && (
            <div className={styles.accordionList}>
              {companies.map((company) => (
                <CompanyAccordion key={company.id} company={company}>
                  <SectionComponent
                    companyId={company.id}
                    onError={setGlobalError}
                  />
                </CompanyAccordion>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BranchManagementPage;
```

---

## 📋 Checklist de Migración

- [ ] Crear directorio `BranchManagementPage`
- [ ] Crear `useSelectedSection.ts` hook
- [ ] Crear `SECTION_CONFIGS` tipo y datos
- [ ] Extraer y adaptar `BranchSchedulesSection`
- [ ] Extraer y adaptar `BranchSocialsSection`
- [ ] Extraer y adaptar `BranchProductsSection`
- [ ] Extraer y adaptar `BranchesEditSection`
- [ ] Crear `BranchManagementPage.tsx`
- [ ] Crear `BranchManagementPage.module.css`
- [ ] Actualizar `App.tsx` (ruta parametrizada)
- [ ] Actualizar `DashboardNavbar.config.ts`
- [ ] Testear navegación entre secciones
- [ ] Documentar patrón en secciones
- [ ] Decidir sobre eliminar páginas antiguas
- [ ] Actualizar documentación de proyecto

---

## ⚠️ Notas Importantes

1. **No es una refactorización "todo o nada"**: Puedes mantener páginas antiguas activas durante la transición
2. **Validación de rutas**: Asegurar que solo secciones válidas sean accesibles
3. **Estado compartido**: Considerar si usar Context API para estado global entre secciones
4. **CSS modular**: Mantener estilos CSS separados por sección para evitar conflictos
5. **Redirección de antiguas rutas**: Considerar redireccionar `/dashboard/schedules` → `/dashboard/branches/schedules` por compatibilidad

---

## 🎓 Conclusión

La refactorización propuesta **reduciría significativamente el volumen de código duplicado** (47% de reducción en líneas de estructura) mientras **mejora la mantenibilidad y escalabilidad**. La implementación es viable en 2-3 días de trabajo y se puede hacer de manera incremental sin romper funcionalidad existente.

**Recomendación**: Proceder con la implementación en fases, manteniendo compatibilidad hacia atrás durante la transición.
