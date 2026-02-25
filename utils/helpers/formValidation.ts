import type {
  AdminPasswordFormState,
  AdminProfileFormState,
  AdminTourCreateValidationInput,
} from '@/types/admin';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[\d\s\-()]{7,20}$/;

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export type QuoteRequestValidationInput = {
  where: string;
  when: string;
  tourType: string;
  adults: string;
  budget: string;
  hotelClass: string;
  fullName: string;
  email: string;
  phone: string;
};

export function validateAdminProfileForm(
  input: AdminProfileFormState,
): ValidationErrors<AdminProfileFormState> {
  const errors: ValidationErrors<AdminProfileFormState> = {};

  if (!input.firstName.trim()) errors.firstName = 'required_first_name';
  if (!input.lastName.trim()) errors.lastName = 'required_last_name';
  if (!input.phone.trim()) errors.phone = 'required_phone';
  else if (!phonePattern.test(input.phone.trim())) errors.phone = 'invalid_phone';
  if (!input.email.trim()) errors.email = 'required_email';
  else if (!emailPattern.test(input.email.trim())) errors.email = 'invalid_email';

  return errors;
}

export function validateAdminPasswordForm(
  input: AdminPasswordFormState,
): ValidationErrors<AdminPasswordFormState> {
  const errors: ValidationErrors<AdminPasswordFormState> = {};

  if (!input.oldPassword) errors.oldPassword = 'required_old_password';
  if (!input.newPassword) errors.newPassword = 'required_new_password';
  else {
    if (input.newPassword.length < 8) errors.newPassword = 'invalid_new_password_length';
    else if (!/[A-Za-z]/.test(input.newPassword) || !/\d/.test(input.newPassword)) {
      errors.newPassword = 'invalid_new_password_pattern';
    }
  }

  if (!input.confirmPassword) errors.confirmPassword = 'required_confirm_password';
  else if (input.newPassword !== input.confirmPassword) {
    errors.confirmPassword = 'mismatch_confirm_password';
  }

  if (!errors.newPassword && input.newPassword === input.oldPassword) {
    errors.newPassword = 'same_as_old_password';
  }

  return errors;
}

export function validateQuoteRequestForm(
  input: QuoteRequestValidationInput,
): ValidationErrors<QuoteRequestValidationInput> {
  const errors: ValidationErrors<QuoteRequestValidationInput> = {};

  if (!input.where.trim()) errors.where = 'required_where';
  if (!input.when.trim()) errors.when = 'required_when';
  if (!input.tourType.trim()) errors.tourType = 'required_tour_type';

  if (!input.adults.trim()) errors.adults = 'required_adults';
  else {
    const adults = Number(input.adults);
    if (!Number.isFinite(adults) || adults < 1) errors.adults = 'invalid_adults';
  }
  if (!input.budget.trim()) errors.budget = 'required_budget';
  if (!input.hotelClass.trim()) errors.hotelClass = 'required_hotel_class';

  if (!input.fullName.trim()) errors.fullName = 'required_full_name';
  if (!input.email.trim()) errors.email = 'required_email';
  else if (!emailPattern.test(input.email.trim())) errors.email = 'invalid_email';
  if (!input.phone.trim()) errors.phone = 'required_phone';
  else if (!phonePattern.test(input.phone.trim())) errors.phone = 'invalid_phone';

  return errors;
}

export function validateAdminTourCreateForm(
  input: AdminTourCreateValidationInput,
): ValidationErrors<AdminTourCreateValidationInput> {
  const errors: ValidationErrors<AdminTourCreateValidationInput> = {};

  if (!input.title.trim()) errors.title = 'required_title';
  if (!input.description.trim()) errors.description = 'required_description';
  if (!input.location.trim()) errors.location = 'required_location';
  if (!input.duration.trim()) errors.duration = 'required_duration';
  if (!input.destinationId.trim()) errors.destinationId = 'required_destination_id';
  if (!input.tourTypeId.trim()) errors.tourTypeId = 'required_tour_type_id';
  if (!input.price.trim()) errors.price = 'required_price';

  return errors;
}
