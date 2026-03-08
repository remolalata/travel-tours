'use client';

import AppButton from '@/components/common/button/AppButton';
import AppModal from '@/components/common/modal/AppModal';

type AppConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  isConfirming?: boolean;
};

export default function AppConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  cancelLabel,
  confirmLabel,
  isConfirming = false,
}: AppConfirmModalProps) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <AppButton
            type='button'
            size='sm'
            variant='outline'
            onClick={onClose}
            disabled={isConfirming}
          >
            {cancelLabel}
          </AppButton>
          <AppButton type='button' size='sm' onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? `${confirmLabel}...` : confirmLabel}
          </AppButton>
        </>
      }
    >
      <p className='mb-0 text-15 lh-16 text-dark-1'>{description}</p>
    </AppModal>
  );
}
