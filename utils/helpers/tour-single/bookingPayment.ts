export type BookingPaymentOption = 'full' | 'downpayment';
export type BookingTravelerType = 'adult' | 'child';

export type BookingTravelerFormState = {
  travelerType: BookingTravelerType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type BookingPaymentFormState = {
  adults: string;
  children: string;
  paymentOption: BookingPaymentOption;
  travelers: BookingTravelerFormState[];
  notes: string;
};

export type BookingPaymentValidationErrors = Partial<Record<string, string>>;

export type BookingPaymentTotals = {
  travelers: number;
  totalAmount: number;
  amountToChargeNow: number;
  balanceAmount: number;
};

const DOWNPAYMENT_RATE_MULTIPLIER = 0.3;

function parseWholeNumber(value: string, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;

  return Math.max(0, Math.floor(parsed));
}

function buildTravelerShell(travelerType: BookingTravelerType): BookingTravelerFormState {
  return {
    travelerType,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };
}

export function syncTravelersWithCounts(
  travelers: BookingTravelerFormState[],
  input: { adults: string; children: string },
): BookingTravelerFormState[] {
  const adults = Math.max(1, parseWholeNumber(input.adults, 1));
  const children = parseWholeNumber(input.children, 0);
  const nextTravelerTypes: BookingTravelerType[] = [
    ...Array.from({ length: adults }, () => 'adult' as const),
    ...Array.from({ length: children }, () => 'child' as const),
  ];

  return nextTravelerTypes.map((travelerType, index) => {
    const existingTraveler = travelers[index];

    if (!existingTraveler) {
      return buildTravelerShell(travelerType);
    }

    return {
      ...existingTraveler,
      travelerType,
    };
  });
}

export function calculateBookingTotals(
  baseTourPrice: number,
  formState: BookingPaymentFormState,
): BookingPaymentTotals {
  const adults = Math.max(1, parseWholeNumber(formState.adults, 1));
  const children = parseWholeNumber(formState.children, 0);
  const travelerCount = adults + children;
  const totalAmount = Math.round(baseTourPrice * travelerCount * 100) / 100;
  const amountToChargeNow =
    formState.paymentOption === 'downpayment'
      ? Math.round(totalAmount * DOWNPAYMENT_RATE_MULTIPLIER * 100) / 100
      : totalAmount;
  const balanceAmount = Math.max(0, Math.round((totalAmount - amountToChargeNow) * 100) / 100);

  return {
    travelers: travelerCount,
    totalAmount,
    amountToChargeNow,
    balanceAmount,
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateBookingPaymentForm(input: {
  when: string;
  formState: BookingPaymentFormState;
}): BookingPaymentValidationErrors {
  const errors: BookingPaymentValidationErrors = {};
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

  input.formState.travelers.forEach((traveler, index) => {
    if (!traveler.firstName.trim()) {
      errors[`travelers.${index}.firstName`] = 'required_traveler_first_name';
    }

    if (!traveler.lastName.trim()) {
      errors[`travelers.${index}.lastName`] = 'required_traveler_last_name';
    }

    if (index === 0) {
      if (!traveler.email.trim()) {
        errors[`travelers.${index}.email`] = 'required_lead_traveler_email';
      } else if (!isValidEmail(traveler.email.trim())) {
        errors[`travelers.${index}.email`] = 'invalid_lead_traveler_email';
      }

      if (!traveler.phone.trim()) {
        errors[`travelers.${index}.phone`] = 'required_lead_traveler_phone';
      }
    }
  });

  return errors;
}

export function createInitialBookingPaymentFormState(): BookingPaymentFormState {
  return {
    adults: '1',
    children: '0',
    paymentOption: 'downpayment',
    travelers: [buildTravelerShell('adult')],
    notes: '',
  };
}
