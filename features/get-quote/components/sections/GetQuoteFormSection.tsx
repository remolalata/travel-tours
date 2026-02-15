'use client';

import QuoteFormField from '@/features/get-quote/components/form/QuoteFormField';
import { quoteFieldConfigs } from '@/features/get-quote/components/form/quoteFormConfig';
import useUrgentAssistancePrompt from '@/features/get-quote/hooks/useUrgentAssistancePrompt';
import useQuoteRequestForm, {
  type QuoteFormState,
} from '@/features/get-quote/hooks/useQuoteRequestForm';
import { Alert, IconButton } from '@mui/material';
import Link from 'next/link';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isVisible: isUrgentPromptVisible, dismiss: dismissUrgentPrompt } =
    useUrgentAssistancePrompt({ delayMs: 10000 });
  const initialLocation = useMemo(() => searchParams.get('where') ?? '', [searchParams]);
  const initialTourType = useMemo(() => searchParams.get('tourType') ?? '', [searchParams]);
  const initialAdults = useMemo(() => searchParams.get('adults') ?? '', [searchParams]);
  const initialChildren = useMemo(() => searchParams.get('children') ?? '', [searchParams]);

  const { formState, isSubmitted, updateField, submit, reset } = useQuoteRequestForm({
    initialLocation,
    initialTourType,
    initialAdults,
    initialChildren,
  });

  const requiredFieldCount = useMemo(
    () => quoteFieldConfigs.filter((field) => field.required).length,
    [],
  );
  const completedRequiredFieldCount = useMemo(
    () =>
      quoteFieldConfigs.filter(
        (field) => field.required && formState[field.name].toString().trim().length > 0,
      ).length,
    [formState],
  );
  const completionPercentage = useMemo(
    () =>
      requiredFieldCount > 0
        ? Math.min(100, Math.round((completedRequiredFieldCount / requiredFieldCount) * 100))
        : 0,
    [completedRequiredFieldCount, requiredFieldCount],
  );

  const tripConfigFields = useMemo(
    () => quoteFieldConfigs.filter((field) => tripDetailFields.includes(field.name)),
    [],
  );
  const contactConfigFields = useMemo(
    () => quoteFieldConfigs.filter((field) => contactFields.includes(field.name)),
    [],
  );

  const handleGoBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  }, [router]);

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

  return (
    <section className='layout-pt-lg layout-pb-lg getQuotePage'>
      <div className='container'>
        <div className='getQuotePage__top'>
          <button type='button' className='getQuotePage__back' onClick={handleGoBack}>
            <i className='icon-arrow-left' />
            <span>Back</span>
          </button>

          <div className='breadcrumbs getQuotePage__breadcrumbs'>
            <span className='breadcrumbs__item'>
              <Link href='/'>Home</Link>
            </span>
            <span>{' > '}</span>
            <span className='breadcrumbs__item'>
              <Link href='/get-quote'>Get a Quote</Link>
            </span>
          </div>
        </div>

        <div className='getQuotePage__shell'>
          <div className='row g-4'>
            <div className='col-lg-4 col-xl-4'>
              <aside className='getQuotePage__info'>
                <span className='getQuotePage__eyebrow'>Custom Travel Planning</span>
                <h1 className='getQuotePage__title'>Build Your Ideal Escape</h1>
                <p className='getQuotePage__subtitle'>
                  Share your destination, dates, and preferences. We&apos;ll craft a package that
                  matches your budget and travel style.
                </p>

                <ul className='getQuotePage__benefits'>
                  <li>Personalized itinerary with flight, hotel, and tour options</li>
                  <li>Transparent pricing and package recommendations</li>
                  <li>Fast response from our travel specialist team</li>
                </ul>

                <div className='getQuotePage__progress'>
                  <div className='getQuotePage__progressHeader'>
                    <span>Form progress</span>
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
                {isSubmitted && (
                  <Alert severity='success' sx={{ mb: 2.5 }}>
                    Quote request received. Our team will contact you shortly.
                  </Alert>
                )}

                <form
                  className='getQuotePage__form'
                  onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                  }}
                >
                  <div className='getQuotePage__section'>
                    <div className='getQuotePage__sectionHead'>
                      <h2>Trip Details</h2>
                      <p>Tell us the basics of your travel plan.</p>
                    </div>
                    <div className='row g-3'>
                      {tripConfigFields.map((field) => (
                        <QuoteFormField
                          key={field.name}
                          field={field}
                          value={formState[field.name]}
                          onValueChange={updateField}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='getQuotePage__divider' />

                  <div className='getQuotePage__section'>
                    <div className='getQuotePage__sectionHead'>
                      <h2>Contact Details</h2>
                      <p>Where should we send your quote and follow-up details?</p>
                    </div>
                    <div className='row g-3'>
                      {contactConfigFields.map((field) => (
                        <QuoteFormField
                          key={field.name}
                          field={field}
                          value={formState[field.name]}
                          onValueChange={updateField}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='getQuotePage__actions'>
                    <button
                      type='button'
                      className='button -md -outline-dark-1 bg-white text-dark-1'
                      onClick={() => {
                        reset({
                          initialLocation,
                          initialTourType,
                          initialAdults,
                          initialChildren,
                        });
                      }}
                    >
                      Clear Form
                    </button>
                    <button type='submit' className='button -md -dark-1 bg-accent-1 text-white'>
                      Request Quote
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
                aria-label='Close urgent assistance'
              >
                <span aria-hidden='true'>&times;</span>
              </IconButton>

              <p className='getQuotePage__floatingHelpTitle'>
                Prefer to chat instead of filling the form?
              </p>
              <p className='getQuotePage__floatingHelpText'>
                Message our team on WhatsApp, Messenger, or Viber for a personalized quote.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
