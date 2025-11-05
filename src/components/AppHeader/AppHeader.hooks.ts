/* src\components\AppHeader\AppHeader.hooks.ts */
// #section imports
import { useReducer, useEffect, useRef, useCallback } from 'react';
import type {DropdownState, DropdownAction, UseDropdownOptions, UseDropdownReturn} from './AppHeader.types'
// #end-section
// #function dropdownReducer
/**
 * Reducer logic for handle the drop-down state.
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
// #end-function
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

  // #function open - execute dropdown with type: 'OPEN_DROPDOWN'
  const open = useCallback(() => {
    dispatch({ type: 'OPEN_DROPDOWN' });
  }, []);
  // #end-function
  // #function close - execute dropdown with type: 'CLOSE_DROPDOWN'
  const close = useCallback(() => {
    dispatch({ type: 'CLOSE_DROPDOWN' });
  }, []);
  // #end-function
  // #function toggle - execute dropdown with type: 'TOGGLE_DROPDOWN'
  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_DROPDOWN' });
  }, []);
  // #end-function

  // #event handleItemClick - handle when click in an item of the dropdown 
  const handleItemClick = useCallback((onClick?: () => void) => {
    // #step 1 - if exists, execute callback function for the clicked button
    if (onClick) {
      onClick();
    }
    // #end-step
    // #step 2 - if confgured, close dropdown after click
    if (closeOnItemClick) {
      close();
    }
    // #end-step
  }, [closeOnItemClick, close]);
  // #end-event

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