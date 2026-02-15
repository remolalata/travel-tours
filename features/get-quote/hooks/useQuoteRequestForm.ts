'use client';

import { useCallback, useReducer } from 'react';

export interface QuoteFormState {
  where: string;
  when: string;
  tourType: string;
  adults: string;
  children: string;
  budget: string;
  hotelClass: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

interface QuoteRequestState {
  form: QuoteFormState;
  isSubmitted: boolean;
}

interface UseQuoteRequestFormOptions {
  initialLocation?: string;
  initialTourType?: string;
  initialAdults?: string;
  initialChildren?: string;
}

type QuoteRequestAction =
  | {
      type: 'updateField';
      field: keyof QuoteFormState;
      value: string;
    }
  | {
      type: 'submit';
    }
  | {
      type: 'reset';
      payload?: UseQuoteRequestFormOptions;
    };

const createQuoteFormState = ({
  initialLocation = '',
  initialTourType = '',
  initialAdults = '',
  initialChildren = '',
}: UseQuoteRequestFormOptions = {}): QuoteFormState => ({
  where: initialLocation,
  when: '',
  tourType: initialTourType,
  adults: initialAdults,
  children: initialChildren,
  budget: '',
  hotelClass: '',
  fullName: '',
  email: '',
  phone: '',
  notes: '',
});

const createInitialState = (options: UseQuoteRequestFormOptions): QuoteRequestState => ({
  form: createQuoteFormState(options),
  isSubmitted: false,
});

const quoteRequestReducer = (
  state: QuoteRequestState,
  action: QuoteRequestAction,
): QuoteRequestState => {
  switch (action.type) {
    case 'updateField':
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value,
        },
      };
    case 'submit':
      return {
        ...state,
        isSubmitted: true,
      };
    case 'reset':
      return createInitialState(action.payload ?? {});
    default:
      return state;
  }
};

export default function useQuoteRequestForm(options: UseQuoteRequestFormOptions = {}) {
  const [state, dispatch] = useReducer(quoteRequestReducer, options, createInitialState);

  const updateField = useCallback((field: keyof QuoteFormState, value: string) => {
    dispatch({ type: 'updateField', field, value });
  }, []);

  const submit = useCallback(() => {
    dispatch({ type: 'submit' });
  }, []);

  const reset = useCallback((payload?: UseQuoteRequestFormOptions) => {
    dispatch({ type: 'reset', payload });
  }, []);

  return {
    formState: state.form,
    isSubmitted: state.isSubmitted,
    updateField,
    submit,
    reset,
  };
}
