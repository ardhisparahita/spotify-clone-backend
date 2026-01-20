import {
  Controller,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() registerDto: RegisterDto) 
    return this.authService.create(RegisterDto);
  }



}
