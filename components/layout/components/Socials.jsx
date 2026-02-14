const socialMediaLinks = [
  {
    id: 1,
    className: 'icon-facebook',
    href: 'https://www.facebook.com/gr8escapes/',
    ariaLabel: 'Facebook',
  },
  {
    id: 2,
    type: 'tiktok-svg',
    href: 'https://www.tiktok.com/@gr8escapestravelandtours/',
    ariaLabel: 'TikTok',
  },
];

export default function Socials() {
  return (
    <>
      {socialMediaLinks.map((elm) => (
        <a
          key={elm.id}
          href={elm.href}
          className={elm.className || ''}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={elm.ariaLabel}
          style={elm.style}
        >
          {elm.type === 'tiktok-svg' ? (
            <svg viewBox='0 0 16 16' width='16' height='16' aria-hidden='true' focusable='false'>
              <path
                d='M9 0h3a4 4 0 0 0 4 4v3a7 7 0 0 1-4-1.528V11a5 5 0 1 1-5-5h1v3H7a2 2 0 1 0 2 2V0z'
                fill='currentColor'
              />
            </svg>
          ) : null}
        </a>
      ))}
    </>
  );
}
