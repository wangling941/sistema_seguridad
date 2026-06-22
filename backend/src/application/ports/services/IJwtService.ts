export interface IJwtService {
  sign(payload: object): string;
  verify(token: string): any;
}
