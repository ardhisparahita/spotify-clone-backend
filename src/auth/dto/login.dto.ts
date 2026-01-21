import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
