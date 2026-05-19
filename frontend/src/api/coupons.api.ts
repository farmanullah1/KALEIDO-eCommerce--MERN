import API from './axios';

export const validateCoupon = async (code: string, cartTotal: number) => {
  const response = await API.post('/coupons/validate', { code, cartTotal });
  return response.data;
};

export const createCoupon = async (couponData: any) => {
  const response = await API.post('/coupons', couponData);
  return response.data;
};

export const getAllCoupons = async () => {
  const response = await API.get('/coupons');
  return response.data;
};
