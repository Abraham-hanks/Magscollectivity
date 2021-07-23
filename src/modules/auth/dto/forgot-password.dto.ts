import { IsNumberString, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

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

  @MinLength(6)
  @IsString()
  password: string;

  @IsOptional()
  @MinLength(6)
  @IsString()
  confirm_password?: string;
}