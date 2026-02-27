'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  calculateBookingTotals,
  createInitialBookingPaymentFormState,
  type BookingPaymentFormState,
  type BookingPaymentValidationErrors,
  validateBookingPaymentForm,
} from '@/features/tour-single/helpers/bookingPayment';

type UseTourSingleBookingPaymentFlowInput = {
  baseTourPrice: number;
  when: string;
};

export default function useTourSingleBookingPaymentFlow({
  baseTourPrice,
  when,
}: UseTourSingleBookingPaymentFlowInput) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<BookingPaymentFormState>(createInitialBookingPaymentFormState);
  const [fieldErrors, setFieldErrors] = useState<BookingPaymentValidationErrors>({});

  const totals = useMemo(() => calculateBookingTotals(baseTourPrice, formState), [baseTourPrice, formState]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setFieldErrors({});
  }, []);

  const updateField = useCallback(
    <Key extends keyof BookingPaymentFormState>(
      key: Key,
      value: BookingPaymentFormState[Key],
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
    setFormState(createInitialBookingPaymentFormState());
    setFieldErrors({});
  }, []);

  const validate = useCallback(() => {
    const errors = validateBookingPaymentForm({ when, formState });
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
