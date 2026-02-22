import Link from 'next/link';

type AppBreadcrumbItem = {
  label: string;
  href?: string;
};

type AppBreadcrumbProps = {
  items: readonly AppBreadcrumbItem[];
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  separatorClassName?: string;
};

export default function AppBreadcrumb({
  items,
  className,
  listClassName,
  itemClassName,
  separatorClassName,
}: AppBreadcrumbProps) {
  return (
    <nav aria-label='Breadcrumb' className={className}>
      <ol
        className={listClassName}
        itemScope
        itemType='https://schema.org/BreadcrumbList'
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className={itemClassName}
              itemProp='itemListElement'
              itemScope
              itemType='https://schema.org/ListItem'
            >
              {item.href && !isLastItem ? (
                <Link href={item.href} itemProp='item'>
                  <span itemProp='name'>{item.label}</span>
                </Link>
              ) : (
                <span aria-current={isLastItem ? 'page' : undefined} itemProp='name'>
                  {item.label}
                </span>
              )}
              <meta itemProp='position' content={String(index + 1)} />
              {!isLastItem ? (
                <span className={separatorClassName} aria-hidden='true'>
                  {'>'}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
