'use client';

type AppSideTabItem<Key extends string> = {
  key: Key;
  title: string;
  description?: string;
};

type AppSideTabsProps<Key extends string> = {
  items: AppSideTabItem<Key>[];
  activeKey: Key;
  onChange: (key: Key) => void;
};

export default function AppSideTabs<Key extends string>({
  items,
  activeKey,
  onChange,
}: AppSideTabsProps<Key>) {
  return (
    <div className='appSideTabs' role='tablist' aria-orientation='vertical'>
      {items.map((item, index) => {
        const isActive = item.key === activeKey;

        return (
          <button
            key={item.key}
            type='button'
            role='tab'
            aria-selected={isActive}
            className={`appSideTabs__item ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            <div className='appSideTabs__itemContent'>
              <div className='appSideTabs__index'>{index + 1}</div>
              <div className='appSideTabs__text'>
                <div className='appSideTabs__title'>{item.title}</div>
                {item.description ? <div className='appSideTabs__description'>{item.description}</div> : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
