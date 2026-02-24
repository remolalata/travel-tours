'use client';

import { Divider, List, ListItemButton, ListItemText, Popover } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import type { AuthViewerState } from '@/api/auth/mutations/authApi';
import { headerAccountContent } from '@/content/shared/layoutHeaderAccount';
import useHeaderAccountMenu from '@/utils/hooks/layout/useHeaderAccountMenu';

type HeaderAccountMenuProps = {
  authState: AuthViewerState;
};

function getAvatarFallbackLabel(authState: AuthViewerState): string {
  const source =
    authState.fullName ?? authState.email ?? headerAccountContent.avatar.fallbackSource;
  const firstCharacter = source.trim().charAt(0).toUpperCase();
  return firstCharacter || headerAccountContent.avatar.fallbackSource.charAt(0).toUpperCase();
}

export default function HeaderAccountMenu({ authState }: HeaderAccountMenuProps) {
  const avatarFallbackLabel = useMemo(() => getAvatarFallbackLabel(authState), [authState]);
  const { anchorEl, isOpen, popoverId, handleClose, handleOpen } = useHeaderAccountMenu();

  if (!authState.isAuthenticated) {
    return (
      <>
        <Link href='/register' className='ml-10'>
          {headerAccountContent.actions.signUp}
        </Link>

        <Link href='/login' className='ml-30 rounded-200 text-white bg-accent-1 button -sm -dark-1'>
          {headerAccountContent.actions.logIn}
        </Link>
      </>
    );
  }

  return (
    <>
      <button
        type='button'
        className='d-flex items-center ml-30'
        aria-label={headerAccountContent.aria.openAccountMenu}
        title={authState.fullName ?? authState.email ?? headerAccountContent.avatar.titleFallback}
        onClick={handleOpen}
      >
        {authState.avatarUrl ? (
          <Image
            width={40}
            height={40}
            src={authState.avatarUrl}
            alt={headerAccountContent.avatar.imageAlt}
            className='rounded-circle object-cover'
            style={{ borderRadius: '50%' }}
          />
        ) : (
          <div
            className='flex-center border rounded-circle size-40 text-dark-1 fw-500'
            style={{ borderRadius: '50%' }}
          >
            {avatarFallbackLabel}
          </div>
        )}
      </button>

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
          {authState.role === 'admin' ? (
            <>
              <li style={{ listStyle: 'none' }}>
                <ListItemButton
                  component={Link}
                  href='/admin/dashboard'
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
                      '& i': {
                        color: '#fff',
                      },
                      '& .MuiListItemText-primary': {
                        color: '#fff',
                      },
                    },
                  }}
                >
                  <i className={headerAccountContent.actions.dashboardIconClass} />
                  <ListItemText primary={headerAccountContent.actions.dashboard} />
                </ListItemButton>
              </li>
              <Divider
                sx={{
                  my: 0.5,
                  borderColor: headerAccountContent.menu.dividerColor,
                }}
              />
            </>
          ) : null}
          <li style={{ listStyle: 'none' }}>
            <ListItemButton
              component={Link}
              href='/my-bookings'
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
                  '& i': {
                    color: '#fff',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#fff',
                  },
                },
              }}
            >
              <i className={headerAccountContent.actions.myBookingsIconClass} />
              <ListItemText primary={headerAccountContent.actions.myBookings} />
            </ListItemButton>
          </li>
          <li style={{ listStyle: 'none' }}>
            <ListItemButton
              component={Link}
              href='/profile'
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
                  '& i': {
                    color: '#fff',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#fff',
                  },
                },
              }}
            >
              <i className={headerAccountContent.actions.profileIconClass} />
              <ListItemText primary={headerAccountContent.actions.profile} />
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
                    '& i': {
                      color: '#fff',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#fff',
                    },
                  },
                }}
              >
                <i className={headerAccountContent.actions.logoutIconClass} />
                <ListItemText primary={headerAccountContent.actions.logout} />
              </ListItemButton>
            </form>
          </li>
        </List>
      </Popover>
    </>
  );
}
