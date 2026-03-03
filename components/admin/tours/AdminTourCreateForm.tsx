'use client';

import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import AdminRichTextEditor from '@/components/admin/help-center/AdminRichTextEditor';
import AdminDepartureBlocksManager from '@/components/admin/tours/AdminDepartureBlocksManager';
import AdminInclusionBlocksManager from '@/components/admin/tours/AdminInclusionBlocksManager';
import AdminItineraryBlocksManager from '@/components/admin/tours/AdminItineraryBlocksManager';
import AppButton from '@/components/common/button/AppButton';
import AppToast from '@/components/common/feedback/AppToast';
import AppFieldHelper from '@/components/common/form/AppFieldHelper';
import AppImageGalleryPicker from '@/components/common/form/AppImageGalleryPicker';
import AppSelectField from '@/components/common/form/AppSelectField';
import AppSingleImagePicker from '@/components/common/form/AppSingleImagePicker';
import AppTextField from '@/components/common/form/AppTextField';
import AppSideTabs from '@/components/common/navigation/AppSideTabs';
import { adminContent } from '@/content/features/admin';
import useAdminTourReferencesQuery from '@/services/admin/tours/hooks/useAdminTourReferencesQuery';
import useCreateAdminTourMutation from '@/services/admin/tours/hooks/useCreateAdminTourMutation';
import useUpdateAdminTourMutation from '@/services/admin/tours/hooks/useUpdateAdminTourMutation';
import type { AdminTourEditorData } from '@/services/admin/tours/mutations/tourApi';
import type { AppGalleryPickerItem } from '@/types/gallery';
import useAdminTextBlocksManager from '@/utils/hooks/admin/useAdminTextBlocksManager';

type TourItineraryFormItem = {
  id: string;
  dayNumber: string;
  title: string;
  content: string;
  icon: string;
  isSummary: boolean;
};

type TourInclusionFormItem = {
  id: string;
  itemType: 'included' | 'excluded';
  itemOrder: string;
  content: string;
};

type TourStatus = 'active' | 'inactive';
type TourDepartureStatus = 'open' | 'sold_out' | 'closed' | 'cancelled';
type TourDepartureFormItem = {
  id: string;
  rowId: number | null;
  startDate: string;
  endDate: string;
  bookingDeadline: string;
  maximumCapacity: string;
  price: string;
  originalPrice: string;
  status: TourDepartureStatus;
};
type DepartureFieldKey = 'startDate' | 'endDate' | 'bookingDeadline' | 'maximumCapacity' | 'price';
type TourCreateValidatableField =
  | 'title'
  | 'description'
  | 'location'
  | 'destinationId'
  | 'tourTypeId';

type TourCreateFormState = {
  title: string;
  description: string;
  location: string;
  destinationId: string;
  tourTypeId: string;
  imageSrc: string;
  mainImage: AppGalleryPickerItem | null;
  images: AppGalleryPickerItem[];
  status: TourStatus;
  isFeatured: boolean;
  isPopular: boolean;
  isTopTrending: boolean;
  departures: TourDepartureFormItem[];
  itineraries: TourItineraryFormItem[];
  inclusions: TourInclusionFormItem[];
};

type TourCreateSectionKey =
  | 'basic'
  | 'classification'
  | 'pricing'
  | 'media'
  | 'itinerary'
  | 'inclusions';
type TourPopulateData = Partial<
  Pick<
    TourCreateFormState,
    | 'imageSrc'
    | 'mainImage'
    | 'images'
    | 'title'
    | 'description'
    | 'location'
    | 'destinationId'
    | 'tourTypeId'
    | 'status'
    | 'isFeatured'
    | 'isPopular'
    | 'isTopTrending'
    | 'departures'
    | 'itineraries'
    | 'inclusions'
  >
> & {
  departure?: Partial<{
    startDate: string;
    endDate: string;
    bookingDeadline: string;
    maximumCapacity: string;
    price: string;
    originalPrice: string;
    status: TourDepartureStatus;
  }>;
};

declare global {
  interface Window {
    populate?: (tour?: TourPopulateData) => void;
  }
}

function normalizeItineraryItems(items: TourItineraryFormItem[]): TourItineraryFormItem[] {
  const lastIndex = items.length - 1;

  return items.map((item, index) => {
    const normalizedContent = item.content.trim();
    let icon = '';

    if (index === 0) {
      icon = 'icon-pin';
    } else if (index === lastIndex) {
      icon = 'icon-flag';
    }

    return {
      ...item,
      dayNumber: String(index + 1),
      isSummary: normalizedContent.length === 0,
      icon,
    };
  });
}

function normalizeInclusionItems(items: TourInclusionFormItem[]): TourInclusionFormItem[] {
  return items.map((item, index) => ({
    ...item,
    itemOrder: String(index + 1),
  }));
}

function createDepartureItem(
  index: number,
  overrides: Partial<Omit<TourDepartureFormItem, 'id'>> = {},
): TourDepartureFormItem {
  return {
    id: `departure-${Date.now()}-${index}`,
    rowId: null,
    startDate: '',
    endDate: '',
    bookingDeadline: '',
    maximumCapacity: '10',
    price: '',
    originalPrice: '',
    status: 'open',
    ...overrides,
  };
}

const initialState: TourCreateFormState = {
  title: '',
  description: '',
  location: '',
  destinationId: '',
  tourTypeId: '',
  imageSrc: '',
  mainImage: null,
  images: [],
  status: 'active',
  isFeatured: false,
  isPopular: false,
  isTopTrending: false,
  departures: [createDepartureItem(1)],
  itineraries: [
    {
      id: 'itinerary-1',
      dayNumber: '1',
      title: '',
      content: '',
      icon: '',
      isSummary: false,
    },
  ],
  inclusions: [
    {
      id: 'inclusion-1',
      itemType: 'included',
      itemOrder: '1',
      content: '',
    },
  ],
};

function buildInitialState(
  initialData?: AdminTourCreateFormProps['initialData'],
): TourCreateFormState {
  if (!initialData) {
    return initialState;
  }

  return {
    ...initialState,
    ...initialData,
    mainImage: initialData.mainImage ?? initialState.mainImage,
    images: initialData.images ?? initialState.images,
    departures:
      (initialData.departures?.length ?? 0) > 0 ? initialData.departures : initialState.departures,
    itineraries:
      (initialData.itineraries?.length ?? 0) > 0
        ? initialData.itineraries
        : initialState.itineraries,
    inclusions:
      (initialData.inclusions?.length ?? 0) > 0 ? initialData.inclusions : initialState.inclusions,
  };
}

type AdminTourCreateFormProps = {
  mode?: 'create' | 'edit';
  tourId?: number;
  initialData?: AdminTourEditorData | null;
};

export default function AdminTourCreateForm({
  mode = 'create',
  tourId,
  initialData,
}: AdminTourCreateFormProps) {
  const router = useRouter();
  const content = adminContent.pages.listing.createPage;
  const [activeSection, setActiveSection] = useState<TourCreateSectionKey>('basic');
  const [formState, setFormState] = useState<TourCreateFormState>(() =>
    buildInitialState(initialData),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TourCreateValidatableField, string>>
  >({});
  const [departureErrors, setDepartureErrors] = useState<
    Record<string, Partial<Record<DepartureFieldKey, string>>>
  >({});
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const referencesQuery = useAdminTourReferencesQuery();
  const createTourMutation = useCreateAdminTourMutation();
  const updateTourMutation = useUpdateAdminTourMutation();
  const isEditing = mode === 'edit';
  const isSubmitting = createTourMutation.isPending || updateTourMutation.isPending;
  const booleanOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ] as const;
  const tourStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ] as const;

  const sectionItems: Array<{
    key: TourCreateSectionKey;
    title: string;
    description: string;
  }> = [
    {
      key: 'basic',
      title: content.sections.basic.title,
      description: content.sections.basic.description,
    },
    {
      key: 'classification',
      title: content.sections.classification.title,
      description: content.sections.classification.description,
    },
    {
      key: 'pricing',
      title: content.sections.pricing.title,
      description: content.sections.pricing.description,
    },
    {
      key: 'media',
      title: content.sections.media.title,
      description: content.sections.media.description,
    },
    {
      key: 'itinerary',
      title: content.sections.itinerary.title,
      description: content.sections.itinerary.description,
    },
    {
      key: 'inclusions',
      title: content.sections.inclusions.title,
      description: content.sections.inclusions.description,
    },
  ];

  function setField<Key extends keyof TourCreateFormState>(
    key: Key,
    value: TourCreateFormState[Key],
  ) {
    setFormState((previousValue) => ({
      ...previousValue,
      [key]: value,
    }));
  }

  function setValidatedField<Key extends TourCreateValidatableField>(
    key: Key,
    value: TourCreateFormState[Key],
  ) {
    setField(key, value);
    setFieldErrors((previousValue) => ({ ...previousValue, [key]: undefined }));
  }

  function mapValidationError(code: string | undefined) {
    return code ? (content.validationMessages[code] ?? code) : undefined;
  }

  function setDepartureField<Key extends keyof TourDepartureFormItem>(
    departureId: string,
    key: Key,
    value: TourDepartureFormItem[Key],
  ) {
    setFormState((previousValue) => ({
      ...previousValue,
      departures: previousValue.departures.map((departure) =>
        departure.id === departureId ? { ...departure, [key]: value } : departure,
      ),
    }));

    const validatableKeys: DepartureFieldKey[] = [
      'startDate',
      'endDate',
      'bookingDeadline',
      'maximumCapacity',
      'price',
    ];

    if (validatableKeys.includes(key as DepartureFieldKey)) {
      const errorKey = key as DepartureFieldKey;

      setDepartureErrors((previousValue) => {
        if (!previousValue[departureId]?.[errorKey]) {
          return previousValue;
        }

        return {
          ...previousValue,
          [departureId]: {
            ...previousValue[departureId],
            [errorKey]: undefined,
          },
        };
      });
    }
  }

  function addDeparture() {
    setFormState((previousValue) => ({
      ...previousValue,
      departures: [
        ...previousValue.departures,
        createDepartureItem(previousValue.departures.length + 1),
      ],
    }));
  }

  function removeDeparture(departureId: string) {
    setFormState((previousValue) => {
      if (previousValue.departures.length <= 1) {
        return previousValue;
      }

      return {
        ...previousValue,
        departures: previousValue.departures.filter((departure) => departure.id !== departureId),
      };
    });

    setDepartureErrors((previousValue) => {
      if (!previousValue[departureId]) {
        return previousValue;
      }

      const nextValue = { ...previousValue };
      delete nextValue[departureId];
      return nextValue;
    });
  }

  async function handleSubmit() {
    const nextErrors: Partial<Record<TourCreateValidatableField, string>> = {};

    if (!formState.title.trim()) {
      nextErrors.title = mapValidationError('required_title');
    }
    if (!formState.description.trim()) {
      nextErrors.description = mapValidationError('required_description');
    }
    if (!formState.location.trim()) {
      nextErrors.location = mapValidationError('required_location');
    }
    if (!formState.destinationId.trim()) {
      nextErrors.destinationId = mapValidationError('required_destination_id');
    }
    if (!formState.tourTypeId.trim()) {
      nextErrors.tourTypeId = mapValidationError('required_tour_type_id');
    }

    const nextDepartureErrors: Record<string, Partial<Record<DepartureFieldKey, string>>> = {};

    if (formState.departures.length === 0) {
      setToastState({
        open: true,
        message: 'Add at least one departure before saving this tour.',
        severity: 'error',
      });
      setActiveSection('pricing');
      return;
    }

    formState.departures.forEach((departure) => {
      const errors: Partial<Record<DepartureFieldKey, string>> = {};

      if (!departure.startDate.trim()) {
        errors.startDate = mapValidationError('required_departure_start_date');
      }
      if (!departure.endDate.trim()) {
        errors.endDate = mapValidationError('required_departure_end_date');
      }
      if (!departure.bookingDeadline.trim()) {
        errors.bookingDeadline = mapValidationError('required_departure_booking_deadline');
      }
      if (!departure.maximumCapacity.trim()) {
        errors.maximumCapacity = mapValidationError('required_departure_maximum_capacity');
      }
      if (!departure.price.trim()) {
        errors.price = mapValidationError('required_departure_price');
      }

      if (Object.keys(errors).length > 0) {
        nextDepartureErrors[departure.id] = errors;
      }
    });

    setFieldErrors(nextErrors);
    setDepartureErrors(nextDepartureErrors);

    if (Object.keys(nextErrors).length > 0 || Object.keys(nextDepartureErrors).length > 0) {
      if (nextErrors.title || nextErrors.description || nextErrors.location) {
        setActiveSection('basic');
      } else if (nextErrors.destinationId || nextErrors.tourTypeId) {
        setActiveSection('classification');
      } else {
        setActiveSection('pricing');
      }
      return;
    }

    const destinationId = Number(formState.destinationId);
    const tourTypeId = Number(formState.tourTypeId);

    if (!Number.isFinite(destinationId) || !Number.isFinite(tourTypeId)) {
      setToastState({
        open: true,
        message: 'Invalid numeric values detected. Please review destination and tour type.',
        severity: 'error',
      });
      return;
    }

    try {
      const normalizedDepartures = formState.departures.map((departure, index) => {
        const maximumCapacity = Number(departure.maximumCapacity);
        const price = Number(departure.price);
        const originalPrice = departure.originalPrice.trim()
          ? Number(departure.originalPrice)
          : null;

        if (
          !Number.isFinite(maximumCapacity) ||
          maximumCapacity < 1 ||
          !Number.isFinite(price) ||
          price < 0 ||
          (originalPrice !== null && (!Number.isFinite(originalPrice) || originalPrice < 0))
        ) {
          throw new Error(`DEPARTURE_NUMERIC_INVALID:${index + 1}`);
        }

        if (
          departure.endDate < departure.startDate ||
          departure.bookingDeadline > departure.startDate
        ) {
          throw new Error(`DEPARTURE_DATES_INVALID:${index + 1}`);
        }

        return {
          startDate: departure.startDate,
          endDate: departure.endDate,
          bookingDeadline: departure.bookingDeadline,
          maximumCapacity,
          price,
          originalPrice,
          status: departure.status,
          id: departure.rowId,
        };
      });

      const payload = {
        title: formState.title.trim(),
        description: formState.description.trim() || null,
        location: formState.location.trim(),
        destinationId,
        tourTypeId,
        imageSrc:
          formState.imageSrc.trim() ||
          formState.mainImage?.src ||
          formState.images[0]?.src ||
          '/img/tours/og-preview.webp',
        mainImage: formState.mainImage,
        images: formState.images,
        status: formState.status,
        isFeatured: formState.isFeatured ?? false,
        isPopular: formState.isPopular ?? false,
        isTopTrending: formState.isTopTrending ?? false,
        departures: normalizedDepartures,
        itineraries: normalizeItineraryItems(formState.itineraries).map((item, index) => ({
          dayNumber: Number(item.dayNumber) || index + 1,
          title: item.title.trim() || `Day ${index + 1}`,
          content: item.content.trim() || null,
          icon: item.icon.trim() || null,
          isSummary: item.isSummary,
        })),
        inclusions: normalizeInclusionItems(formState.inclusions)
          .filter((item) => item.content.trim().length > 0)
          .map((item, index) => ({
            itemType: item.itemType,
            itemOrder: Number(item.itemOrder) || index + 1,
            content: item.content.trim(),
          })),
      };

      if (isEditing) {
        if (!tourId) {
          throw new Error('TOUR_ID_REQUIRED');
        }

        await updateTourMutation.mutateAsync({
          id: tourId,
          ...payload,
        });
      } else {
        await createTourMutation.mutateAsync(payload);
      }

      setToastState({
        open: true,
        message: isEditing ? content.messages.updateSuccess : content.messages.createSuccess,
        severity: 'success',
      });
      router.push('/admin/tours');
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('DEPARTURE_NUMERIC_INVALID:')) {
        const departureIndex = Number(error.message.split(':')[1] ?? '0');
        setActiveSection('pricing');
        setToastState({
          open: true,
          message: `Departure ${departureIndex} has invalid numeric values. Review capacity and pricing.`,
          severity: 'error',
        });
        return;
      }

      if (error instanceof Error && error.message.startsWith('DEPARTURE_DATES_INVALID:')) {
        const departureIndex = Number(error.message.split(':')[1] ?? '0');
        setActiveSection('pricing');
        setToastState({
          open: true,
          message: `Departure ${departureIndex} has invalid dates. End date must be on or after start date, and booking deadline must be on or before start date.`,
          severity: 'error',
        });
        return;
      }

      const failedPrefix = isEditing
        ? content.messages.updateFailedPrefix
        : content.messages.createFailedPrefix;
      const message = error instanceof Error ? `${failedPrefix}: ${error.message}` : failedPrefix;
      setToastState({
        open: true,
        message,
        severity: 'error',
      });
    }
  }

  const itineraryBlocksManager = useAdminTextBlocksManager<TourItineraryFormItem>({
    items: formState.itineraries,
    onChange: (nextItems) => setField('itineraries', normalizeItineraryItems(nextItems)),
    createItem: () => ({
      id: `itinerary-${Date.now()}`,
      dayNumber: '',
      title: '',
      content: '',
      icon: '',
      isSummary: true,
    }),
  });

  const inclusionBlocksManager = useAdminTextBlocksManager<TourInclusionFormItem>({
    items: formState.inclusions,
    onChange: (nextItems) => setField('inclusions', normalizeInclusionItems(nextItems)),
    createItem: () => ({
      id: `inclusion-${Date.now()}`,
      itemType: 'included',
      itemOrder: '',
      content: '',
    }),
  });

  useEffect(() => {
    window.populate = (tour = {}) => {
      setFormState((previousValue) => {
        const destinationId =
          tour.destinationId ??
          previousValue.destinationId ??
          referencesQuery.data?.destinations[0]?.value ??
          '';
        const tourTypeId =
          tour.tourTypeId ??
          previousValue.tourTypeId ??
          referencesQuery.data?.tourTypes[0]?.value ??
          '';
        const fallbackDeparture = tour.departure
          ? [
              createDepartureItem(1, {
                startDate: tour.departure.startDate ?? '',
                endDate: tour.departure.endDate ?? '',
                bookingDeadline: tour.departure.bookingDeadline ?? '',
                maximumCapacity: tour.departure.maximumCapacity ?? '10',
                price: tour.departure.price ?? '',
                originalPrice: tour.departure.originalPrice ?? '',
                status: tour.departure.status ?? 'open',
              }),
            ]
          : null;
        const defaultDepartures = [
          createDepartureItem(1, {
            startDate: '2026-04-10',
            endDate: '2026-04-12',
            bookingDeadline: '2026-04-03',
            maximumCapacity: '12',
            price: '7499',
            originalPrice: '8999',
            status: 'open',
          }),
          createDepartureItem(2, {
            startDate: '2026-05-08',
            endDate: '2026-05-10',
            bookingDeadline: '2026-05-01',
            maximumCapacity: '12',
            price: '7699',
            originalPrice: '9199',
            status: 'open',
          }),
        ];
        const populatedDepartures =
          tour.departures && tour.departures.length > 0
            ? tour.departures
            : (fallbackDeparture ?? defaultDepartures);

        return {
          ...previousValue,
          title: tour.title ?? 'Sunrise Island Hopping Adventure',
          description:
            tour.description ??
            '<p>Discover hidden lagoons, white-sand beaches, and local seafood spots in one unforgettable day.</p>',
          location: tour.location ?? 'El Nido, Palawan, Philippines',
          destinationId,
          tourTypeId,
          status: tour.status ?? 'active',
          isFeatured: tour.isFeatured ?? true,
          isPopular: tour.isPopular ?? true,
          isTopTrending: tour.isTopTrending ?? false,
          departures: populatedDepartures,
          itineraries: normalizeItineraryItems(
            tour.itineraries ?? [
              {
                id: `itinerary-${Date.now()}-1`,
                dayNumber: '1',
                title: 'Arrival and Island Warm-Up',
                content:
                  'Meet the guide, transfer to the resort, and enjoy a sunset island-hopping welcome tour.',
                icon: '',
                isSummary: false,
              },
              {
                id: `itinerary-${Date.now()}-2`,
                dayNumber: '2',
                title: 'Lagoons and Snorkeling Highlights',
                content:
                  'Visit key lagoons, snorkel coral gardens, and stop for a beachside lunch with free time.',
                icon: '',
                isSummary: false,
              },
              {
                id: `itinerary-${Date.now()}-3`,
                dayNumber: '3',
                title: 'Town Stroll and Departure',
                content:
                  'Morning local market walk, checkout, and transfer back to the airport or ferry terminal.',
                icon: '',
                isSummary: false,
              },
            ],
          ),
          inclusions: normalizeInclusionItems(
            tour.inclusions ?? [
              {
                id: `inclusion-${Date.now()}-1`,
                itemType: 'included',
                itemOrder: '1',
                content: 'Roundtrip land and boat transfers',
              },
              {
                id: `inclusion-${Date.now()}-2`,
                itemType: 'included',
                itemOrder: '2',
                content: '2 nights accommodation with breakfast',
              },
              {
                id: `inclusion-${Date.now()}-3`,
                itemType: 'excluded',
                itemOrder: '3',
                content: 'Personal travel insurance',
              },
            ],
          ),
        };
      });

      setFieldErrors({});
      setDepartureErrors({});
    };

    return () => {
      delete window.populate;
    };
  }, [referencesQuery.data]);

  return (
    <div className='bg-white shadow-2 mt-60 md:mt-30 px-40 md:px-20 pt-40 md:pt-20 pb-30 md:pb-20 rounded-12 toursCreateForm'>
      <div className='y-gap-20 row'>
        <div className='col-12 col-lg-3'>
          <div className='toursCreateNavWrap'>
            <AppSideTabs
              items={sectionItems}
              activeKey={activeSection}
              onChange={setActiveSection}
            />
          </div>
        </div>

        <div className='col-12 col-lg-9'>
          {activeSection === 'basic' ? (
            <div className='px-20 py-20 border rounded-12 toursCreateSection'>
              <div className='toursCreateSection__header'>
                <h4 className='text-18 fw-500'>{content.sections.basic.title}</h4>
                <p className='mt-5 text-14 text-light-1'>{content.sections.basic.description}</p>
              </div>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2.5,
                }}
              >
                <Box className='toursCreateField'>
                  <AppTextField
                    label={content.fields.title}
                    value={formState.title}
                    onChange={(value) => setValidatedField('title', value)}
                    errorMessage={fieldErrors.title}
                  />
                  {!fieldErrors.title ? <AppFieldHelper text={content.helpers.title} /> : null}
                </Box>
                <Box
                  className='toursCreateField'
                  sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
                >
                  <div className='mb-10 text-14 fw-500'>{content.fields.description}</div>
                  <AdminRichTextEditor
                    value={formState.description}
                    onChange={(value) => setValidatedField('description', value)}
                    toolbarLabels={content.richTextToolbar}
                    ariaLabel={content.fields.description}
                  />
                  {fieldErrors.description ? (
                    <div className='mt-5 text-13' style={{ color: '#b3261e', fontWeight: 500 }}>
                      {fieldErrors.description}
                    </div>
                  ) : null}
                  {!fieldErrors.description ? (
                    <AppFieldHelper text={content.helpers.description} />
                  ) : null}
                </Box>
              </Box>
            </div>
          ) : null}

          {activeSection === 'classification' ? (
            <div className='px-20 py-20 border rounded-12 toursCreateSection'>
              <div className='toursCreateSection__header'>
                <h4 className='text-18 fw-500'>{content.sections.classification.title}</h4>
                <p className='mt-5 text-14 text-light-1'>
                  {content.sections.classification.description}
                </p>
              </div>
              {referencesQuery.isError ? (
                <div className='mb-15'>
                  <AppFieldHelper
                    text={content.messages.referencesLoadError}
                    className='mt-0 text-red-1'
                  />
                </div>
              ) : null}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2.5,
                }}
              >
                <Box
                  className='toursCreateField'
                  sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
                >
                  <AppTextField
                    label={content.fields.location}
                    value={formState.location}
                    onChange={(value) => setValidatedField('location', value)}
                    errorMessage={fieldErrors.location}
                  />
                  {!fieldErrors.location ? (
                    <AppFieldHelper text={content.helpers.location} />
                  ) : null}
                </Box>
                <Box className='toursCreateField'>
                  <AppSelectField
                    label={content.fields.destinationId}
                    value={formState.destinationId}
                    onChange={(value) => setValidatedField('destinationId', value)}
                    options={referencesQuery.data?.destinations ?? []}
                    emptyOptionLabel={content.messages.selectEmpty}
                    disabled={referencesQuery.isLoading}
                    errorMessage={fieldErrors.destinationId}
                  />
                  {!fieldErrors.destinationId ? (
                    <AppFieldHelper
                      text={
                        referencesQuery.isLoading
                          ? content.messages.referencesLoading
                          : content.helpers.destinationId
                      }
                    />
                  ) : null}
                </Box>
                <Box className='toursCreateField'>
                  <AppSelectField
                    label={content.fields.tourTypeId}
                    value={formState.tourTypeId}
                    onChange={(value) => setValidatedField('tourTypeId', value)}
                    options={referencesQuery.data?.tourTypes ?? []}
                    emptyOptionLabel={content.messages.selectEmpty}
                    disabled={referencesQuery.isLoading}
                    errorMessage={fieldErrors.tourTypeId}
                  />
                  {!fieldErrors.tourTypeId ? (
                    <AppFieldHelper
                      text={
                        referencesQuery.isLoading
                          ? content.messages.referencesLoading
                          : content.helpers.tourTypeId
                      }
                    />
                  ) : null}
                </Box>
              </Box>
            </div>
          ) : null}

          {activeSection === 'pricing' ? (
            <div className='px-20 py-20 border rounded-12 toursCreateSection'>
              <AdminDepartureBlocksManager
                items={formState.departures}
                fieldErrors={departureErrors}
                onAddItem={addDeparture}
                onRemoveItem={removeDeparture}
                onUpdateItem={(id, key, value) => setDepartureField(id, key, value)}
                content={content}
              />
            </div>
          ) : null}

          {activeSection === 'media' ? (
            <div className='px-20 py-20 border rounded-12 toursCreateSection'>
              <div className='toursCreateSection__header'>
                <h4 className='text-18 fw-500'>{content.sections.media.title}</h4>
                <p className='mt-5 text-14 text-light-1'>{content.sections.media.description}</p>
              </div>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    border: '1px solid #e8edf5',
                    borderRadius: '14px',
                    p: 2,
                    background: 'linear-gradient(180deg, #ffffff 0%, #fbfcff 100%)',
                    boxShadow: '0 10px 24px rgba(5, 7, 60, 0.04)',
                  }}
                >
                  <AppSingleImagePicker
                    item={formState.mainImage}
                    onChange={(nextItem) => {
                      setField('mainImage', nextItem);
                      setField('imageSrc', nextItem?.src ?? '');
                    }}
                    labels={content.mediaPickers.mainImage}
                  />
                  <AppFieldHelper text={content.helpers.imageSrc} className='mt-10' />
                </Box>

                <Box
                  sx={{
                    border: '1px solid #e8edf5',
                    borderRadius: '14px',
                    p: 2,
                    background: '#fff',
                    boxShadow: '0 10px 24px rgba(5, 7, 60, 0.04)',
                  }}
                >
                  <AppImageGalleryPicker
                    items={formState.images}
                    onChange={(nextItems) => setField('images', nextItems)}
                    labels={content.mediaPickers.galleryImages}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box className='toursCreateField'>
                    <AppSelectField
                      label='Tour Status'
                      value={formState.status}
                      onChange={(value) => setField('status', value as TourStatus)}
                      options={tourStatusOptions}
                    />
                    <AppFieldHelper text='Set this to inactive to hide the tour from customers.' />
                  </Box>
                  <Box className='toursCreateField'>
                    <AppSelectField
                      label={content.fields.isFeatured}
                      value={formState.isFeatured ? 'true' : 'false'}
                      onChange={(value) => setField('isFeatured', value === 'true')}
                      options={booleanOptions}
                    />
                    <AppFieldHelper text={content.helpers.isFeatured} />
                  </Box>
                  <Box className='toursCreateField'>
                    <AppSelectField
                      label={content.fields.isPopular}
                      value={formState.isPopular ? 'true' : 'false'}
                      onChange={(value) => setField('isPopular', value === 'true')}
                      options={booleanOptions}
                    />
                    <AppFieldHelper text={content.helpers.isPopular} />
                  </Box>
                  <Box className='toursCreateField'>
                    <AppSelectField
                      label={content.fields.isTopTrending}
                      value={formState.isTopTrending ? 'true' : 'false'}
                      onChange={(value) => setField('isTopTrending', value === 'true')}
                      options={booleanOptions}
                    />
                    <AppFieldHelper text={content.helpers.isTopTrending} />
                  </Box>
                </Box>
              </Box>
            </div>
          ) : null}

          {activeSection === 'itinerary' ? (
            <div className='px-20 py-20 border rounded-12 toursCreateSection'>
              <AdminItineraryBlocksManager
                items={formState.itineraries}
                onAddItem={itineraryBlocksManager.addItem}
                onRemoveItem={itineraryBlocksManager.removeItem}
                onUpdateItem={(id, key, value) =>
                  setFormState((previousValue) => ({
                    ...previousValue,
                    itineraries: normalizeItineraryItems(
                      previousValue.itineraries.map((item) =>
                        item.id === id ? { ...item, [key]: value } : item,
                      ),
                    ),
                  }))
                }
                onDragEnd={itineraryBlocksManager.handleDragEnd}
                content={content}
              />
            </div>
          ) : null}

          {activeSection === 'inclusions' ? (
            <div className='px-20 py-20 border rounded-12 toursCreateSection'>
              <AdminInclusionBlocksManager
                items={formState.inclusions}
                onAddItem={inclusionBlocksManager.addItem}
                onRemoveItem={inclusionBlocksManager.removeItem}
                onUpdateItem={(id, key, value) =>
                  setFormState((previousValue) => ({
                    ...previousValue,
                    inclusions: normalizeInclusionItems(
                      previousValue.inclusions.map((item) =>
                        item.id === id ? { ...item, [key]: value } : item,
                      ),
                    ),
                  }))
                }
                onDragEnd={inclusionBlocksManager.handleDragEnd}
                content={content}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className='d-flex justify-between items-center mt-30'>
        <AppButton
          type='button'
          size='sm'
          variant='outline'
          disabled={isSubmitting}
          onClick={() => {
            router.push('/admin/tours');
          }}
        >
          {content.actions.cancel}
        </AppButton>

        <AppButton
          type='button'
          size='sm'
          className='toursCreateSubmitButton'
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? isEditing
              ? content.actions.updating
              : content.actions.creating
            : isEditing
              ? content.actions.update
              : content.actions.create}
        </AppButton>
      </div>
      <AppToast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={() =>
          setToastState((previousValue) => ({
            ...previousValue,
            open: false,
          }))
        }
      />
    </div>
  );
}
