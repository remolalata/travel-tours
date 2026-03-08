export const toursContent = {
  pageHeader: {
    breadcrumbs: [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'Tours',
        href: '/tours',
      },
    ],
    title: 'Explore all tours and activities',
  },
  list: {
    sort: {
      label: 'Sort by:',
      options: {
        recommended: 'Recommended',
        priceLowToHigh: 'Price: Low to High',
        priceHighToLow: 'Price: High to Low',
        newest: 'Newest',
      },
    },
  },
} as const;
