import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRepository.create(createProfileDto);
    return await this.profileRepository.save(profile);
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile for User ID ${userId} not found`);
    }

    return profile;
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findByUserId(userId);

    const updatedProfile = this.profileRepository.merge(
      profile,
      updateProfileDto,
    );

    return await this.profileRepository.save(updatedProfile);
  }
}
