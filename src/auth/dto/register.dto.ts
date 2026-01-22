import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password terlalu lemah: harus mengandung minimal 1 huruf kapital dan 1 angka',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  full_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  country?: string;

  @IsDateString(
    {},
    { message: 'Format tanggal lahir tidak valid (YYYY-MM-DD)' },
  )
  @IsOptional()
  birth_date?: string;
}
