export type SimulatedPaymentOption = 'full' | 'partial' | 'reserve';

export type SimulatedBookingPaymentFormState = {
  adults: string;
  children: string;
  paymentOption: SimulatedPaymentOption;
  notes: string;
};

export type SimulatedBookingPaymentValidationErrors = Partial<
  Record<keyof SimulatedBookingPaymentFormState | 'when', string>
>;

export type SimulatedBookingPaymentTotals = {
  travelers: number;
  totalAmount: number;
  amountToChargeNow: number;
};

const CHILD_RATE_MULTIPLIER = 0.7;
const PARTIAL_RATE_MULTIPLIER = 0.35;

function parseWholeNumber(value: string, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;

  return Math.max(0, Math.floor(parsed));
}

export function calculateSimulatedBookingTotals(
  baseTourPrice: number,
  formState: SimulatedBookingPaymentFormState,
): SimulatedBookingPaymentTotals {
  const adults = Math.max(1, parseWholeNumber(formState.adults, 1));
  const children = parseWholeNumber(formState.children, 0);
  const totalAmount = Math.round((baseTourPrice * adults + baseTourPrice * CHILD_RATE_MULTIPLIER * children) * 100) / 100;

  let amountToChargeNow = 0;
  if (formState.paymentOption === 'full') {
    amountToChargeNow = totalAmount;
  } else if (formState.paymentOption === 'partial') {
    amountToChargeNow = Math.round(totalAmount * PARTIAL_RATE_MULTIPLIER * 100) / 100;
  }

  return {
    travelers: adults + children,
    totalAmount,
    amountToChargeNow,
  };
}

export function validateSimulatedBookingPaymentForm(input: {
  when: string;
  formState: SimulatedBookingPaymentFormState;
}): SimulatedBookingPaymentValidationErrors {
  const errors: SimulatedBookingPaymentValidationErrors = {};
  const adults = Number(input.formState.adults);
  const children = Number(input.formState.children);

  if (!input.when.trim()) {
    errors.when = 'required_when';
  }

  if (!input.formState.adults.trim()) {
    errors.adults = 'required_adults';
  } else if (!Number.isFinite(adults) || adults < 1 || !Number.isInteger(adults)) {
    errors.adults = 'invalid_adults';
  }

  if (input.formState.children.trim()) {
    if (!Number.isFinite(children) || children < 0 || !Number.isInteger(children)) {
      errors.children = 'invalid_children';
    }
  }

  return errors;
}

export function createInitialSimulatedBookingPaymentFormState(): SimulatedBookingPaymentFormState {
  return {
    adults: '1',
    children: '0',
    paymentOption: 'partial',
    notes: '',
  };
}

