'use client';

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';

export type ModalType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const getIcon = () => {
    const iconClass = 'w-6 h-6';
    switch (type) {
      case 'danger':
        return <FiXCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <FiAlertTriangle className={`${iconClass} text-orange-500`} />;
      case 'info':
        return <FiInfo className={`${iconClass} text-blue-500`} />;
      case 'success':
        return <FiCheckCircle className={`${iconClass} text-green-500`} />;
      default:
        return <FiAlertTriangle className={`${iconClass} text-orange-500`} />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-primary hover:bg-primary/80';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex shrink-0 items-center justify-center">
                    {getIcon()}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-secondary"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-600">{message}</p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-3">
                      <ButtonSecondary
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 bg-secondary text-white hover:bg-secondary/90"
                      >
                        {cancelText}
                      </ButtonSecondary>
                      <ButtonPrimary
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 ${getConfirmButtonClass()}`}
                      >
                        {isLoading ? 'Processing...' : confirmText}
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;

