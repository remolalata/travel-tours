import { contactPageContent } from '@/content/features/contact';

export default function Locations() {
  return (
    <section className='layout-pt-lg'>
      <div className='container'>
        <div className='row y-gap-30'>
          {contactPageContent.locations.map((location) => (
            <div key={location.id} className='col-lg-3 col-sm-6'>
              <div className='px-30 text-center'>
                <h3 className='text-30 md:text-24 fw-700'>{location.title}</h3>

                <div className='mt-20 md:mt-10'>
                  {location.address}
                  <br />
                  <br />
                  {location.contact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
