export interface ApiResponse<T = unknown> {
  message: string;
  [key: string]: T | string;
}
