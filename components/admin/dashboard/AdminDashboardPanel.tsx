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
      <div className='px-25 py-20 border-1-bottom'>
        <div className='d-flex items-start justify-between x-gap-15 y-gap-10'>
          <div>
            <div className='text-18 fw-600 text-dark-1'>{title}</div>
            {subtitle ? (
              <div className='text-13 text-dark-1 mt-5' style={{ opacity: 0.68 }}>
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
