type AppFieldHelperProps = {
  text: string;
  className?: string;
};

export default function AppFieldHelper({ text, className = '' }: AppFieldHelperProps) {
  const classes = ['text-13', 'text-light-1', 'mt-5', className].filter(Boolean).join(' ');
  return <div className={classes}>{text}</div>;
}
