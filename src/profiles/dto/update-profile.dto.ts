import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  full_name?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Avatar harus berupa URL valid' })
  avatar_url?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  country?: string;

  @IsDateString()
  @IsOptional()
  birth_date?: string;
}
