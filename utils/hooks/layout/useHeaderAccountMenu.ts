'use client';

import { type MouseEvent, useState } from 'react';

export default function useHeaderAccountMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    anchorEl,
    isOpen: Boolean(anchorEl),
    popoverId: anchorEl ? 'header-account-popover' : undefined,
    handleOpen,
    handleClose,
  };
}
