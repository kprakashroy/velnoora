'use client';

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useCallback, useRef } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
  makeAspectCrop,
  centerCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FiX, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';

export interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  imageSrc: string;
  aspectRatio?: number;
  title?: string;
}

const TO_RADIANS = Math.PI / 180;

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  imageSrc,
  aspectRatio = 1,
  title = 'Crop Image',
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState('');

  React.useEffect(() => {
    if (isOpen && imageSrc) {
      setImgSrc(imageSrc);
      setScale(1);
      setRotate(0);
    }

    return () => {
      if (!isOpen) {
        setCrop(undefined);
        setCompletedCrop(undefined);
        setScale(1);
        setRotate(0);
      }
    };
  }, [isOpen, imageSrc]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (aspectRatio) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspectRatio));
      }
    },
    [aspectRatio],
  );

  const getCroppedImg = async (
    image: HTMLImageElement,
    pixelCrop: PixelCrop,
    rotation = 0,
  ): Promise<Blob> => {
    // First, crop the image
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    const cropX = pixelCrop.x * scaleX;
    const cropY = pixelCrop.y * scaleY;
    const cropWidth = pixelCrop.width * scaleX;
    const cropHeight = pixelCrop.height * scaleY;

    // Create canvas for cropped image
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) {
      throw new Error('No 2d context');
    }

    croppedCanvas.width = cropWidth * pixelRatio;
    croppedCanvas.height = cropHeight * pixelRatio;

    croppedCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    croppedCtx.imageSmoothingQuality = 'high';

    // Draw cropped portion
    croppedCtx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    // If rotation is needed, rotate the cropped image
    if (rotation) {
      const rotateRads = rotation * TO_RADIANS;
      const rotatedCanvas = document.createElement('canvas');
      const rotatedCtx = rotatedCanvas.getContext('2d');

      if (!rotatedCtx) {
        throw new Error('No 2d context');
      }

      // Calculate rotated dimensions
      const cos = Math.abs(Math.cos(rotateRads));
      const sin = Math.abs(Math.sin(rotateRads));
      const rotatedWidth = cropWidth * cos + cropHeight * sin;
      const rotatedHeight = cropWidth * sin + cropHeight * cos;

      rotatedCanvas.width = rotatedWidth * pixelRatio;
      rotatedCanvas.height = rotatedHeight * pixelRatio;

      rotatedCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      rotatedCtx.imageSmoothingQuality = 'high';
      rotatedCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
      rotatedCtx.rotate(rotateRads);
      rotatedCtx.drawImage(
        croppedCanvas,
        -cropWidth / 2,
        -cropHeight / 2,
        cropWidth,
        cropHeight,
      );

      return new Promise((resolve, reject) => {
        rotatedCanvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.95,
        );
      });
    }

    // Return cropped image without rotation
    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.95,
      );
    });
  };

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    try {
      setIsProcessing(true);
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop,
        rotate,
      );
      onCropComplete(croppedImageBlob);
      handleClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isProcessing) {
      setCrop(undefined);
      setCompletedCrop(undefined);
      setScale(1);
      setRotate(0);
      onClose();
    }
  }, [isProcessing, onClose]);

  const handleRotate = useCallback(() => {
    setRotate((prev) => (prev + 90) % 360);
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <p className="mt-1 text-sm text-gray-500">
                      Drag the corners or edges to adjust the crop area
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                    aria-label="Close"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Cropper Container */}
                <div className="relative bg-gray-900 p-6">
                  <div className="relative mx-auto max-w-4xl">
                    {imgSrc && (
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspectRatio}
                        minWidth={100}
                        minHeight={100}
                        className="max-h-[60vh]"
                        style={{
                          maxHeight: '60vh',
                        }}
                      >
                        <img
                          ref={imgRef}
                          alt="Crop me"
                          src={imgSrc}
                          style={{
                            transform: `scale(${scale}) rotate(${rotate}deg)`,
                            maxHeight: '60vh',
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                          }}
                          onLoad={onImageLoad}
                          className="select-none"
                        />
                      </ReactCrop>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                  {/* Toolbar */}
                  <div className="mb-4 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
                      <button
                        type="button"
                        onClick={handleZoomOut}
                        disabled={scale <= 0.5}
                        className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Zoom out"
                      >
                        <FiZoomOut size={20} />
                      </button>
                      <span className="min-w-[60px] text-center text-sm font-medium text-gray-700">
                        {Math.round(scale * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={handleZoomIn}
                        disabled={scale >= 3}
                        className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Zoom in"
                      >
                        <FiZoomIn size={20} />
                      </button>
                    </div>

                    <div className="h-8 w-px bg-gray-300" />

                    <button
                      type="button"
                      onClick={handleRotate}
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white shadow-sm transition-colors hover:bg-primary/90 border-2 border-primary"
                      aria-label="Rotate"
                    >
                      <FiRotateCw size={20} />
                      <span className="text-sm font-medium">Rotate</span>
                    </button>
                  </div>

                  {/* Zoom Slider */}
                  <div className="mb-6">
                    <label className="mb-2 block text-center text-sm font-medium text-gray-700">
                      Zoom: {Math.round(scale * 100)}%
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={3}
                      step={0.1}
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>50%</span>
                      <span>300%</span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mb-6 rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                      <strong className="font-semibold">How to crop:</strong>{' '}
                      Click and drag the crop box to move it, or drag the corners
                      and edges to resize. Use zoom and rotate controls to adjust
                      the image.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <ButtonSecondary
                      onClick={handleClose}
                      disabled={isProcessing}
                      className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      Cancel
                    </ButtonSecondary>
                    <ButtonPrimary
                      onClick={handleSave}
                      disabled={isProcessing || !completedCrop}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Save Cropped Image'
                      )}
                    </ButtonPrimary>
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

export default ImageCropModal;
