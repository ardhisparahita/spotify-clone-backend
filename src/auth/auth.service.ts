import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import {
  AuthResponse,
  LoginResponse,
} from './interface/auth-response.interface';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/users/enum/role.enum';
import { LoginDto } from './dto/login.dto';
import { UserPayload } from './interface/authenticated-request.interface';
const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { email, username, password } = dto;

    const [existingEmail, existingUsername] = await Promise.all([
      this.usersService.findByEmail(email),
      this.usersService.findByUsername(username),
    ]);

    if (existingEmail) throw new ConflictException('Email already exists');
    if (existingUsername)
      throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const isFirstUser = await this.usersService.countUsers();
    const role = isFirstUser ? Role.ADMIN : Role.USER;

    const newUser = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const { usernameOrEmail, password } = dto;

    const user = await this.usersService.findByLoginTerm(usernameOrEmail);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login success',
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
