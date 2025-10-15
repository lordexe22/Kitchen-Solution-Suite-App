import type { RegisterOptions } from 'react-hook-form';
import type { LoginFormValues } from './LoginForm.types';

export const loginFormDefaultValues: LoginFormValues = {
  email: '',
  password: '',
};

export const loginFormValidation: Record<keyof LoginFormValues, RegisterOptions> = {
  email: {
    required: 'El correo electrónico es obligatorio',
    validate: (value: string) =>
      value.includes('@') && value.includes('.') || 'Debe ser un correo válido',
  },
  password: {
    required: 'La contraseña es obligatoria',
  },
};
