'use client';

import AppButton from '@/components/common/button/AppButton';
import AppFieldHelper from '@/components/common/form/AppFieldHelper';
import AppSelectField from '@/components/common/form/AppSelectField';
import AppTextareaField from '@/components/common/form/AppTextareaField';
import AppTextField from '@/components/common/form/AppTextField';
import AppModal from '@/components/common/modal/AppModal';
import { tourSingleContent } from '@/content/features/tourSingle';
import type {
  SimulatedBookingPaymentFormState,
  SimulatedBookingPaymentValidationErrors,
} from '@/features/tour-single/helpers/simulatedBookingPayment';

type TourBookingPaymentModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  location: string;
  when: string;
  tourType: string;
  formState: SimulatedBookingPaymentFormState;
  fieldErrors: SimulatedBookingPaymentValidationErrors;
  totals: {
    travelers: number;
    totalAmount: number;
    amountToChargeNow: number;
  };
  onFieldChange: <Key extends keyof SimulatedBookingPaymentFormState>(
    key: Key,
    value: SimulatedBookingPaymentFormState[Key],
  ) => void;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(amount);
}

function getValidationMessage(
  messages: typeof tourSingleContent.sidebar.paymentFlow.validationMessages,
  errorCode?: string,
) {
  if (!errorCode) return undefined;

  return messages[errorCode as keyof typeof messages] ?? errorCode;
}

export default function TourBookingPaymentModal({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  location,
  when,
  tourType,
  formState,
  fieldErrors,
  totals,
  onFieldChange,
}: TourBookingPaymentModalProps) {
  const content = tourSingleContent.sidebar.paymentFlow;

  const paymentOptions = content.paymentOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <AppModal
      open={open}
      onClose={(_, reason) => {
        if (isSubmitting && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
          return;
        }
        onClose();
      }}
      title={content.modalTitle}
      size='medium'
      actions={
        <>
          <AppButton variant='outline' onClick={onClose} disabled={isSubmitting}>
            {content.actions.cancel}
          </AppButton>
          <AppButton onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? content.actions.processing : content.actions.confirm}
          </AppButton>
        </>
      }
    >
      <div className='row g-3'>
        <div className='col-12'>
          <div className='rounded-12 border px-15 py-15 bg-white'>
            <div className='text-15 fw-500'>{content.summary.title}</div>
            <div className='mt-10 text-14'>
              <div>
                <strong>{content.summary.destinationLabel}:</strong> {location || '-'}
              </div>
              <div>
                <strong>{content.summary.datesLabel}:</strong> {when || '-'}
              </div>
              <div>
                <strong>{content.summary.tourTypeLabel}:</strong> {tourType || '-'}
              </div>
            </div>
            {fieldErrors.when ? (
              <div className='text-13 text-red-1 mt-8'>
                {getValidationMessage(content.validationMessages, fieldErrors.when)}
              </div>
            ) : !when ? (
              <AppFieldHelper text={content.helpers.selectDatesFirst} />
            ) : null}
          </div>
        </div>

        <div className='col-md-6'>
          <AppTextField
            label={content.fields.adults}
            value={formState.adults}
            onChange={(value) => onFieldChange('adults', value)}
            type='number'
            inputProps={{ min: 1 }}
            required
            errorMessage={getValidationMessage(content.validationMessages, fieldErrors.adults)}
          />
        </div>

        <div className='col-md-6'>
          <AppTextField
            label={content.fields.children}
            value={formState.children}
            onChange={(value) => onFieldChange('children', value)}
            type='number'
            inputProps={{ min: 0 }}
            errorMessage={getValidationMessage(content.validationMessages, fieldErrors.children)}
          />
        </div>

        <div className='col-12'>
          <AppSelectField
            label={content.fields.paymentOption}
            value={formState.paymentOption}
            options={paymentOptions}
            onChange={(value) => onFieldChange('paymentOption', value as SimulatedBookingPaymentFormState['paymentOption'])}
            required
            sx={undefined}
          />
          <AppFieldHelper text={content.helpers.paymentOption} />
        </div>

        <div className='col-12'>
          <AppTextareaField
            label={content.fields.notes}
            value={formState.notes}
            onChange={(value) => onFieldChange('notes', value)}
            minRows={3}
            placeholder={content.fields.notesPlaceholder}
          />
        </div>

        <div className='col-12'>
          <div className='rounded-12 border px-15 py-15 bg-white'>
            <div className='d-flex justify-between text-14'>
              <span>{content.summary.travelersLabel}</span>
              <strong>{totals.travelers}</strong>
            </div>
            <div className='d-flex justify-between mt-8 text-14'>
              <span>{content.summary.totalAmountLabel}</span>
              <strong>{formatCurrency(totals.totalAmount)}</strong>
            </div>
            <div className='d-flex justify-between mt-8 text-16 fw-500'>
              <span>{content.summary.amountDueNowLabel}</span>
              <strong className='text-accent-1'>{formatCurrency(totals.amountToChargeNow)}</strong>
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  );
}
