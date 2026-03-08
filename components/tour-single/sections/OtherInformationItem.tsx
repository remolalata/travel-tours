interface OtherInformationItemProps {
  iconClassName: string;
  label: string;
  value: string;
}

export default function OtherInformationItem({
  iconClassName,
  label,
  value,
}: OtherInformationItemProps) {
  return (
    <div className='col-lg-4 col-6'>
      <div className='d-flex items-center'>
        <div className='flex-center border rounded-12 size-50'>
          <i className={`text-20 ${iconClassName}`}></i>
        </div>

        <div className='ml-10'>
          <div className='lh-16'>{label}</div>
          <div className='text-14 text-light-2 lh-16'>{value}</div>
        </div>
      </div>
    </div>
  );
}
