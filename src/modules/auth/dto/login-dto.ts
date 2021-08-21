import { MinLength } from 'class-validator';

export class LoginDto {
  @MinLength(2)
  username: string;

  @MinLength(7)
  password: string;
}
