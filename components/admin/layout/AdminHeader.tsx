'use client';

import { List, ListItemButton, ListItemText, Popover } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { adminContent } from '@/content/features/admin';
import useAdminProfileQuery from '@/services/admin/profile/hooks/useAdminProfileQuery';
import useHeaderAccountMenu from '@/utils/hooks/layout/useHeaderAccountMenu';

type AdminHeaderProps = {
  onToggleSidebar: () => void;
};

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const profileQuery = useAdminProfileQuery();
  const avatarUrl = profileQuery.data?.avatarUrl ?? null;
  const firstName = profileQuery.data?.firstName?.trim() || null;
  const { anchorEl, isOpen, popoverId, handleClose, handleOpen } = useHeaderAccountMenu();

  return (
    <div className='dashboard__content_header'>
      <div className='d-flex items-center'>
        <div className='mr-60'>
          <button onClick={onToggleSidebar} className='d-flex js-toggle-db-sidebar' type='button'>
            <i className='text-20 icon-main-menu'></i>
          </button>
        </div>

        <div className='d-flex items-center px-20 py-5 border rounded-200 dashboard__content_header_search md:d-none'>
          <i className='mr-10 text-18 icon-search'></i>
          <input type='text' placeholder={adminContent.shell.searchPlaceholder} />
        </div>
      </div>

      <div className='d-flex items-center x-gap-20'>
        {adminContent.shell.topActions.map((action) => (
          <div key={action.id}>
            {action.imageSrc ? (
              <button
                type='button'
                className='d-flex items-center'
                aria-label={action.label}
                title={action.label}
                onClick={handleOpen}
              >
                {firstName ? <span className='mr-10 text-14 fw-500'>{firstName}</span> : null}
                {avatarUrl ? (
                  <Image
                    width={42}
                    height={42}
                    src={avatarUrl}
                    alt={action.label}
                    className='rounded-circle object-cover'
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    className='flex-center border rounded-circle size-40 text-dark-1'
                    aria-label={action.label}
                    title={action.label}
                    style={{ borderRadius: '50%' }}
                  >
                    <i className='text-18 icon-person' />
                  </div>
                )}
              </button>
            ) : (
              <button type='button' aria-label={action.label}>
                <i className={action.iconClass}></i>
              </button>
            )}
          </div>
        ))}
      </div>

      <Popover
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 170,
            },
          },
        }}
      >
        <List sx={{ py: 0.75, px: 0.75, minWidth: 170 }}>
          <li style={{ listStyle: 'none' }}>
            <ListItemButton
              component={Link}
              href='/'
              onClick={handleClose}
              sx={{
                width: '100%',
                py: 0.75,
                px: 1.5,
                borderRadius: 1,
                gap: 1,
                justifyContent: 'flex-start',
                '& .MuiListItemText-primary': {
                  fontSize: 15,
                  fontWeight: 500,
                },
                '&:hover': {
                  bgcolor: '#05073c',
                  '& .MuiListItemText-primary': {
                    color: '#fff',
                  },
                },
              }}
            >
              <i className='icon-home text-16' />
              <ListItemText primary='Home' />
            </ListItemButton>
          </li>
          <li style={{ listStyle: 'none' }}>
            <form action='/logout' method='post' style={{ width: '100%' }}>
              <ListItemButton
                component='button'
                type='submit'
                onClick={handleClose}
                sx={{
                  width: '100%',
                  py: 0.75,
                  px: 1.5,
                  borderRadius: 1,
                  gap: 1,
                  justifyContent: 'flex-start',
                  '& .MuiListItemText-primary': {
                    fontSize: 15,
                    fontWeight: 500,
                  },
                  '&:hover': {
                    bgcolor: '#05073c',
                    '& .MuiListItemText-primary': {
                      color: '#fff',
                    },
                  },
                }}
              >
                <i className='icon-logout text-16' />
                <ListItemText primary='Logout' />
              </ListItemButton>
            </form>
          </li>
        </List>
      </Popover>
    </div>
  );
}
