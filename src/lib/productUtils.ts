import { ProductDTO } from './api';

// Utility function to filter product data based on user role
export const filterProductForPublicDisplay = (product: ProductDTO): ProductDTO => {
  return {
    ...product,
    // Hide sensitive information from general users
    productId: 0, // Hide product ID
    initialProductionCost: 0, // Hide production cost
    quantity: 0, // Hide quantity
    size: undefined, // Hide size
    weight: 0, // Hide weight
    gems: product.gems.map(gem => ({
      ...gem,
      gemId: 0, // Hide gem IDs
      price: 0, // Hide gem prices
    })),
  };
};

// Utility function to check if user is admin
export const isAdminUser = (): boolean => {
  // Check if user is logged in and has admin role
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  if (!token) return false;
  
  try {
    // Decode JWT token to check user role
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'ADMIN' || payload.roleName === 'ADMIN';
  } catch (error) {
    console.warn('Error decoding token:', error);
    return false;
  }
};

// Utility function to get filtered product data based on user role
export const getFilteredProduct = (product: ProductDTO): ProductDTO => {
  if (isAdminUser()) {
    // Show all data to admin users
    return product;
  } else {
    // Filter sensitive data for general users
    return filterProductForPublicDisplay(product);
  }
};

// Utility function to format price for display (only show to admins)
export const formatPriceForDisplay = (product: ProductDTO): string | null => {
  if (isAdminUser() && product.initialProductionCost > 0) {
    return `LKR ${product.initialProductionCost.toFixed(2)}`;
  }
  return null;
};

// Utility function to format product ID for display (only show to admins)
export const formatProductIdForDisplay = (product: ProductDTO): string | null => {
  if (isAdminUser() && product.productId > 0) {
    return `ID: ${product.productId}`;
  }
  return null;
};

