import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import type { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async findByUserId(@Req() req: AuthenticatedRequest) {
    return this.profilesService.findByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(req.user.id, updateProfileDto);
  }
}
