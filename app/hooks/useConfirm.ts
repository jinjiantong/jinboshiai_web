'use client';

import { useState, useCallback, useMemo } from 'react';
import ModalConfirm from '../components/ui/ModalConfirm';

interface UseConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface UseConfirmReturn {
  confirm: (options?: UseConfirmOptions) => Promise<boolean>;
  confirmOpen: boolean;
  confirmOptions: UseConfirmOptions;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export function useConfirm(): UseConfirmReturn {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState<UseConfirmOptions>({});
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: UseConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmOptions(opts);
      setResolveRef(() => resolve);
      setConfirmOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setConfirmOpen(false);
    resolveRef?.(true);
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    setConfirmOpen(false);
    resolveRef?.(false);
  }, [resolveRef]);

  return {
    confirm,
    confirmOpen,
    confirmOptions,
    handleConfirm,
    handleCancel,
  };
}

export default useConfirm;
