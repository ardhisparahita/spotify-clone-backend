import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);

    return await this.userRepository.save(newUser);
  }

  async findByLoginTerm(term: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [{ email: term }, { username: term }],
    });
  }
}
