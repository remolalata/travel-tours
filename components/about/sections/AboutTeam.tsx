import Image from 'next/image';

import { aboutContent } from '@/content/features/about';

export default function AboutTeam() {
  const { team } = aboutContent;

  return (
    <section className='layout-pt-xl'>
      <div className='container'>
        <div className='row'>
          <div className='col-auto'>
            <h2 className='text-30'>{team.title}</h2>
          </div>
        </div>

        <div className='row y-gap-30 pt-40 sm:pt-20'>
          {team.members.map((member) => (
            <div key={member.id} className='col-lg col-md-4 col-sm-6'>
              <div className='ratio ratio-23:26'>
                <Image
                  width={345}
                  height={395}
                  src={member.imageSrc}
                  alt={member.imageAlt}
                  className='img-ratio bg-light-1 rounded-12'
                />
              </div>

              <h3 className='text-16 fw-500 mt-20'>{member.name}</h3>
              <p className='text-14 lh-16'>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
