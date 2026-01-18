// Helper function to get access token from localStorage
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('supabase_access_token');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.expires_at && parsed.expires_at > Date.now()) {
        return parsed.access_token;
      }
    } catch {
      localStorage.removeItem('supabase_access_token');
    }
  }

  return null;
}

// Helper function to make authenticated API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API call failed');
  }

  return response.json();
}

// Helper function to upload files
export async function uploadFile(
  file: File,
  bucket: string = 'product-images',
) {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
}

// Helper function to get products
export async function getProducts(
  limit?: number,
  offset?: number,
  category?: string,
) {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());
  if (category) params.append('category', category);

  const queryString = params.toString();
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;

  return apiCall(endpoint);
}

// Helper function to get a single product
export async function getProduct(id: string) {
  return apiCall(`/api/products/${id}`);
}

// Helper function to create a product
export async function createProduct(productData: any) {
  return apiCall('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

// Helper function to update a product
export async function updateProduct(id: string, updates: any) {
  return apiCall(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// Helper function to delete a product
export async function deleteProduct(id: string) {
  return apiCall(`/api/products/${id}`, {
    method: 'DELETE',
  });
}

// Helper function to get user profile
export async function getUserProfile() {
  return apiCall('/api/user/profile');
}

// Helper function to update user profile
export async function updateUserProfile(updates: any) {
  return apiCall('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}
