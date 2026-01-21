import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  AuthResponse,
  LoginResponse,
} from './interface/auth-response.interface';
import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }
}
