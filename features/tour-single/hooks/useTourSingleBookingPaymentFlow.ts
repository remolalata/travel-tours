'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  calculateSimulatedBookingTotals,
  createInitialSimulatedBookingPaymentFormState,
  type SimulatedBookingPaymentFormState,
  type SimulatedBookingPaymentValidationErrors,
  validateSimulatedBookingPaymentForm,
} from '@/features/tour-single/helpers/simulatedBookingPayment';

type UseTourSingleBookingPaymentFlowInput = {
  baseTourPrice: number;
  when: string;
};

export default function useTourSingleBookingPaymentFlow({
  baseTourPrice,
  when,
}: UseTourSingleBookingPaymentFlowInput) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<SimulatedBookingPaymentFormState>(
    createInitialSimulatedBookingPaymentFormState,
  );
  const [fieldErrors, setFieldErrors] = useState<SimulatedBookingPaymentValidationErrors>({});

  const totals = useMemo(
    () => calculateSimulatedBookingTotals(baseTourPrice, formState),
    [baseTourPrice, formState],
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setFieldErrors({});
  }, []);

  const updateField = useCallback(
    <Key extends keyof SimulatedBookingPaymentFormState>(
      key: Key,
      value: SimulatedBookingPaymentFormState[Key],
    ) => {
      setFormState((previousValue) => ({
        ...previousValue,
        [key]: value,
      }));
      setFieldErrors((previousValue) => ({ ...previousValue, [key]: undefined }));
    },
    [],
  );

  const reset = useCallback(() => {
    setFormState(createInitialSimulatedBookingPaymentFormState());
    setFieldErrors({});
  }, []);

  const validate = useCallback(() => {
    const errors = validateSimulatedBookingPaymentForm({ when, formState });
    setFieldErrors(errors);
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [formState, when]);

  return {
    isOpen,
    formState,
    fieldErrors,
    totals,
    open,
    close,
    reset,
    updateField,
    validate,
  };
}

