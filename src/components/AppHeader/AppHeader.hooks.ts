import { useReducer, useEffect, useRef, useCallback } from 'react';

// #interface DropdownState
/**
 * Estado del dropdown
 */
interface DropdownState {
  isOpen: boolean;
}
// #end-interface

// #type DropdownAction
/**
 * Acciones disponibles para el reducer del dropdown
 */
type DropdownAction =
  | { type: 'OPEN_DROPDOWN' }
  | { type: 'CLOSE_DROPDOWN' }
  | { type: 'TOGGLE_DROPDOWN' };
// #end-type

// #interface UseDropdownOptions
/**
 * Opciones de configuración para el hook useDropdown
 */
interface UseDropdownOptions {
  /** Cerrar dropdown al hacer clic fuera (default: true) */
  closeOnClickOutside?: boolean;
  /** Cerrar dropdown al presionar ESC (default: true) */
  closeOnEscape?: boolean;
  /** Cerrar dropdown al hacer clic en un item (default: true) */
  closeOnItemClick?: boolean;
  /** Callback ejecutado cuando se abre el dropdown */
  onOpen?: () => void;
  /** Callback ejecutado cuando se cierra el dropdown */
  onClose?: () => void;
}
// #end-interface

// #interface UseDropdownReturn
/**
 * Valor retornado por el hook useDropdown
 */
interface UseDropdownReturn {
  /** Estado actual del dropdown (abierto/cerrado) */
  isOpen: boolean;
  /** Función para abrir el dropdown */
  open: () => void;
  /** Función para cerrar el dropdown */
  close: () => void;
  /** Función para alternar el estado del dropdown */
  toggle: () => void;
  /** Ref al elemento del dropdown (para detectar clicks fuera) */
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  /** Función para manejar click en un item del dropdown */
  handleItemClick: (onClick?: () => void) => void;
}
// #end-interface

// #reducer dropdownReducer
/**
 * Reducer para manejar el estado del dropdown
 */
const dropdownReducer = (state: DropdownState, action: DropdownAction): DropdownState => {
  switch (action.type) {
    case 'OPEN_DROPDOWN':
      return { isOpen: true };
    case 'CLOSE_DROPDOWN':
      return { isOpen: false };
    case 'TOGGLE_DROPDOWN':
      return { isOpen: !state.isOpen };
    default:
      return state;
  }
};
// #end-reducer

// #hook useDropdown
/**
 * Hook personalizado para manejar el estado y comportamiento de un dropdown
 * Incluye funcionalidades de accesibilidad y UX mejoradas
 * 
 * @param options - Opciones de configuración del dropdown
 * @returns Objeto con estado y funciones para controlar el dropdown
 * 
 * @example
 * const { isOpen, toggle, dropdownRef, handleItemClick } = useDropdown({
 *   closeOnClickOutside: true,
 *   closeOnEscape: true,
 *   onOpen: () => console.log('Dropdown abierto'),
 * });
 */
export const useDropdown = (options: UseDropdownOptions = {}): UseDropdownReturn => {
  const {
    closeOnClickOutside = true,
    closeOnEscape = true,
    closeOnItemClick = true,
    onOpen,
    onClose,
  } = options;

  // Estado del dropdown usando useReducer
  const [state, dispatch] = useReducer(dropdownReducer, { isOpen: false });

  // Ref al elemento del dropdown para detectar clicks fuera
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Funciones para controlar el dropdown
  const open = useCallback(() => {
    dispatch({ type: 'OPEN_DROPDOWN' });
  }, []);

  const close = useCallback(() => {
    dispatch({ type: 'CLOSE_DROPDOWN' });
  }, []);

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_DROPDOWN' });
  }, []);

  // Manejar click en un item del dropdown
  const handleItemClick = useCallback((onClick?: () => void) => {
    // Ejecutar el callback del item si existe
    if (onClick) {
      onClick();
    }
    
    // Cerrar el dropdown si está configurado así
    if (closeOnItemClick) {
      close();
    }
  }, [closeOnItemClick, close]);

  // Ejecutar callbacks cuando cambia el estado
  useEffect(() => {
    if (state.isOpen && onOpen) {
      onOpen();
    } else if (!state.isOpen && onClose) {
      onClose();
    }
  }, [state.isOpen, onOpen, onClose]);

  // Manejar click fuera del dropdown
  useEffect(() => {
    if (!closeOnClickOutside || !state.isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    // Agregar listener con un pequeño delay para evitar que el click que abre el dropdown lo cierre inmediatamente
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickOutside, state.isOpen, close]);

  // Manejar tecla ESC para cerrar
  useEffect(() => {
    if (!closeOnEscape || !state.isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closeOnEscape, state.isOpen, close]);

  return {
    isOpen: state.isOpen,
    open,
    close,
    toggle,
    dropdownRef,
    handleItemClick,
  };
};
// #end-hook