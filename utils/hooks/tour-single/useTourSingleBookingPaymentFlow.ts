'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  type BookingPaymentFormState,
  type BookingPaymentValidationErrors,
  type BookingTravelerFormState,
  calculateBookingTotals,
  createInitialBookingPaymentFormState,
  syncTravelersWithCounts,
  validateBookingPaymentForm,
} from '@/utils/helpers/tour-single/bookingPayment';

type UseTourSingleBookingPaymentFlowInput = {
  baseTourPrice: number;
  when: string;
};

export default function useTourSingleBookingPaymentFlow({
  baseTourPrice,
  when,
}: UseTourSingleBookingPaymentFlowInput) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<BookingPaymentFormState>(
    createInitialBookingPaymentFormState,
  );
  const [fieldErrors, setFieldErrors] = useState<BookingPaymentValidationErrors>({});

  const totals = useMemo(
    () => calculateBookingTotals(baseTourPrice, formState),
    [baseTourPrice, formState],
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setFieldErrors({});
  }, []);

  const updateField = useCallback(
    <Key extends keyof BookingPaymentFormState>(key: Key, value: BookingPaymentFormState[Key]) => {
      setFormState((previousValue) => {
        const nextValue = {
          ...previousValue,
          [key]: value,
        };

        if (key === 'adults' || key === 'children') {
          nextValue.travelers = syncTravelersWithCounts(nextValue.travelers, {
            adults: nextValue.adults,
            children: nextValue.children,
          });
        }

        return nextValue;
      });
      setFieldErrors((previousValue) => ({ ...previousValue, [key]: undefined }));
    },
    [],
  );

  const updateTravelerField = useCallback(
    <Key extends keyof BookingTravelerFormState>(
      index: number,
      key: Key,
      value: BookingTravelerFormState[Key],
    ) => {
      setFormState((previousValue) => ({
        ...previousValue,
        travelers: previousValue.travelers.map((traveler, travelerIndex) =>
          travelerIndex === index
            ? {
                ...traveler,
                [key]: value,
              }
            : traveler,
        ),
      }));
      setFieldErrors((previousValue) => ({
        ...previousValue,
        [`travelers.${index}.${String(key)}`]: undefined,
      }));
    },
    [],
  );

  const replaceFormState = useCallback((value: Partial<BookingPaymentFormState>) => {
    setFormState((previousValue) => {
      const nextValue = {
        ...previousValue,
        ...value,
      };

      nextValue.travelers = syncTravelersWithCounts(value.travelers ?? previousValue.travelers, {
        adults: nextValue.adults,
        children: nextValue.children,
      });

      return nextValue;
    });
    setFieldErrors({});
  }, []);

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
    updateTravelerField,
    replaceFormState,
    validate,
  };
}
