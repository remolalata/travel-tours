'use client';

import { IconButton } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import useAdminTourReferencesQuery from '@/services/admin/tours/hooks/useAdminTourReferencesQuery';
import useAuthViewerQuery from '@/services/auth/hooks/useAuthViewerQuery';
import type { AuthViewerState } from '@/services/auth/mutations/authApi';
import useCreateQuoteRequestMutation from '@/services/quote-requests/hooks/useCreateQuoteRequestMutation';
import AppToast from '@/components/common/feedback/AppToast';
import AppBreadcrumb from '@/components/common/navigation/AppBreadcrumb';
import { getQuoteContent } from '@/content/features/getQuote';
import { quoteFieldConfigs } from '@/features/get-quote/components/form/quoteFormConfig';
import QuoteFormField from '@/features/get-quote/components/form/QuoteFormField';
import useQuoteRequestForm, {
  type QuoteFormState,
} from '@/features/get-quote/hooks/useQuoteRequestForm';
import useUrgentAssistancePrompt from '@/features/get-quote/hooks/useUrgentAssistancePrompt';

const tripDetailFields: readonly (keyof QuoteFormState)[] = [
  'where',
  'when',
  'tourType',
  'adults',
  'children',
  'budget',
  'hotelClass',
];

const contactFields: readonly (keyof QuoteFormState)[] = ['fullName', 'email', 'phone', 'notes'];

export default function GetQuoteFormSection() {
  const searchParams = useSearchParams();
  const hasAppliedAuthContactPrefill = useRef(false);
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const referencesQuery = useAdminTourReferencesQuery();
  const createQuoteRequestMutation = useCreateQuoteRequestMutation();
  const authQuery = useAuthViewerQuery({
    initialData: {
      isAuthenticated: false,
      role: null,
      avatarUrl: null,
      fullName: null,
      email: null,
      phone: null,
    } satisfies AuthViewerState,
  });
  const { isVisible: isUrgentPromptVisible, dismiss: dismissUrgentPrompt } =
    useUrgentAssistancePrompt({ delayMs: 10000 });
  const initialLocation = useMemo(() => searchParams.get('where') ?? '', [searchParams]);
  const initialWhen = useMemo(() => searchParams.get('when') ?? '', [searchParams]);
  const initialTourType = useMemo(() => searchParams.get('tourType') ?? '', [searchParams]);
  const initialAdults = useMemo(() => searchParams.get('adults') ?? '', [searchParams]);
  const initialChildren = useMemo(() => searchParams.get('children') ?? '', [searchParams]);
  const initialFullName = authQuery.data.fullName ?? '';
  const initialEmail = authQuery.data.email ?? '';
  const initialPhone = authQuery.data.phone ?? '';

  const { formState, fieldErrors, updateField, submit, reset } = useQuoteRequestForm({
    initialLocation,
    initialWhen,
    initialTourType,
    initialAdults,
    initialChildren,
    initialFullName,
    initialEmail,
    initialPhone,
  });

  const requiredFieldCount = useMemo(
    () => quoteFieldConfigs.filter((field) => field.required).length,
    [],
  );
  const destinationOptions = useMemo(
    () => (referencesQuery.data?.destinations ?? []).map((destination) => destination.label),
    [referencesQuery.data?.destinations],
  );
  const dynamicTourTypeOptions = useMemo(
    () => (referencesQuery.data?.tourTypes ?? []).map((tourType) => tourType.label),
    [referencesQuery.data?.tourTypes],
  );
  const resolvedQuoteFieldConfigs = useMemo(
    () =>
      quoteFieldConfigs.map((field) => {
        if (field.name === 'where' && destinationOptions.length > 0) {
          return { ...field, selectOptions: destinationOptions };
        }

        if (field.name === 'tourType' && dynamicTourTypeOptions.length > 0) {
          return { ...field, selectOptions: dynamicTourTypeOptions };
        }

        return field;
      }),
    [destinationOptions, dynamicTourTypeOptions],
  );
  const completedRequiredFieldCount = useMemo(
    () =>
      resolvedQuoteFieldConfigs.filter(
        (field) => field.required && formState[field.name].toString().trim().length > 0,
      ).length,
    [formState, resolvedQuoteFieldConfigs],
  );
  const completionPercentage = useMemo(
    () =>
      requiredFieldCount > 0
        ? Math.min(100, Math.round((completedRequiredFieldCount / requiredFieldCount) * 100))
        : 0,
    [completedRequiredFieldCount, requiredFieldCount],
  );
  const resolvedFieldErrors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(fieldErrors).map(([fieldName, errorCode]) => [
          fieldName,
          errorCode
            ? (getQuoteContent.form.validationMessages[
                errorCode as keyof typeof getQuoteContent.form.validationMessages
              ] ?? errorCode)
            : undefined,
        ]),
      ) as Partial<Record<keyof QuoteFormState, string>>,
    [fieldErrors],
  );

  const tripConfigFields = useMemo(
    () => resolvedQuoteFieldConfigs.filter((field) => tripDetailFields.includes(field.name)),
    [resolvedQuoteFieldConfigs],
  );
  const contactConfigFields = useMemo(
    () => resolvedQuoteFieldConfigs.filter((field) => contactFields.includes(field.name)),
    [resolvedQuoteFieldConfigs],
  );

  useEffect(() => {
    const handleContactGroupClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest('.contactButtonGroup')) {
        dismissUrgentPrompt();
      }
    };

    document.addEventListener('click', handleContactGroupClick);
    return () => {
      document.removeEventListener('click', handleContactGroupClick);
    };
  }, [dismissUrgentPrompt]);

  useEffect(() => {
    if (!authQuery.data.isAuthenticated) {
      return;
    }
    if (hasAppliedAuthContactPrefill.current) {
      return;
    }

    if (!formState.fullName && initialFullName) {
      updateField('fullName', initialFullName);
    }
    if (!formState.email && initialEmail) {
      updateField('email', initialEmail);
    }
    if (!formState.phone && initialPhone) {
      updateField('phone', initialPhone);
    }
    hasAppliedAuthContactPrefill.current = true;
  }, [
    authQuery.data.isAuthenticated,
    formState.email,
    formState.fullName,
    formState.phone,
    initialEmail,
    initialFullName,
    initialPhone,
    updateField,
  ]);

  return (
    <section className='layout-pt-lg layout-pb-lg getQuotePage'>
      <div className='container'>
        <div className='row mb-20'>
          <div className='col-auto'>
            <AppBreadcrumb
              items={getQuoteContent.breadcrumbs}
              className='breadcrumbs text-14'
              listClassName='d-flex items-center flex-wrap'
              itemClassName='d-flex items-center breadcrumbs__item'
              separatorClassName='ml-10 mr-10'
            />
          </div>
        </div>

        <div className='getQuotePage__shell'>
          <div className='row g-4'>
            <div className='col-lg-4 col-xl-4'>
              <aside className='getQuotePage__info'>
                <span className='getQuotePage__eyebrow'>{getQuoteContent.sidebar.eyebrow}</span>
                <h1 className='getQuotePage__title'>{getQuoteContent.sidebar.title}</h1>
                <p className='getQuotePage__subtitle'>{getQuoteContent.sidebar.subtitle}</p>

                <ul className='getQuotePage__benefits'>
                  {getQuoteContent.sidebar.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>

                <div className='getQuotePage__progress'>
                  <div className='getQuotePage__progressHeader'>
                    <span>{getQuoteContent.sidebar.progressLabel}</span>
                    <strong>{completionPercentage}%</strong>
                  </div>
                  <div className='getQuotePage__progressTrack'>
                    <span style={{ width: `${completionPercentage}%` }} />
                  </div>
                </div>
              </aside>
            </div>

            <div className='col-lg-8 col-xl-8'>
              <div className='getQuotePage__formCard'>
                <form
                  className='getQuotePage__form'
                  onSubmit={async (event) => {
                    event.preventDefault();
                    console.log('Get Quote form payload', formState);
                    const isValid = submit();
                    if (!isValid || createQuoteRequestMutation.isPending) {
                      return;
                    }

                    try {
                      await createQuoteRequestMutation.mutateAsync({
                        where: formState.where,
                        when: formState.when,
                        tourType: formState.tourType,
                        adults: formState.adults,
                        children: formState.children,
                        budget: formState.budget,
                        hotelClass: formState.hotelClass,
                        fullName: formState.fullName,
                        email: formState.email,
                        phone: formState.phone,
                        notes: formState.notes,
                      });

                      setToastState({
                        open: true,
                        message: getQuoteContent.form.toasts.submitSuccess,
                        severity: 'success',
                      });
                    } catch {
                      setToastState({
                        open: true,
                        message: getQuoteContent.form.toasts.submitError,
                        severity: 'error',
                      });
                    }
                  }}
                >
                  <div className='getQuotePage__section'>
                    <div className='getQuotePage__sectionHead'>
                      <h2>{getQuoteContent.form.sections.tripDetails.title}</h2>
                      <p>{getQuoteContent.form.sections.tripDetails.description}</p>
                    </div>
                    <div className='row g-3'>
                      {tripConfigFields.map((field) => (
                        <QuoteFormField
                          key={field.name}
                          field={field}
                          value={formState[field.name]}
                          errorMessage={resolvedFieldErrors[field.name]}
                          onValueChange={updateField}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='getQuotePage__divider' />

                  <div className='getQuotePage__section'>
                    <div className='getQuotePage__sectionHead'>
                      <h2>{getQuoteContent.form.sections.contactDetails.title}</h2>
                      <p>{getQuoteContent.form.sections.contactDetails.description}</p>
                    </div>
                    <div className='row g-3'>
                      {contactConfigFields.map((field) => (
                        <QuoteFormField
                          key={field.name}
                          field={field}
                          value={formState[field.name]}
                          errorMessage={resolvedFieldErrors[field.name]}
                          onValueChange={updateField}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='getQuotePage__actions'>
                    <button
                      type='button'
                      className='button -md -outline-dark-1 bg-white text-dark-1'
                      disabled={createQuoteRequestMutation.isPending}
                      onClick={() => {
                        hasAppliedAuthContactPrefill.current = true;
                        reset();
                      }}
                    >
                      {getQuoteContent.form.actions.clear}
                    </button>
                    <button
                      type='submit'
                      className='button -md -dark-1 bg-accent-1 text-white'
                      disabled={createQuoteRequestMutation.isPending}
                    >
                      {createQuoteRequestMutation.isPending
                        ? getQuoteContent.form.actions.submitting
                        : getQuoteContent.form.actions.submit}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {isUrgentPromptVisible && (
          <div className='getQuotePage__floatingHelp'>
            <div className='getQuotePage__floatingHelpCard'>
              <IconButton
                size='small'
                className='getQuotePage__floatingHelpClose'
                onClick={dismissUrgentPrompt}
                aria-label={getQuoteContent.floatingHelp.closeAriaLabel}
              >
                <span aria-hidden='true'>&times;</span>
              </IconButton>

              <p className='getQuotePage__floatingHelpTitle'>{getQuoteContent.floatingHelp.title}</p>
              <p className='getQuotePage__floatingHelpText'>
                {getQuoteContent.floatingHelp.description}
              </p>
            </div>
          </div>
        )}

        <AppToast
          open={toastState.open}
          message={toastState.message}
          severity={toastState.severity}
          onClose={() => setToastState((previousValue) => ({ ...previousValue, open: false }))}
        />
      </div>
    </section>
  );
}
