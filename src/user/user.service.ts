import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(requestBody: any) {
    try {
      // Tạo đối tượng user từ requestBody
      const user = this.userRepository.create(requestBody);

      // Lưu vào cơ sở dữ liệu
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);

      throw new Error('Failed to create user');
    }
  }
}
