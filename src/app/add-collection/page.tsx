'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiUpload, FiX } from 'react-icons/fi';

import { COLOR_MAP, PRODUCT_COLORS, PRODUCT_SIZES } from '@/constants';
import { useAuthApi } from '@/hooks/useAuthApi';
import { createProduct, deleteProduct, getProducts, updateProduct, uploadFile } from '@/lib/api-client';
import { ConfirmationModal } from '@/shared/Modal';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
import Select from '@/shared/Select/Select';
import TextArea from '@/shared/TextArea/TextArea';

const AddCollectionPage = () => {
  const router = useRouter();
  const { userProfile, loading: authLoading, user } = useAuthApi();

  // Tab state
  const [activeTab, setActiveTab] = useState<'add' | 'edit'>('add');
  
  // Product list state
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  // Image state
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [mainImageUrl, setMainImageUrl] = useState<string>('');
  const [supportingImages, setSupportingImages] = useState<File[]>([]);
  const [supportingImagePreviews, setSupportingImagePreviews] = useState<
    string[]
  >([]);
  const [supportingImageUrls, setSupportingImageUrls] = useState<string[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    description: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Size and color dropdown selections
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [colorSearchTerm, setColorSearchTerm] = useState('');

  // Helper function to render color swatch
  const renderColorSwatch = (
    colorName: string,
    size: 'small' | 'medium' = 'medium',
  ) => {
    const colorValue =
      COLOR_MAP[colorName as keyof typeof COLOR_MAP] || '#CCCCCC'; // Fallback to gray if color not found
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
  };

  // Helper function to render color swatch from hex code
  const renderColorSwatchFromHex = (
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
  };

  // Check if user is admin
  useEffect(() => {
    // Only redirect if auth is loaded and user is not admin
    // Don't redirect if userProfile is still loading (null/undefined)
    if (!authLoading && userProfile !== null && !userProfile?.admin) {
      router.push('/');
    }
  }, [authLoading, userProfile, router]);

  // Load products when edit tab is active
  useEffect(() => {
    if (activeTab === 'edit' && products.length === 0) {
      loadProducts();
    }
  }, [activeTab]);

  // Load products from API
  const loadProducts = async () => {
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
  };

  // Handle product selection for editing
  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setIsEditing(true);
    
    // Pre-fill form with product data
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
    
    // Clear any existing errors
    setError('');
    setSuccess('');
  };

  // Handle delete button click - show modal
  const handleDeleteClick = (productId: string, productDescription: string) => {
    setProductToDelete({ id: productId, description: productDescription });
    setShowDeleteModal(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      setError('');
      
      await deleteProduct(productToDelete.id);
      setSuccess('Product deleted successfully!');
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Refresh products list
      await loadProducts();
      
      // Clear success message after 3 seconds
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

  // Handle modal close
  const handleCloseDeleteModal = () => {
    if (!deleting) {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Reset form to add new product
  const resetForm = () => {
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
  };

  // Filter colors based on search term
  const filteredColors = PRODUCT_COLORS.filter((color) =>
    color.toLowerCase().includes(colorSearchTerm.toLowerCase()),
  );

  // Close color dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showColorDropdown && !target.closest('.color-dropdown-container')) {
        setShowColorDropdown(false);
        setColorSearchTerm(''); // Clear search when closing
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorDropdown]);

  // Handle main image selection and upload
  const handleMainImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should not exceed 10MB');
      return;
    }

    setMainImagePreview(URL.createObjectURL(file));
    setError('');

    // Upload immediately
    await uploadMainImage(file);
  };

  // Upload main image to Supabase storage
  const uploadMainImage = async (file: File) => {
    try {
      setUploadingImages(true);

      const result = await uploadFile(file, 'product-images');
      setMainImageUrl(result.url);
    } catch (err: any) {
      console.error('Error uploading main image:', err);
      setError(`Failed to upload main image: ${err.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle supporting images selection and upload
  const handleSupportingImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
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

    setSupportingImages([...supportingImages, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setSupportingImagePreviews([...supportingImagePreviews, ...previews]);
    setError('');

    // Upload immediately
    await uploadSupportingImages(files);
  };

  // Upload supporting images to Supabase storage
  const uploadSupportingImages = async (files: File[]) => {
    try {
      setUploadingImages(true);
      const uploadPromises = files.map(async (file) => {
        const result = await uploadFile(file, 'product-images');
        return result.url;
      });

      const urls = await Promise.all(uploadPromises);
      setSupportingImageUrls([...supportingImageUrls, ...urls]);
    } catch (err: any) {
      console.error('Error uploading supporting images:', err);
      setError(`Failed to upload supporting images: ${err.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove supporting image
  const removeSupportingImage = (index: number) => {
    const newImages = supportingImages.filter((_, i) => i !== index);
    const newPreviews = supportingImagePreviews.filter((_, i) => i !== index);
    const newUrls = supportingImageUrls.filter((_, i) => i !== index);

    setSupportingImages(newImages);
    setSupportingImagePreviews(newPreviews);
    setSupportingImageUrls(newUrls);
  };

  // Add size from dropdown
  const addSize = () => {
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setAvailableSizes([...availableSizes, selectedSize]);
      setSelectedSize(''); // Reset dropdown selection
    }
  };

  // Remove size
  const removeSize = (size: string) => {
    setAvailableSizes(availableSizes.filter((s) => s !== size));
  };

  // Add color from dropdown (store hex code, display name)
  const addColor = () => {
    if (selectedColor) {
      const hexCode = COLOR_MAP[selectedColor as keyof typeof COLOR_MAP];
      if (hexCode && !availableColors.includes(hexCode)) {
        setAvailableColors([...availableColors, hexCode]);
        setSelectedColor(''); // Reset dropdown selection
      }
    }
  };

  // Remove color
  const removeColor = (hexCode: string) => {
    setAvailableColors(availableColors.filter((c) => c !== hexCode));
  };

  // Helper function to get color name from hex code
  const getColorNameFromHex = (hexCode: string): string => {
    const colorEntry = Object.entries(COLOR_MAP).find(
      ([_, hex]) => hex === hexCode,
    );
    return colorEntry ? colorEntry[0] : 'Unknown Color';
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
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

      // Insert product into database
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
        // Update existing product
        await updateProduct(selectedProduct.id, productData);
        setSuccess('Product updated successfully!');
        
        // Refresh products list
        await loadProducts();
        
        // Reset form after a delay
        setTimeout(() => {
          resetForm();
          setActiveTab('edit');
        }, 2000);
      } else {
        // Create new product
        await createProduct(productData);
        setSuccess('Product added successfully!');

        // Reset form
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

  // If not logged in, redirect to login
  if (!user) {
    router.push('/login');
    return null;
  }

  // If profile is loaded but user is not admin, show access denied
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

  // If profile is still loading, show loading state
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

        {/* Tab Navigation */}
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

        {/* Product List for Edit Tab */}
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
                    {/* Delete Button */}
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

                    {/* Product Card Content */}
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

        {/* Form */}
        {(activeTab === 'add' || isEditing) && (

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
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

          {/* Description */}
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

          {/* Price and Currency */}
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

          {/* Main Image */}
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

          {/* Supporting Images */}
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

          {/* Available Sizes */}
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

          {/* Available Colors */}
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
                      {/* Search input */}
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

                      {/* Color options */}
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

          {/* Submit Button */}
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

        {/* Delete Confirmation Modal */}
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
      </div>
    </div>
  );
};

export default AddCollectionPage;
