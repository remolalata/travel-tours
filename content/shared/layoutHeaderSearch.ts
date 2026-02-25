export interface SearchItem {
  id: number;
  iconClass?: string;
  img?: string;
  title: string;
  location: string;
}

export const headerSearchContent = {
  labels: {
    inputLabel: 'Search destinations or activities',
    inputPlaceholder: 'Search destinations or activities',
    recentSearchesTitle: 'Recent Searches',
  },
  searchData: [
    {
      id: 1,
      iconClass: 'icon-pin text-20',
      title: 'Boracay tour package',
      location: 'Philippines',
    },
    {
      id: 2,
      iconClass: 'icon-pin text-20',
      title: 'Thailand Tour package',
      location: 'Thailand',
    },
    {
      id: 3,
      iconClass: 'icon-pin text-20',
      title: 'Palawan tour package',
      location: 'Philippines',
    },
    {
      id: 4,
      iconClass: 'icon-pin text-20',
      title: 'Cebu and Bohol tour package',
      location: 'Philippines',
    },
    {
      id: 5,
      iconClass: 'icon-pin text-20',
      title: 'Siargao island hopping package',
      location: 'Philippines',
    },
    {
      id: 6,
      iconClass: 'icon-pin text-20',
      title: 'Batanes cultural tour package',
      location: 'Philippines',
    },
    {
      id: 7,
      iconClass: 'icon-pin text-20',
      title: 'Ilocos heritage tour package',
      location: 'Philippines',
    },
  ] as SearchItem[],
} as const;
