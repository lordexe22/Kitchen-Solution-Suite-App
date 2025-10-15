import { useReducer } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { LoginFormValues } from './LoginForm.types';
import { loginFormDefaultValues } from './LoginForm.config';

interface LoginFormState {
  loading: boolean;
  globalError: string | null;
}

type LoginFormAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GLOBAL_ERROR'; payload: string | null };

const initialState: LoginFormState = {
  loading: false,
  globalError: null,
};

function reducer(state: LoginFormState, action: LoginFormAction): LoginFormState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_GLOBAL_ERROR':
      return { ...state, globalError: action.payload };
    default:
      return state;
  }
}

export const useLoginForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const form = useForm<LoginFormValues>({
    defaultValues: loginFormDefaultValues,
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    console.log('Datos a enviar:', data);
    setTimeout(() => dispatch({ type: 'SET_LOADING', payload: false }), 500); // simulación
  };

  return { form, state, dispatch, onSubmit };
};
