export interface AuthResponseDto {
  token: string;
  user: {
    id: number;
    username: string;
  };
}
