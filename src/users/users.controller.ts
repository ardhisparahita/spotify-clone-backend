import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import type { UserPayload } from 'src/auth/interface/authenticated-request.interface';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Role } from './enum/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@User() user: UserPayload) {
    return await this.usersService.findById(user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch('me')
  async updateMe(@User('id') id: string, @Body() updateDto: UpdateUserDto) {
    return await this.usersService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
