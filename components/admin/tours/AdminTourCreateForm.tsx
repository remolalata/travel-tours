'use client';

import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import useAdminTourReferencesQuery from '@/api/admin/tours/hooks/useAdminTourReferencesQuery';
import AdminRichTextEditor from '@/components/admin/help-center/AdminRichTextEditor';
import AdminInclusionBlocksManager from '@/components/admin/tours/AdminInclusionBlocksManager';
import AdminItineraryBlocksManager from '@/components/admin/tours/AdminItineraryBlocksManager';
import AppButton from '@/components/common/button/AppButton';
import AppFieldHelper from '@/components/common/form/AppFieldHelper';
import AppImageGalleryPicker from '@/components/common/form/AppImageGalleryPicker';
import AppSelectField from '@/components/common/form/AppSelectField';
import AppSingleImagePicker from '@/components/common/form/AppSingleImagePicker';
import AppTextField from '@/components/common/form/AppTextField';
import AppSideTabs from '@/components/common/navigation/AppSideTabs';
import { adminContent } from '@/content/features/admin';
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

type TourCreateSectionKey = 'basic' | 'classification' | 'pricing' | 'media' | 'itinerary' | 'inclusions';
type TourCreateValidatableField = keyof AdminTourCreateValidationInput;

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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<TourCreateValidatableField, string>>>({});
  const referencesQuery = useAdminTourReferencesQuery();

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

  function setField<Key extends keyof TourCreateFormState>(key: Key, value: TourCreateFormState[Key]) {
    setFormState((previousValue) => ({
      ...previousValue,
      [key]: value,
    }));
  }

  function setValidatedField<Key extends TourCreateValidatableField>(key: Key, value: TourCreateFormState[Key]) {
    setField(key, value);
    setFieldErrors((previousValue) => ({ ...previousValue, [key]: undefined }));
  }

  function mapValidationError(code: string | undefined) {
    return code ? content.validationMessages[code] ?? code : undefined;
  }

  function handleCreate() {
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

      if (nextErrors.title || nextErrors.description || nextErrors.location || nextErrors.duration) {
        setActiveSection('basic');
      } else if (
        nextErrors.destinationId ||
        nextErrors.tourTypeId
      ) {
        setActiveSection('classification');
      } else {
        setActiveSection('pricing');
      }
      return;
    }

    setFieldErrors({});
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

  return (
    <div className='toursCreateForm rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:pb-20 mt-60 md:mt-30'>
      <div className='row y-gap-20'>
        <div className='col-12 col-lg-3'>
          <div className='toursCreateNavWrap'>
            <AppSideTabs items={sectionItems} activeKey={activeSection} onChange={setActiveSection} />
          </div>
        </div>

        <div className='col-12 col-lg-9'>
          {activeSection === 'basic' ? (
            <div className='toursCreateSection border-1 rounded-12 px-20 py-20'>
              <div className='toursCreateSection__header'>
                <h4 className='text-18 fw-500'>{content.sections.basic.title}</h4>
                <p className='text-14 text-light-1 mt-5'>{content.sections.basic.description}</p>
              </div>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                <Box className='toursCreateField'>
                  <AppTextField
                    label={content.fields.title}
                    value={formState.title}
                    onChange={(value) => setValidatedField('title', value)}
                    errorMessage={fieldErrors.title}
                  />
                  {!fieldErrors.title ? <AppFieldHelper text={content.helpers.title} /> : null}
                </Box>
                <Box className='toursCreateField' sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                  <div className='mb-10 text-14 fw-500'>{content.fields.description}</div>
                  <AdminRichTextEditor
                    value={formState.description}
                    onChange={(value) => setValidatedField('description', value)}
                    toolbarLabels={content.richTextToolbar}
                    ariaLabel={content.fields.description}
                  />
                  {fieldErrors.description ? (
                    <div className='text-13 mt-5' style={{ color: '#b3261e', fontWeight: 500 }}>
                      {fieldErrors.description}
                    </div>
                  ) : null}
                  {!fieldErrors.description ? <AppFieldHelper text={content.helpers.description} /> : null}
                </Box>
                <Box className='toursCreateField'>
                  <AppTextField
                    label={content.fields.location}
                    value={formState.location}
                    onChange={(value) => setValidatedField('location', value)}
                    errorMessage={fieldErrors.location}
                  />
                  {!fieldErrors.location ? <AppFieldHelper text={content.helpers.location} /> : null}
                </Box>
                <Box className='toursCreateField'>
                  <AppTextField
                    label={content.fields.duration}
                    value={formState.duration}
                    onChange={(value) => setValidatedField('duration', value)}
                    errorMessage={fieldErrors.duration}
                  />
                  {!fieldErrors.duration ? <AppFieldHelper text={content.helpers.duration} /> : null}
                </Box>
              </Box>
            </div>
          ) : null}

          {activeSection === 'classification' ? (
            <div className='toursCreateSection border-1 rounded-12 px-20 py-20'>
              <div className='toursCreateSection__header'>
                <h4 className='text-18 fw-500'>{content.sections.classification.title}</h4>
                <p className='text-14 text-light-1 mt-5'>{content.sections.classification.description}</p>
              </div>
              {referencesQuery.isError ? (
                <div className='mb-15'>
                  <AppFieldHelper text={content.messages.referencesLoadError} className='text-red-1 mt-0' />
                </div>
              ) : null}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
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
                      text={referencesQuery.isLoading ? content.messages.referencesLoading : content.helpers.destinationId}
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
                      text={referencesQuery.isLoading ? content.messages.referencesLoading : content.helpers.tourTypeId}
                    />
                  ) : null}
                </Box>
              </Box>
            </div>
          ) : null}

          {activeSection === 'pricing' ? (
            <div className='toursCreateSection border-1 rounded-12 px-20 py-20'>
              <div className='toursCreateSection__header'>
                <h4 className='text-18 fw-500'>{content.sections.pricing.title}</h4>
                <p className='text-14 text-light-1 mt-5'>{content.sections.pricing.description}</p>
              </div>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
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
            <div className='toursCreateSection border-1 rounded-12 px-20 py-20'>
              <div className='toursCreateSection__header'>
                <h4 className='text-18 fw-500'>{content.sections.media.title}</h4>
                <p className='text-14 text-light-1 mt-5'>{content.sections.media.description}</p>
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
            <div className='toursCreateSection border-1 rounded-12 px-20 py-20'>
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
            <div className='toursCreateSection border-1 rounded-12 px-20 py-20'>
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
          onClick={() => {
            router.push('/admin/tours');
          }}
        >
          {content.actions.cancel}
        </AppButton>

        <AppButton type='button' size='sm' className='toursCreateSubmitButton' onClick={handleCreate}>
          {content.actions.create}
        </AppButton>
      </div>
    </div>
  );
}
