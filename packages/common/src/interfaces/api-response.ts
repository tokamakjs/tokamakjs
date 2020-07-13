export interface ApiResponse<T> {
  response: Response;
  data: T;
}
