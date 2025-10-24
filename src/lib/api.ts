// Comprehensive API Client using axios - Single source of truth for all API calls
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8086';

// DTOs
export interface CategoryDTO {
  categoryId: number;
  name: string;
}

export interface MetalDTO {
  metalId: number;
  metalType: string;
  metalPurity: string;
}

export interface GemDTO {
  gemId: number;
  name: string;
  price: number;
  imageFileName?: string;
  imageContentType?: string;
  imageFileSize?: number;
  imageUrl?: string;
}

export interface ProductImageDTO {
  imageId: number;
  fileName: string;
  contentType: string;
  fileSize: number;
  data?: number[];
  imageUrl: string; // This is the ready-to-use base64 data URL from backend
}

export interface ProductDTO {
  productId: number;
  name: string;
  size?: string;
  weight: number;
  hasGemstone: boolean;
  initialProductionCost: number;
  quantity: number;
  productDescription: string;
  category: CategoryDTO;
  metal: MetalDTO;
  gems: GemDTO[];
  images: ProductImageDTO[];
}

export interface ProductSearchRequest {
  searchTerm?: string;
  categoryIds?: number[];
  metalIds?: number[];
  gemIds?: number[];
  hasGemstone?: boolean;
  minWeight?: number;
  maxWeight?: number;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Role DTOs
export interface RoleDTO {
  roleId: number;
  roleName: string;
}

// User DTOs
export interface UserDTO {
  userId: number;
  userFname: string;
  userLname: string;
  email: string;
  role: RoleDTO;
  createdDate: string;
  updatedDate: string;
}

export interface LoginRequest {
  email: string;
  passwordHash: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

// Review DTOs
export interface PublicReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CustomerReviewRequest {
  authorName: string;
  rating: number;
  comment: string;
}

export interface CustomerReview {
  id: number;
  authorName: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  moderationNote?: string;
  deletedAt?: string;
}

// Branch DTOs
export interface Branch {
  branchId: number;
  branchName: string;
  branchCode: string;
  branchAddress: string;
  branchTelephone: string;
  branchHours: string;
}

// Comprehensive API Client
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load auth token from localStorage on initialization
    const savedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (savedToken) {
      this.authToken = savedToken;
    }

    // Request interceptor to add auth token
  this.axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Try to get token from instance variable first, then localStorage
    const token = this.authToken || localStorage.getItem('token') || localStorage.getItem('authToken');
    if (typeof token === 'string' && token.trim() !== '') {
        config.headers.Authorization = `Bearer ${token.trim()}`;
    }
      return config;  
    },
    (error: any) => Promise.reject(error)
  );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token); // Keep both for compatibility
  }

  clearAuthToken() {
    this.authToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
  }

  getAuthToken(): string | null {
    return this.authToken || localStorage.getItem('token') || localStorage.getItem('authToken');
  }

  // User authentication
  async login(credentials: LoginRequest): Promise<string> {
    const response: AxiosResponse<string> = await this.axiosInstance.post('/auth/login', credentials);
    const token = response.data;
    this.setAuthToken(token);
    return token;
  }

  async register(userData: RegisterRequest): Promise<UserDTO> {
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<UserDTO> {
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.get('/auth/me');
    return response.data;
  }

  // Role management
  async getRoles(): Promise<RoleDTO[]> {
    // Try different possible endpoint names
    try {
      const response: AxiosResponse<RoleDTO[]> = await this.axiosInstance.get('/auth/get-role');
      return response.data;
    } catch (error) {
      // Fallback to alternative endpoint
      try {
        const response: AxiosResponse<RoleDTO[]> = await this.axiosInstance.get('/auth/get-role');
        return response.data;
      } catch (fallbackError) {
        throw error; // Throw original error
      }
    }
  }

  // Categories
  /*async getCategories(): Promise<CategoryDTO[]> {
    const response: AxiosResponse<CategoryDTO[]> = await this.axiosInstance.get('/api/categories');
    return response.data;
  }

  async createCategory(name: string): Promise<CategoryDTO> {
    const response: AxiosResponse<CategoryDTO> = await this.axiosInstance.post('/api/categories', { name });
    return response.data;
  }*/

  // Users (Admin only)
  async getUsers(): Promise<UserDTO[]> {
    const response: AxiosResponse<UserDTO[]> = await this.axiosInstance.get('/auth/get-users');
    return response.data;
  }

  async getUserById(id: number): Promise<UserDTO[]> {
    const response: AxiosResponse<UserDTO[]> = await this.axiosInstance.get(`/auth/get-users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<UserDTO>): Promise<UserDTO> {
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.put(`/auth/update-user/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<string> {
    const response: AxiosResponse<string> = await this.axiosInstance.delete(`/auth/delete-user/${id}`);
    return response.data;
  }

  // Reviews
  async getPublicReviews(): Promise<PublicReview[]> {
    const response: AxiosResponse<PublicReview[]> = await this.axiosInstance.get('/api/reviews/public');
    return response.data;
  }

  async submitReview(review: CustomerReviewRequest): Promise<number> {
    const response: AxiosResponse<number> = await this.axiosInstance.post('/api/reviews/addReview', review);
    return response.data;
  }

  async getPendingReviews(): Promise<CustomerReview[]> {
    const response: AxiosResponse<CustomerReview[]> = await this.axiosInstance.get('/api/reviews/pending');
    return response.data;
  }

  async approveReview(id: number, note?: string): Promise<CustomerReview> {
    const url = `/api/reviews/${id}/approve${note ? `?note=${encodeURIComponent(note)}` : ''}`;
    const response: AxiosResponse<CustomerReview> = await this.axiosInstance.put(url, {});
    return response.data;
  }

  async rejectReview(id: number, note?: string): Promise<CustomerReview> {
    const url = `/api/reviews/${id}/reject${note ? `?note=${encodeURIComponent(note)}` : ''}`;
    const response: AxiosResponse<CustomerReview> = await this.axiosInstance.put(url, {});
    return response.data;
  }

  async deleteReview(id: number): Promise<void> {
    await this.axiosInstance.delete(`/api/reviews/${id}`);
  }

  //minsara
    // Products
    // Products
  async getProducts(): Promise<ProductDTO[]> {
    const response: AxiosResponse<ProductDTO[]> = await this.axiosInstance.get('/api/products');
    return response.data;
  }

  async getProduct(id: number): Promise<ProductDTO> {
    const response: AxiosResponse<ProductDTO> = await this.axiosInstance.get(`/api/products/${id}`);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.axiosInstance.delete(`/api/products/${id}`);
  }

  async createProduct(formData: FormData): Promise<ProductDTO> {
    const response: AxiosResponse<ProductDTO> = await this.axiosInstance.post(
      '/api/products',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }

  async updateProduct(id: number, formData: FormData): Promise<ProductDTO> {
    const response: AxiosResponse<ProductDTO> = await this.axiosInstance.put(
      `/api/products/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }

  async searchProducts(searchRequest: ProductSearchRequest): Promise<PagedResponse<ProductDTO>> {
    const response: AxiosResponse<PagedResponse<ProductDTO>> = await this.axiosInstance.post(
      '/api/products/search',
      searchRequest
    );
    return response.data;
  }


  // Categories
  // Categories
  async getCategories(): Promise<CategoryDTO[]> {
    const response = await this.axiosInstance.get('/api/categories');
    return response.data;
  }

  async getCategory(name: string): Promise<CategoryDTO> {
    const response = await this.axiosInstance.get(`/api/categories/${encodeURIComponent(name)}`);
    return response.data;
  }

  async createCategory(name: string): Promise<CategoryDTO> {
    const response = await this.axiosInstance.post('/api/categories', { name });
    return response.data;
  }

  async updateCategory(id: number, name: string): Promise<CategoryDTO> {
    const response = await this.axiosInstance.put(`/api/categories/${id}`, { name });
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.axiosInstance.delete(`/api/categories/${id}`);
  }


  // Metals
  async getMetals(): Promise<MetalDTO[]> {
    const response = await this.axiosInstance.get('/api/metals');
    return response.data;
  }

  async createMetal(metalType: string, metalPurity: string): Promise<MetalDTO> {
    const response = await this.axiosInstance.post('/api/metals', { metalType, metalPurity });
    return response.data;
  }

  async updateMetal(id: number, metalType: string, metalPurity: string): Promise<MetalDTO> {
    const response = await this.axiosInstance.put(`/api/metals/${id}`, { metalType, metalPurity });
    return response.data;
  }

  async deleteMetal(id: number): Promise<void> {
    await this.axiosInstance.delete(`/api/metals/${id}`);
  }

  // Gems
  async getGems(): Promise<GemDTO[]> {
    const response = await this.axiosInstance.get('/api/gems');
    return response.data;
  }

  async deleteGem(id: number): Promise<void> {
    await this.axiosInstance.delete(`/api/gems/${id}`);
  }

  async createGem(formData: FormData): Promise<GemDTO> {
    const response: AxiosResponse<GemDTO> = await this.axiosInstance.post(
      '/api/gems',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }

  async updateGem(id: number, formData: FormData): Promise<GemDTO> {
    const response: AxiosResponse<GemDTO> = await this.axiosInstance.put(
      `/api/gems/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }

  // Metals (mock implementation until backend implements)
  /*async getMetals(): Promise<MetalDTO[]> {
    return [
      { id: 1, metalType: 'GOLD', metalPurity: '18K' },
      { id: 2, metalType: 'SILVER', metalPurity: '925' },
      { id: 3, metalType: 'PLATINUM', metalPurity: '950' }
    ];
  }

  async createMetal(metalType: string, metalPurity: string): Promise<MetalDTO> {
    return { id: Date.now(), metalType: metalType as any, metalPurity };
  }

  async updateMetal(id: number, metalType: string, metalPurity: string): Promise<MetalDTO> {
    return { id, metalType: metalType as any, metalPurity };
  }

  async deleteMetal(id: number): Promise<void> {
    console.log(`Mock delete metal ${id}`);
  }

  // Gems (mock implementation until backend implements)
  async getGems(): Promise<GemDTO[]> {
    return [
      { id: 1, name: 'Diamond', price: 50000 },
      { id: 2, name: 'Ruby', price: 25000 },
      { id: 3, name: 'Emerald', price: 30000 }
    ];
  }*/

  // Branches - Real API implementation
  async getAllBranches(): Promise<Branch[]> {
    const response: AxiosResponse<Branch[]> = await this.axiosInstance.get('/api/branches/allBranches');
    return response.data;
  }

  async getBranchByName(branchName: string): Promise<Branch> {
    const response: AxiosResponse<Branch> = await this.axiosInstance.get(`/api/branches/searchByName/${encodeURIComponent(branchName)}`);
    return response.data;
  }

  async addBranch(branch: Omit<Branch, 'branchId'>): Promise<Branch> {
    // Make sure to use relative URL (interceptor will attach token)
    const response: AxiosResponse<Branch> = await this.axiosInstance.post(
      '/api/branches/addBranch',
      branch
    );
    return response.data;
  }

  async updateBranch(branchCode: string, branch: Omit<Branch, 'branchId'>): Promise<Branch> {
    const response: AxiosResponse<Branch> = await this.axiosInstance.put(`/api/branches/updateBranch/${encodeURIComponent(branchCode)}`, branch);
    return response.data;
  }

  async deleteBranch(branchCode: string): Promise<string> {
    const response: AxiosResponse<string> = await this.axiosInstance.delete(`/api/branches/deleteBranch/${encodeURIComponent(branchCode)}`);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();