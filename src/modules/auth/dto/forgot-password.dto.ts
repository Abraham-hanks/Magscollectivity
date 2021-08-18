import { IsNumberString, IsOptional, IsPositive, IsString, Matches, MinLength } from "class-validator";

export class ForgotPasswordDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  callback_url: string;
}

export class ResetPasswordDto {
  @IsPositive()
  id: number;

  @IsNumberString()
  token: string;

  @MinLength(7)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{7,64}$/gm, {
    message:
      'Password must be between 7 and 64 characters long with at least 1 special character, number and capital letter',
  })
  password: string;

  @IsOptional()
  @MinLength(7)
  confirm_password?: string;
}
