'use client';

import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import useAdminTourReferencesQuery from '@/api/admin/tours/hooks/useAdminTourReferencesQuery';
import AppButton from '@/components/common/button/AppButton';
import AppFieldHelper from '@/components/common/form/AppFieldHelper';
import AppSelectField from '@/components/common/form/AppSelectField';
import AppTextField from '@/components/common/form/AppTextField';
import AppSideTabs from '@/components/common/navigation/AppSideTabs';
import { adminContent } from '@/content/features/admin';
import type { AdminTourCreateValidationInput } from '@/types/admin';
import { validateAdminTourCreateForm } from '@/utils/helpers/formValidation';

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
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isTopTrending: boolean;
  itineraries: TourItineraryFormItem[];
  inclusions: TourInclusionFormItem[];
};

type TourCreateSectionKey = 'basic' | 'classification' | 'pricing' | 'media' | 'itinerary' | 'inclusions';
type TourCreateValidatableField = keyof AdminTourCreateValidationInput;

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

  function addItineraryItem() {
    setFormState((previousValue) => ({
      ...previousValue,
      itineraries: [
        ...previousValue.itineraries,
        {
          id: `itinerary-${Date.now()}`,
          dayNumber: String(previousValue.itineraries.length + 1),
          title: '',
          content: '',
          icon: '',
          isSummary: false,
        },
      ],
    }));
  }

  function updateItineraryItem(
    itineraryId: string,
    key: keyof Omit<TourItineraryFormItem, 'id'>,
    value: string | boolean,
  ) {
    setFormState((previousValue) => ({
      ...previousValue,
      itineraries: previousValue.itineraries.map((item) =>
        item.id === itineraryId
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    }));
  }

  function removeItineraryItem(itineraryId: string) {
    setFormState((previousValue) => {
      if (previousValue.itineraries.length <= 1) {
        return previousValue;
      }

      return {
        ...previousValue,
        itineraries: previousValue.itineraries.filter((item) => item.id !== itineraryId),
      };
    });
  }

  function addInclusionItem() {
    setFormState((previousValue) => ({
      ...previousValue,
      inclusions: [
        ...previousValue.inclusions,
        {
          id: `inclusion-${Date.now()}`,
          itemType: 'included',
          itemOrder: String(previousValue.inclusions.length + 1),
          content: '',
        },
      ],
    }));
  }

  function updateInclusionItem(
    inclusionId: string,
    key: keyof Omit<TourInclusionFormItem, 'id'>,
    value: string,
  ) {
    setFormState((previousValue) => ({
      ...previousValue,
      inclusions: previousValue.inclusions.map((item) =>
        item.id === inclusionId
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    }));
  }

  function removeInclusionItem(inclusionId: string) {
    setFormState((previousValue) => {
      if (previousValue.inclusions.length <= 1) {
        return previousValue;
      }

      return {
        ...previousValue,
        inclusions: previousValue.inclusions.filter((item) => item.id !== inclusionId),
      };
    });
  }

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
                  <AppTextField
                    label={content.fields.description}
                    value={formState.description}
                    onChange={(value) => setValidatedField('description', value)}
                    errorMessage={fieldErrors.description}
                    multiline
                    rows={4}
                  />
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
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5 }}>
                <Box className='toursCreateField'>
                  <AppTextField
                    label={content.fields.imageSrc}
                    value={formState.imageSrc}
                    onChange={(value) => setField('imageSrc', value)}
                    type='url'
                  />
                  <AppFieldHelper text={content.helpers.imageSrc} />
                </Box>
                <Box className='toursCreateField toursCreateSwitchField'>
                  <div className='row y-gap-10'>
                    <div className='col-12 col-md-6'>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formState.isActive}
                            onChange={(_, checked) => setField('isActive', checked)}
                            color='primary'
                          />
                        }
                        label={content.fields.isActive}
                      />
                      <AppFieldHelper text={content.helpers.isActive} />
                    </div>
                    <div className='col-12 col-md-6'>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formState.isFeatured}
                            onChange={(_, checked) => setField('isFeatured', checked)}
                            color='primary'
                          />
                        }
                        label={content.fields.isFeatured}
                      />
                      <AppFieldHelper text={content.helpers.isFeatured} />
                    </div>
                    <div className='col-12 col-md-6'>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formState.isPopular}
                            onChange={(_, checked) => setField('isPopular', checked)}
                            color='primary'
                          />
                        }
                        label={content.fields.isPopular}
                      />
                      <AppFieldHelper text={content.helpers.isPopular} />
                    </div>
                    <div className='col-12 col-md-6'>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formState.isTopTrending}
                            onChange={(_, checked) => setField('isTopTrending', checked)}
                            color='primary'
                          />
                        }
                        label={content.fields.isTopTrending}
                      />
                      <AppFieldHelper text={content.helpers.isTopTrending} />
                    </div>
                  </div>
                </Box>
              </Box>
            </div>
          ) : null}

          {activeSection === 'itinerary' ? (
            <div className='toursCreateSection border-1 rounded-12 px-20 py-20'>
              <div className='toursCreateSection__header d-flex justify-between items-center'>
                <div>
                  <h4 className='text-18 fw-500'>{content.sections.itinerary.title}</h4>
                  <p className='text-14 text-light-1 mt-5'>{content.sections.itinerary.description}</p>
                </div>
                <AppButton type='button' size='sm' variant='outline' onClick={addItineraryItem}>
                  {content.actions.addItinerary}
                </AppButton>
              </div>

              <div className='d-flex flex-column y-gap-15'>
                {formState.itineraries.map((itinerary, index) => (
                  <div key={itinerary.id} className='toursCreateItineraryCard border-1 rounded-12 p-15'>
                    <div className='d-flex justify-between items-center mb-15'>
                      <h5 className='text-16 fw-500'>
                        {content.sections.itinerary.title} {index + 1}
                      </h5>
                      <AppButton
                        type='button'
                        size='sm'
                        variant='outline'
                        onClick={() => removeItineraryItem(itinerary.id)}
                        disabled={formState.itineraries.length <= 1}
                      >
                        {content.actions.removeItinerary}
                      </AppButton>
                    </div>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                      <Box className='toursCreateField'>
                        <AppTextField
                          label={content.fields.itineraryDayNumber}
                          value={itinerary.dayNumber}
                          onChange={(value) => updateItineraryItem(itinerary.id, 'dayNumber', value)}
                          type='number'
                        />
                        <AppFieldHelper text={content.helpers.itineraryDayNumber} />
                      </Box>
                      <Box className='toursCreateField toursCreateSwitchField'>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={itinerary.isSummary}
                              onChange={(_, checked) => updateItineraryItem(itinerary.id, 'isSummary', checked)}
                              color='primary'
                            />
                          }
                          label={content.fields.itinerarySummary}
                        />
                        <AppFieldHelper text={content.helpers.itinerarySummary} />
                      </Box>
                      <Box className='toursCreateField' sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                        <AppTextField
                          label={content.fields.itineraryTitle}
                          value={itinerary.title}
                          onChange={(value) => updateItineraryItem(itinerary.id, 'title', value)}
                        />
                        <AppFieldHelper text={content.helpers.itineraryTitle} />
                      </Box>
                      <Box className='toursCreateField' sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                        <AppTextField
                          label={content.fields.itineraryIcon}
                          value={itinerary.icon}
                          onChange={(value) => updateItineraryItem(itinerary.id, 'icon', value)}
                        />
                        <AppFieldHelper text={content.helpers.itineraryIcon} />
                      </Box>
                      <Box className='toursCreateField' sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                        <AppTextField
                          label={content.fields.itineraryContent}
                          value={itinerary.content}
                          onChange={(value) => updateItineraryItem(itinerary.id, 'content', value)}
                          multiline
                          rows={4}
                        />
                        <AppFieldHelper text={content.helpers.itineraryContent} />
                      </Box>
                    </Box>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeSection === 'inclusions' ? (
            <div className='toursCreateSection border-1 rounded-12 px-20 py-20'>
              <div className='toursCreateSection__header d-flex justify-between items-center'>
                <div>
                  <h4 className='text-18 fw-500'>{content.sections.inclusions.title}</h4>
                  <p className='text-14 text-light-1 mt-5'>{content.sections.inclusions.description}</p>
                </div>
                <AppButton type='button' size='sm' variant='outline' onClick={addInclusionItem}>
                  {content.actions.addInclusion}
                </AppButton>
              </div>

              <div className='d-flex flex-column y-gap-15'>
                {formState.inclusions.map((inclusion, index) => (
                  <div key={inclusion.id} className='toursCreateItineraryCard border-1 rounded-12 p-15'>
                    <div className='d-flex justify-between items-center mb-15'>
                      <h5 className='text-16 fw-500'>
                        {content.sections.inclusions.title} {index + 1}
                      </h5>
                      <AppButton
                        type='button'
                        size='sm'
                        variant='outline'
                        onClick={() => removeInclusionItem(inclusion.id)}
                        disabled={formState.inclusions.length <= 1}
                      >
                        {content.actions.removeInclusion}
                      </AppButton>
                    </div>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                      <Box className='toursCreateField'>
                        <AppTextField
                          label={content.fields.inclusionType}
                          value={inclusion.itemType}
                          onChange={(value) => updateInclusionItem(inclusion.id, 'itemType', value)}
                        />
                        <AppFieldHelper text={content.helpers.inclusionType} />
                      </Box>
                      <Box className='toursCreateField'>
                        <AppTextField
                          label={content.fields.inclusionOrder}
                          value={inclusion.itemOrder}
                          onChange={(value) => updateInclusionItem(inclusion.id, 'itemOrder', value)}
                          type='number'
                        />
                        <AppFieldHelper text={content.helpers.inclusionOrder} />
                      </Box>
                      <Box className='toursCreateField' sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                        <AppTextField
                          label={content.fields.inclusionContent}
                          value={inclusion.content}
                          onChange={(value) => updateInclusionItem(inclusion.id, 'content', value)}
                          multiline
                          rows={3}
                        />
                        <AppFieldHelper text={content.helpers.inclusionContent} />
                      </Box>
                    </Box>
                  </div>
                ))}
              </div>
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
