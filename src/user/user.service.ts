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

  async createUser(requestBody: any): Promise<any> {
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

  async findAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async updateUser(id: number, requestBody: any): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new Error('User not found');
      }
      const updateData = { ...user, ...requestBody };
      // 2 param truyền id với data update
      return await this.userRepository.update(id, updateData);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      return await this.userRepository.delete({ firstName: id });
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete user');
    }
  }
}
