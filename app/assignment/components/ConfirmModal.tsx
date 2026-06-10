'use client';

import React from 'react';
import { ModalConfirm } from '@/app/components/ui/ModalConfirm';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '确认删除',
  message,
}: ConfirmModalProps) {
  return (
    <ModalConfirm
      isOpen={isOpen}
      title={title}
      message={message}
      confirmText="确认删除"
      cancelText="取消"
      type="danger"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
}

export default ConfirmModal;
