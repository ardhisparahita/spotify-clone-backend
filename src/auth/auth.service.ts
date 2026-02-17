import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthSuccessResponse } from './interface/auth-response.interface';
import { Role } from 'src/users/enum/role.enum';
import { UserPayload } from './interface/authenticated-request.interface';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSuccessResponse> {
    const { email, username, password, full_name, country, birth_date } = dto;

    const [existingEmail, existingUsername] = await Promise.all([
      this.usersService.findByEmail(email),
      this.usersService.findByUsername(username),
    ]);

    if (existingEmail) throw new ConflictException('Email already exists');
    if (existingUsername)
      throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const count = await this.usersService.countUsers();
    const role = count === 0 ? Role.ADMIN : Role.USER;

    const newUser = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await this.profilesService.create({
      user_id: newUser.id,
      full_name,
      country,
      birth_date,
    });

    const payload: UserPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'User registered and logged in successfully',
      access_token: token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthSuccessResponse> {
    const { usernameOrEmail, password } = dto;

    const user = await this.usersService.findByLoginTerm(usernameOrEmail);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Username atau password salah');
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
