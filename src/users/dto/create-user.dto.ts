import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../enum/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsEnum(Role, { message: 'Role harus berupa ADMIN atau USER' })
  @IsNotEmpty({ message: 'Role wajib ditentukan' })
  role: Role;
}
