import type { ReactNode } from 'react';

type AdminDashboardPanelProps = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function AdminDashboardPanel({
  title,
  subtitle,
  rightSlot,
  children,
  className,
  contentClassName,
}: AdminDashboardPanelProps) {
  return (
    <div className={`bg-white shadow-2 ${className ?? ''}`.trim()} style={{ borderRadius: 20 }}>
      <div className='px-25 py-20 border-bottom'>
        <div className='d-flex justify-between items-start x-gap-15 y-gap-10'>
          <div>
            <div className='text-18 text-dark-1 fw-600'>{title}</div>
            {subtitle ? (
              <div className='mt-5 text-13 text-dark-1' style={{ opacity: 0.68 }}>
                {subtitle}
              </div>
            ) : null}
          </div>
          {rightSlot ? <div className='col-auto'>{rightSlot}</div> : null}
        </div>
      </div>

      <div className={contentClassName ?? 'px-25 py-20'}>{children}</div>
    </div>
  );
}
