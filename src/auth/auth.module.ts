import { Module, forwardRef } from '@nestjs/common'; // 1. Import forwardRef
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { jwtConstant } from './constant';
import { ProfilesModule } from 'src/profiles/profiles.module';

config();

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ProfilesModule,

    JwtModule.register({
      global: true,
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
