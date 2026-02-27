'use client';

import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import AdminRichTextEditor from '@/components/admin/help-center/AdminRichTextEditor';
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
import type { AdminTourCreateValidationInput } from '@/types/admin';
import type { AppGalleryPickerItem } from '@/types/gallery';
import { validateAdminTourCreateForm } from '@/utils/helpers/formValidation';
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

type TourCreateFormState = {
  title: string;
  description: string;
  location: string;
  duration: string;
  destinationId: string;
  tourTypeId: string;
  price: string;
  originalPrice: string;
  imageSrc: string;
  mainImage: AppGalleryPickerItem | null;
  images: AppGalleryPickerItem[];
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isTopTrending: boolean;
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
type TourCreateValidatableField = keyof AdminTourCreateValidationInput;
type TourPopulateData = Partial<
  Pick<
    TourCreateFormState,
    | 'title'
    | 'description'
    | 'location'
    | 'duration'
    | 'destinationId'
    | 'tourTypeId'
    | 'price'
    | 'originalPrice'
    | 'isActive'
    | 'isFeatured'
    | 'isPopular'
    | 'isTopTrending'
    | 'itineraries'
    | 'inclusions'
  >
>;

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

const initialState: TourCreateFormState = {
  title: '',
  description: '',
  location: '',
  duration: '',
  destinationId: '',
  tourTypeId: '',
  price: '',
  originalPrice: '',
  imageSrc: '',
  mainImage: null,
  images: [],
  isActive: true,
  isFeatured: false,
  isPopular: false,
  isTopTrending: false,
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

export default function AdminTourCreateForm() {
  const router = useRouter();
  const content = adminContent.pages.listing.createPage;
  const [activeSection, setActiveSection] = useState<TourCreateSectionKey>('basic');
  const [formState, setFormState] = useState<TourCreateFormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TourCreateValidatableField, string>>
  >({});
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const referencesQuery = useAdminTourReferencesQuery();
  const createTourMutation = useCreateAdminTourMutation();
  const isCreating = createTourMutation.isPending;

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

  async function handleCreate() {
    const validationErrors = validateAdminTourCreateForm({
      title: formState.title,
      description: formState.description,
      location: formState.location,
      duration: formState.duration,
      destinationId: formState.destinationId,
      tourTypeId: formState.tourTypeId,
      price: formState.price,
    });

    if (Object.keys(validationErrors).length > 0) {
      const nextErrors: Partial<Record<TourCreateValidatableField, string>> = {
        title: mapValidationError(validationErrors.title),
        description: mapValidationError(validationErrors.description),
        location: mapValidationError(validationErrors.location),
        duration: mapValidationError(validationErrors.duration),
        destinationId: mapValidationError(validationErrors.destinationId),
        tourTypeId: mapValidationError(validationErrors.tourTypeId),
        price: mapValidationError(validationErrors.price),
      };
      setFieldErrors(nextErrors);

      if (
        nextErrors.title ||
        nextErrors.description ||
        nextErrors.location ||
        nextErrors.duration
      ) {
        setActiveSection('basic');
      } else if (nextErrors.destinationId || nextErrors.tourTypeId) {
        setActiveSection('classification');
      } else {
        setActiveSection('pricing');
      }
      return;
    }

    setFieldErrors({});

    const destinationId = Number(formState.destinationId);
    const tourTypeId = Number(formState.tourTypeId);
    const price = Number(formState.price);
    const originalPrice = formState.originalPrice.trim()
      ? Number(formState.originalPrice)
      : null;

    if (!Number.isFinite(destinationId) || !Number.isFinite(tourTypeId) || !Number.isFinite(price)) {
      setToastState({
        open: true,
        message: 'Invalid numeric values detected. Please review destination, type, and price.',
        severity: 'error',
      });
      return;
    }

    try {
      await createTourMutation.mutateAsync({
        title: formState.title.trim(),
        description: formState.description.trim() || null,
        location: formState.location.trim(),
        duration: formState.duration.trim(),
        destinationId,
        tourTypeId,
        price,
        originalPrice,
        imageSrc:
          formState.imageSrc.trim() ||
          formState.mainImage?.src ||
          formState.images[0]?.src ||
          '/img/tours/og-preview.webp',
        mainImage: formState.mainImage,
        images: formState.images,
        isActive: formState.isActive,
        isFeatured: formState.isFeatured ?? false,
        isPopular: formState.isPopular ?? false,
        isTopTrending: formState.isTopTrending ?? false,
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
      });

      setToastState({
        open: true,
        message: 'Tour created successfully.',
        severity: 'success',
      });
      router.push('/admin/tours');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create tour.';
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
          tour.destinationId ?? previousValue.destinationId ?? referencesQuery.data?.destinations[0]?.value ?? '';
        const tourTypeId =
          tour.tourTypeId ?? previousValue.tourTypeId ?? referencesQuery.data?.tourTypes[0]?.value ?? '';

        return {
          ...previousValue,
          title: tour.title ?? 'Sunrise Island Hopping Adventure',
          description:
            tour.description ??
            '<p>Discover hidden lagoons, white-sand beaches, and local seafood spots in one unforgettable day.</p>',
          location: tour.location ?? 'El Nido, Palawan, Philippines',
          duration: tour.duration ?? '3 Days 2 Nights',
          destinationId,
          tourTypeId,
          price: tour.price ?? '7499',
          originalPrice: tour.originalPrice ?? '8999',
          isActive: tour.isActive ?? true,
          isFeatured: tour.isFeatured ?? false,
          isPopular: tour.isPopular ?? false,
          isTopTrending: tour.isTopTrending ?? false,
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
                <Box className='toursCreateField'>
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
                  <AppTextField
                    label={content.fields.duration}
                    value={formState.duration}
                    onChange={(value) => setValidatedField('duration', value)}
                    errorMessage={fieldErrors.duration}
                  />
                  {!fieldErrors.duration ? (
                    <AppFieldHelper text={content.helpers.duration} />
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
              <div className='toursCreateSection__header'>
                <h4 className='text-18 fw-500'>{content.sections.pricing.title}</h4>
                <p className='mt-5 text-14 text-light-1'>{content.sections.pricing.description}</p>
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
                    label={content.fields.price}
                    value={formState.price}
                    onChange={(value) => setValidatedField('price', value)}
                    type='number'
                    errorMessage={fieldErrors.price}
                  />
                  {!fieldErrors.price ? <AppFieldHelper text={content.helpers.price} /> : null}
                </Box>
                <Box className='toursCreateField'>
                  <AppTextField
                    label={content.fields.originalPrice}
                    value={formState.originalPrice}
                    onChange={(value) => setField('originalPrice', value)}
                    type='number'
                  />
                  <AppFieldHelper text={content.helpers.originalPrice} />
                </Box>
              </Box>
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
            disabled={isCreating}
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
          disabled={isCreating}
          onClick={handleCreate}
        >
          {isCreating ? 'Creating...' : content.actions.create}
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
