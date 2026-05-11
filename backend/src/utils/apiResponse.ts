export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export const successResponse = <T>(data: T, message: string = 'Success'): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, error: any = null): ApiResponse => ({
  success: false,
  message,
  error,
});
