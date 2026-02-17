import { destinationsPageContent } from '@/content/features/destinations';

export default function DestinationInformationSection() {
  const { information } = destinationsPageContent;

  return (
    <section className='layout-pt-xl layout-pb-xl'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-8'>
            <h2 className='text-30 md:text-24'>{information.title}</h2>
          </div>
        </div>

        <div className='row y-gap-20 pt-30'>
          <div className='col-lg-8'>
            {information.paragraphs.map((paragraph, index) => (
              <p key={index} className={index > 0 ? 'mt-20' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className='line mt-40 mb-40'></div>

        <div className='row y-gap-20'>
          <div className='col-12'>
            <h3 className='text-20 fw-500'>{information.weatherTitle}</h3>
          </div>

          {information.weather.map((weatherItem) => (
            <div key={weatherItem.id} className='col-lg-3 col-6'>
              <div>{weatherItem.period}</div>

              <div className='d-flex text-20 fw-500 pt-5'>
                <span>{weatherItem.high}</span>
                <span className='ml-20'>{weatherItem.low}</span>
              </div>
            </div>
          ))}
        </div>

        <div className='line mt-40 mb-40'></div>

        <div className='row y-gap-20'>
          <div className='col-12'>
            <h3 className='text-20 fw-500'>{information.generalInfoTitle}</h3>
          </div>

          {information.generalInfo.map((infoItem) => (
            <div key={infoItem.id} className='col-lg-4 col-6'>
              <div>{infoItem.label}</div>
              <div className='fw-500'>{infoItem.value}</div>
              {infoItem.note ? <div>{infoItem.note}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
