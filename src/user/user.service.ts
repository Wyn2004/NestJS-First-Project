import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLES, User } from './user.entity';
import { UpdateUserDTO } from './dtos/user.dto';
import { Permission } from 'src/helpers/permission.helper';

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

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }
  async findUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Đảm bảo BadRequestException được trả lại nếu xảy ra
      }
      throw new Error('Failed to find user');
    }
  }

  async updateUser(
    id: number,
    requestBody: UpdateUserDTO,
    currentUser: User,
  ): Promise<any> {
    try {
      const user = await this.findUserById(id);
      if (!user) {
        throw new BadRequestException(`User with ID ${id} not found`);
      }
      // Check xem phai admin ko, ko thi chi cho phep update myprofile
      if (Permission.checkUpdateProfile(currentUser, id)) {
        // Check unique email
        if (requestBody.email) {
          const existingUser = await this.userRepository.findOne({
            where: { email: requestBody.email },
          });

          if (existingUser && existingUser.id !== id) {
            throw new BadRequestException(
              'Email is already in use by another user',
            );
          }
        }

        const updateData = { ...user, ...requestBody };
        // 2 param truyền id với data update
        const response = await this.userRepository.save(updateData);
        console.log('response', response);
        return response;
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<any> {
    try {
      return await this.userRepository.delete({ id });
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete user');
    }
  }

  async changeRole(id: number, role: ROLES): Promise<any> {
    try {
      const userData: User = await this.findUserById(id);
      if (!userData) {
        throw new BadRequestException(`User with ID ${id} not found`);
      }
      userData.role = role;
      const response = this.userRepository.save(userData);
      if (!response) {
        throw new BadRequestException(`User with ID ${id} not found`);
      }
      return response;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to update user');
    }
  }
}
