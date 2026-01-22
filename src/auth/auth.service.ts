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

  // src/auth/auth.service.ts

  async register(dto: RegisterDto): Promise<AuthSuccessResponse> {
    // Ubah return type
    const { email, username, password, full_name, country, birth_date } = dto;

    // 1. Validasi Duplikasi
    const [existingEmail, existingUsername] = await Promise.all([
      this.usersService.findByEmail(email),
      this.usersService.findByUsername(username),
    ]);

    if (existingEmail) throw new ConflictException('Email already exists');
    if (existingUsername)
      throw new ConflictException('Username already exists');

    // 2. Hashing & Role
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const count = await this.usersService.countUsers();
    const role = count === 0 ? Role.ADMIN : Role.USER;

    // 3. Simpan User
    const newUser = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // 4. Simpan Profile
    await this.profilesService.create({
      user_id: newUser.id,
      full_name,
      country,
      birth_date,
    });

    // 5. AUTO LOGIN: Buat Payload & Token
    const payload: UserPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = await this.jwtService.signAsync(payload);

    // 6. Return response yang sama dengan login
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
