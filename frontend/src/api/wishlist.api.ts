import API from './axios';

export const getWishlist = async () => {
  const response = await API.get('/wishlist');
  return response.data;
};

export const toggleWishlist = async (productId: string) => {
  const response = await API.post('/wishlist/toggle', { productId });
  return response.data;
};
