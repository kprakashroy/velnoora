'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FiEdit, FiTrash2, FiUpload, FiX } from 'react-icons/fi';

import { COLOR_MAP, PRODUCT_COLORS, PRODUCT_SIZES } from '@/constants';
import { useAuthApi } from '@/hooks/useAuthApi';
import { createProduct, deleteProduct, getProducts, updateProduct, uploadFile } from '@/lib/api-client';
import { ConfirmationModal, ImageCropModal } from '@/shared/Modal';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
import Select from '@/shared/Select/Select';
import TextArea from '@/shared/TextArea/TextArea';

const AddCollectionPage = () => {
  const router = useRouter();
  const { userProfile, loading: authLoading, user } = useAuthApi();

  const [activeTab, setActiveTab] = useState<'add' | 'edit'>('add');
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [mainImageUrl, setMainImageUrl] = useState<string>('');
  const [supportingImages, setSupportingImages] = useState<File[]>([]);
  const [supportingImagePreviews, setSupportingImagePreviews] = useState<
    string[]
  >([]);
  const [supportingImageUrls, setSupportingImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    description: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [colorSearchTerm, setColorSearchTerm] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [cropImageType, setCropImageType] = useState<'main' | 'supporting'>('main');
  const [pendingSupportingImageIndex, setPendingSupportingImageIndex] = useState<number>(-1);

  const renderColorSwatch = useCallback((
    colorName: string,
    size: 'small' | 'medium' = 'medium',
  ) => {
    const colorValue =
      COLOR_MAP[colorName as keyof typeof COLOR_MAP] || '#CCCCCC';
    const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';

    return (
      <div className="flex items-center gap-2">
        <div
          className={`${sizeClass} border-gray-300 shrink-0 rounded border`}
          style={{
            background: colorValue,
            backgroundSize: colorValue.includes('gradient')
              ? '20px 20px'
              : 'auto',
          }}
        />
        <span>{colorName}</span>
      </div>
    );
  }, []);

  const getColorNameFromHex = useCallback((hexCode: string): string => {
    const colorEntry = Object.entries(COLOR_MAP).find(
      ([_, hex]) => hex === hexCode,
    );
    return colorEntry ? colorEntry[0] : 'Unknown Color';
  }, []);

  const renderColorSwatchFromHex = useCallback((
    hexCode: string,
    size: 'small' | 'medium' = 'medium',
  ) => {
    const colorName = getColorNameFromHex(hexCode);
    const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';

    return (
      <div className="flex items-center gap-2">
        <div
          className={`${sizeClass} border-gray-300 shrink-0 rounded border`}
          style={{
            background: hexCode,
            backgroundSize: hexCode.includes('gradient') ? '20px 20px' : 'auto',
          }}
        />
        <span>{colorName}</span>
      </div>
    );
  }, [getColorNameFromHex]);

  useEffect(() => {
    if (!authLoading && userProfile !== null && !userProfile?.admin) {
      router.push('/');
    }
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    return () => {
      if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(mainImagePreview);
      }
      supportingImagePreviews.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      if (imageToCrop) {
        URL.revokeObjectURL(imageToCrop);
      }
    };
  }, [mainImagePreview, supportingImagePreviews, imageToCrop]);

  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const response = await getProducts();
      setProducts(response.products || []);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'edit' && products.length === 0) {
      loadProducts();
    }
  }, [activeTab, products.length, loadProducts]);

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setDescription(product.description || '');
    setPrice(product.amount?.toString() || '');
    setCurrency(product.currency || 'USD');
    setCategory(product.category || '');
    setAvailableSizes(product.available_sizes || []);
    setAvailableColors(product.available_colors || []);
    setMainImageUrl(product.main_image_url || '');
    setMainImagePreview(product.main_image_url || '');
    setSupportingImageUrls(product.images || []);
    setSupportingImagePreviews(product.images || []);
    setError('');
    setSuccess('');
  };

  const handleDeleteClick = (productId: string, productDescription: string) => {
    setProductToDelete({ id: productId, description: productDescription });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      setError('');
      await deleteProduct(productToDelete.id);
      setSuccess('Product deleted successfully!');
      setShowDeleteModal(false);
      setProductToDelete(null);
      await loadProducts();
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(`Failed to delete product: ${err.message}`);
      setShowDeleteModal(false);
      setProductToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleting) {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const resetForm = useCallback(() => {
    if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(mainImagePreview);
    }
    supportingImagePreviews.forEach((preview) => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }

    setDescription('');
    setPrice('');
    setCurrency('USD');
    setCategory('');
    setAvailableSizes([]);
    setAvailableColors([]);
    setMainImagePreview('');
    setMainImageUrl('');
    setSupportingImages([]);
    setSupportingImagePreviews([]);
    setSupportingImageUrls([]);
    setSelectedProduct(null);
    setIsEditing(false);
    setError('');
    setSuccess('');
    setShowCropModal(false);
    setImageToCrop('');
    setPendingSupportingImageIndex(-1);
  }, [mainImagePreview, supportingImagePreviews, imageToCrop]);

  const filteredColors = useMemo(
    () =>
      PRODUCT_COLORS.filter((color) =>
        color.toLowerCase().includes(colorSearchTerm.toLowerCase()),
      ),
    [colorSearchTerm],
  );

  useEffect(() => {
    if (!showColorDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.color-dropdown-container')) {
        setShowColorDropdown(false);
        setColorSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorDropdown]);

  const handleMainImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should not exceed 10MB');
        return;
      }

      if (imageToCrop) {
        URL.revokeObjectURL(imageToCrop);
      }

      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setCropImageType('main');
      setShowCropModal(true);
      setError('');
      e.target.value = '';
    },
    [imageToCrop],
  );

  const handleMainImageCropComplete = useCallback(
    async (croppedImageBlob: Blob) => {
      try {
        setUploadingImages(true);
        setError('');

        if (mainImagePreview) {
          URL.revokeObjectURL(mainImagePreview);
        }

        const croppedFile = new File([croppedImageBlob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        });

        const previewUrl = URL.createObjectURL(croppedImageBlob);
        setMainImagePreview(previewUrl);
        const result = await uploadFile(croppedFile, 'product-images');
        setMainImageUrl(result.url);
      } catch (err: any) {
        console.error('Error uploading main image:', err);
        setError(`Failed to upload main image: ${err.message}`);
      } finally {
        setUploadingImages(false);
      }
    },
    [mainImagePreview],
  );

  const handleSupportingImagesChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setError('All files must be images');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError('Each image should not exceed 10MB');
          return;
        }
      }

      if (imageToCrop) {
        URL.revokeObjectURL(imageToCrop);
      }

      const firstFile = files[0];
      if (!firstFile) return;
      const imageUrl = URL.createObjectURL(firstFile);
      setImageToCrop(imageUrl);
      setCropImageType('supporting');
      setPendingSupportingImageIndex(supportingImages.length);
      setShowCropModal(true);
      setError('');

      if (files.length > 1) {
        console.log('Multiple files selected, processing first file. Please upload others separately.');
      }

      e.target.value = '';
    },
    [imageToCrop, supportingImages.length],
  );

  const handleSupportingImageCropComplete = useCallback(
    async (croppedImageBlob: Blob) => {
      try {
        setUploadingImages(true);
        setError('');

        const croppedFile = new File([croppedImageBlob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        });

        const previewUrl = URL.createObjectURL(croppedImageBlob);
        const targetIndex = pendingSupportingImageIndex;
        setSupportingImagePreviews((prev) => {
          // Replace existing image at index (revoke old blob preview if any)
          if (targetIndex >= 0 && targetIndex < prev.length) {
            const oldPreview = prev[targetIndex];
            if (oldPreview && oldPreview.startsWith('blob:')) {
              URL.revokeObjectURL(oldPreview);
            }
            const next = [...prev];
            next[targetIndex] = previewUrl;
            return next;
          }
          // Append new supporting image
          return [...prev, previewUrl];
        });
        const result = await uploadFile(croppedFile, 'product-images');
        setSupportingImageUrls((prev) => {
          if (targetIndex >= 0 && targetIndex < prev.length) {
            const next = [...prev];
            next[targetIndex] = result.url;
            return next;
          }
          return [...prev, result.url];
        });
        setSupportingImages((prev) => {
          if (targetIndex >= 0 && targetIndex < prev.length) {
            const next = [...prev];
            next[targetIndex] = croppedFile;
            return next;
          }
          return [...prev, croppedFile];
        });
      } catch (err: any) {
        console.error('Error uploading supporting image:', err);
        setError(`Failed to upload supporting image: ${err.message}`);
      } finally {
        setUploadingImages(false);
      }
    },
    [pendingSupportingImageIndex],
  );

  const handleCropModalClose = useCallback(() => {
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    setShowCropModal(false);
    setImageToCrop('');
    setPendingSupportingImageIndex(-1);
  }, [imageToCrop]);

  const handleCropComplete = useCallback(
    async (croppedImageBlob: Blob) => {
      if (cropImageType === 'main') {
        await handleMainImageCropComplete(croppedImageBlob);
      } else {
        await handleSupportingImageCropComplete(croppedImageBlob);
      }
      handleCropModalClose();
    },
    [cropImageType, handleMainImageCropComplete, handleSupportingImageCropComplete, handleCropModalClose],
  );

  const removeSupportingImage = useCallback((index: number) => {
    const previewToRemove = supportingImagePreviews[index];
    if (previewToRemove && previewToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove);
    }

    setSupportingImages((prev) => prev.filter((_, i) => i !== index));
    setSupportingImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSupportingImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, [supportingImagePreviews]);

  const addSize = useCallback(() => {
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setAvailableSizes((prev) => [...prev, selectedSize]);
      setSelectedSize('');
    }
  }, [selectedSize, availableSizes]);

  const removeSize = useCallback((size: string) => {
    setAvailableSizes((prev) => prev.filter((s) => s !== size));
  }, []);

  const addColor = useCallback(() => {
    if (selectedColor) {
      const hexCode = COLOR_MAP[selectedColor as keyof typeof COLOR_MAP];
      if (hexCode && !availableColors.includes(hexCode)) {
        setAvailableColors((prev) => [...prev, hexCode]);
        setSelectedColor('');
      }
    }
  }, [selectedColor, availableColors]);

  const removeColor = useCallback((hexCode: string) => {
    setAvailableColors((prev) => prev.filter((c) => c !== hexCode));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!description.trim()) {
      setError('Product description is required');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Valid price is required');
      return;
    }
    if (!category.trim()) {
      setError('Product category is required');
      return;
    }
    if (!mainImageUrl) {
      setError('Main image is required');
      return;
    }
    if (availableSizes.length === 0) {
      setError('At least one size is required');
      return;
    }
    if (availableColors.length === 0) {
      setError('At least one color is required');
      return;
    }

    try {
      setLoading(true);

      const productData = {
        description: description.trim(),
        amount: parseFloat(price),
        currency,
        category: category.trim(),
        main_image_url: mainImageUrl,
        images: supportingImageUrls,
        available_sizes: availableSizes,
        available_colors: availableColors,
      };

      if (isEditing && selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        setSuccess('Product updated successfully!');
        await loadProducts();
        setTimeout(() => {
          resetForm();
          setActiveTab('edit');
        }, 2000);
      } else {
        await createProduct(productData);
        setSuccess('Product added successfully!');
        setTimeout(() => {
          router.push('/products');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(`Failed to ${isEditing ? 'update' : 'create'} product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="text-lg">Loading...</div>
          <div className="text-gray-500 text-sm">
            Checking authentication status...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (userProfile !== null && !userProfile?.admin) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-gray-500 text-sm">
            User Profile: {userProfile ? 'Loaded' : 'Not Loaded'} | Admin:{' '}
            {userProfile?.admin ? 'Yes' : 'No'}
          </p>
          <div className="text-gray-400 text-xs">
            Debug: Auth Loading: {authLoading ? 'Yes' : 'No'} | User:{' '}
            {user ? 'Yes' : 'No'} | Profile:{' '}
            {userProfile ? 'Loaded' : 'Not Loaded'} | Admin:{' '}
            {userProfile?.admin ? 'Yes' : 'No'}
          </div>
          <ButtonPrimary onClick={() => router.push('/')}>
            Go Home
          </ButtonPrimary>
        </div>
      </div>
    );
  }

  if (userProfile === null) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="text-lg">Loading...</div>
          <div className="text-gray-500 text-sm">Loading user profile...</div>
          <div className="text-gray-400 text-xs">
            Debug: Auth Loading: {authLoading ? 'Yes' : 'No'} | User:{' '}
            {user ? 'Yes' : 'No'} | Profile:{' '}
            {userProfile === null ? 'Loading' : 'Loaded'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-semibold lg:text-4xl">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>

        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('add');
                resetForm();
              }}
              className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                activeTab === 'add'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Add Product
            </button>
            <button
              onClick={() => {
                setActiveTab('edit');
                resetForm();
              }}
              className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                activeTab === 'edit'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Edit Product
            </button>
          </nav>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {activeTab === 'edit' && !isEditing && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Select Product to Edit</h2>
            {loadingProducts ? (
              <div className="text-center py-8">
                <div className="text-lg">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-500">No products found</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group relative rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary hover:bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(product.id, product.description || 'Product');
                      }}
                      className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                      title="Delete product"
                    >
                      <FiTrash2 size={16} />
                    </button>

                    <div
                      onClick={() => handleProductSelect(product)}
                      className="cursor-pointer"
                    >
                      <div className="mb-3">
                        <img
                          src={product.main_image_url || '/preview.jpg'}
                          alt={product.description}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                      </div>
                      <h3 className="mb-2 font-medium text-gray-900">
                        {product.description?.substring(0, 50)}
                        {product.description?.length > 50 ? '...' : ''}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <div>Category: {product.category}</div>
                        <div>Price: {product.currency} {product.amount}</div>
                        <div className="mt-2 flex items-center gap-1">
                          <FiEdit className="text-primary" size={16} />
                          <span className="text-primary">Click to edit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === 'add' || isEditing) && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormItem label="Category *">
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              className="border-neutral-300 bg-transparent"
              required
            />
          </FormItem>

          <FormItem label="Description *">
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className="border-neutral-300 bg-transparent"
              required
            />
          </FormItem>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormItem label="Price *">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="border-neutral-300 bg-transparent"
                required
              />
            </FormItem>

            <FormItem label="Currency *">
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border-neutral-300 bg-transparent"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </Select>
            </FormItem>
          </div>

          <FormItem label="Main Product Image *">
            <div className="space-y-4">
              <div className="flex w-full items-center justify-center">
                <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 transition-colors hover:bg-neutral-50">
                  {mainImagePreview ? (
                    <div className="relative size-full">
                      <img
                        src={mainImagePreview}
                        alt="Main product"
                        className="size-full rounded-lg object-contain"
                      />
                      <div className="absolute right-2 top-2 rounded bg-black bg-opacity-50 px-3 py-1 text-xs text-white">
                        {mainImageUrl ? 'Uploaded ✓' : 'Uploading...'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <FiUpload className="mb-3 size-10 text-neutral-400" />
                      <p className="mb-2 text-sm text-neutral-500">
                        <span className="font-semibold">Click to upload</span>{' '}
                        main image
                      </p>
                      <p className="text-xs text-neutral-400">
                        PNG, JPG, WEBP (MAX. 10MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                </label>
              </div>
            </div>
          </FormItem>

          <FormItem label="Supporting Images (Optional)">
            <div className="space-y-4">
              <div className="flex w-full items-center justify-center">
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 transition-colors hover:bg-neutral-50">
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload className="mb-2 size-8 text-neutral-400" />
                    <p className="text-sm text-neutral-500">
                      <span className="font-semibold">Click to upload</span>{' '}
                      additional images
                    </p>
                    <p className="text-xs text-neutral-400">
                      Multiple images allowed
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleSupportingImagesChange}
                  />
                </label>
              </div>

              {supportingImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {supportingImagePreviews.map((preview, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={preview}
                        alt={`Supporting ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeSupportingImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <FiX size={16} />
                      </button>
                      {supportingImageUrls[index] && (
                        <div className="absolute bottom-2 left-2 rounded bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
                          Uploaded ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormItem>

          <FormItem label="Available Sizes *">
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Select sizes from the dropdown and click "Add Size" to add them
                to your product.
              </p>
              <div className="flex gap-2">
                <Select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="flex-1 border-neutral-300 bg-transparent"
                >
                  <option value="">Select a size</option>
                  {PRODUCT_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Select>
                <ButtonPrimary
                  type="button"
                  onClick={addSize}
                  className="whitespace-nowrap"
                  disabled={!selectedSize}
                >
                  Add Size
                </ButtonPrimary>
              </div>
              {availableSizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-white"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="hover:text-red-200"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FormItem>

          <FormItem label="Available Colors *">
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Select colors from the dropdown (with visual previews) and click
                "Add Color" to add them to your product. You can search for
                specific colors.
              </p>
              <div className="flex gap-2">
                <div className="color-dropdown-container relative flex-1">
                  <button
                    type="button"
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {selectedColor
                      ? renderColorSwatch(selectedColor, 'small')
                      : 'Select a color'}
                  </button>

                  {showColorDropdown && (
                    <div className="border-gray-300 absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                      <div className="border-b p-2">
                        <input
                          type="text"
                          placeholder="Search colors..."
                          value={colorSearchTerm}
                          onChange={(e) => setColorSearchTerm(e.target.value)}
                          className="border-gray-200 w-full rounded border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className="max-h-48 overflow-auto">
                        {filteredColors.length > 0 ? (
                          filteredColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                setSelectedColor(color);
                                setShowColorDropdown(false);
                                setColorSearchTerm('');
                              }}
                              className="hover:bg-gray-100 focus:bg-gray-100 w-full px-3 py-2 text-left text-sm focus:outline-none"
                            >
                              {renderColorSwatch(color, 'small')}
                            </button>
                          ))
                        ) : (
                          <div className="text-gray-500 px-3 py-2 text-sm">
                            No colors found matching "{colorSearchTerm}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <ButtonPrimary
                  type="button"
                  onClick={addColor}
                  className="whitespace-nowrap"
                  disabled={!selectedColor}
                >
                  Add Color
                </ButtonPrimary>
              </div>
              {availableColors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((hexCode) => (
                    <span
                      key={hexCode}
                      className="bg-gray-100 text-gray-800 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                    >
                      {renderColorSwatchFromHex(hexCode, 'small')}
                      <button
                        type="button"
                        onClick={() => removeColor(hexCode)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FormItem>

          <div className="flex gap-4 pt-4">
            <ButtonPrimary
              type="submit"
              disabled={loading || uploadingImages}
              className="flex-1"
            >
              {loading
                ? (isEditing ? 'Updating Product...' : 'Creating Product...')
                : uploadingImages
                  ? 'Uploading Images...'
                  : (isEditing ? 'Update Product Details' : 'Create Product')}
            </ButtonPrimary>
            {isEditing ? (
              <ButtonPrimary
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab('edit');
                }}
                className="bg-neutral-500 hover:bg-neutral-600"
              >
                Back to Product List
              </ButtonPrimary>
            ) : (
              <ButtonPrimary
                type="button"
                onClick={() => router.push('/products')}
                className="bg-neutral-500 hover:bg-neutral-600"
              >
                Cancel
              </ButtonPrimary>
            )}
          </div>
        </form>
        )}

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={deleting}
        />

        <ImageCropModal
          isOpen={showCropModal}
          onClose={handleCropModalClose}
          onCropComplete={handleCropComplete}
          imageSrc={imageToCrop}
          aspectRatio={1}
          title={cropImageType === 'main' ? 'Crop Main Product Image' : 'Crop Supporting Image'}
        />
      </div>
    </div>
  );
};

export default AddCollectionPage;
