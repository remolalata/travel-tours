'use client';

import useFacebookShare from '@/utils/hooks/share/useFacebookShare';

interface FacebookShareActionProps {
  label: string;
  ariaLabelPrefix: string;
  tourTitle?: string;
}

function buildAriaLabel(ariaLabelPrefix: string, tourTitle?: string): string {
  const normalizedTitle = tourTitle?.trim();

  if (!normalizedTitle) {
    return ariaLabelPrefix;
  }

  return `${ariaLabelPrefix}: ${normalizedTitle}`;
}

export default function FacebookShareAction({
  label,
  ariaLabelPrefix,
  tourTitle,
}: FacebookShareActionProps) {
  const { share } = useFacebookShare();

  return (
    <button
      type='button'
      className='d-flex items-center bg-transparent border-0 p-0'
      onClick={() => share()}
      aria-label={buildAriaLabel(ariaLabelPrefix, tourTitle)}
    >
      <i className='flex-center mr-10 text-16 icon-share'></i>
      {label}
    </button>
  );
}
