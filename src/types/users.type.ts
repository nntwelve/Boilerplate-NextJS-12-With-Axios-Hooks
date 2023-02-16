export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserGetParams {
  keyword?: string;
  per_page?: number;
  page?: number;
}
