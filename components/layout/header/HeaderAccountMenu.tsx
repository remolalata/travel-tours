'use client';

import { List, ListItemButton, ListItemText, Popover } from '@mui/material';
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

        <Link href='/login' className='button -sm -dark-1 bg-accent-1 rounded-200 text-white ml-30'>
          {headerAccountContent.actions.logIn}
        </Link>
      </>
    );
  }

  return (
    <>
      <button
        type='button'
        className='ml-30 d-flex items-center'
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
            className='size-40 rounded-circle border-1 flex-center text-dark-1 fw-500'
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
              minWidth: 130,
            },
          },
        }}
      >
        <List sx={{ py: 0.5, px: 0.5, minWidth: 130 }}>
          <li style={{ listStyle: 'none' }}>
            <form action='/logout' method='post' style={{ width: '100%' }}>
              <ListItemButton
                component='button'
                type='submit'
                onClick={handleClose}
                sx={{
                  width: '100%',
                  py: 0.5,
                  px: 1.25,
                  borderRadius: 1,
                  gap: 1,
                  justifyContent: 'flex-start',
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                  '&:hover': {
                    bgcolor: 'var(--color-blue-1)',
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
