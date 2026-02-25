'use client';

import { useCallback, useReducer } from 'react';

import {
  validateQuoteRequestForm,
  type ValidationErrors,
} from '@/utils/helpers/formValidation';

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
  fieldErrors: ValidationErrors<QuoteFormState>;
  isSubmitted: boolean;
}

interface UseQuoteRequestFormOptions {
  initialLocation?: string;
  initialWhen?: string;
  initialTourType?: string;
  initialAdults?: string;
  initialChildren?: string;
  initialFullName?: string;
  initialEmail?: string;
  initialPhone?: string;
}

type QuoteRequestAction =
  | {
      type: 'updateField';
      field: keyof QuoteFormState;
      value: string;
    }
  | {
      type: 'setFieldErrors';
      fieldErrors: ValidationErrors<QuoteFormState>;
      isSubmitted?: boolean;
    }
  | {
      type: 'reset';
      payload?: UseQuoteRequestFormOptions;
    };

const createQuoteFormState = ({
  initialLocation = '',
  initialWhen = '',
  initialTourType = '',
  initialAdults = '',
  initialChildren = '',
  initialFullName = '',
  initialEmail = '',
  initialPhone = '',
}: UseQuoteRequestFormOptions = {}): QuoteFormState => ({
  where: initialLocation,
  when: initialWhen,
  tourType: initialTourType,
  adults: initialAdults,
  children: initialChildren,
  budget: '',
  hotelClass: '',
  fullName: initialFullName,
  email: initialEmail,
  phone: initialPhone,
  notes: '',
});

const createInitialState = (options: UseQuoteRequestFormOptions): QuoteRequestState => ({
  form: createQuoteFormState(options),
  fieldErrors: {},
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
        fieldErrors: {
          ...state.fieldErrors,
          [action.field]: undefined,
        },
        isSubmitted: false,
      };
    case 'setFieldErrors':
      return {
        ...state,
        fieldErrors: action.fieldErrors,
        isSubmitted: action.isSubmitted ?? state.isSubmitted,
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
    const errors = validateQuoteRequestForm({
      where: state.form.where,
      when: state.form.when,
      tourType: state.form.tourType,
      adults: state.form.adults,
      budget: state.form.budget,
      hotelClass: state.form.hotelClass,
      fullName: state.form.fullName,
      email: state.form.email,
      phone: state.form.phone,
    });

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'setFieldErrors', fieldErrors: errors, isSubmitted: false });
      return false;
    }

    dispatch({ type: 'setFieldErrors', fieldErrors: {}, isSubmitted: true });
    return true;
  }, [state.form]);

  const reset = useCallback((payload?: UseQuoteRequestFormOptions) => {
    dispatch({ type: 'reset', payload });
  }, []);

  return {
    formState: state.form,
    fieldErrors: state.fieldErrors,
    isSubmitted: state.isSubmitted,
    updateField,
    submit,
    reset,
  };
}
