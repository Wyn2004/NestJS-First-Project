import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { Repository } from 'typeorm';
import { PostCreateDTO, PostResponseDTO, PostUpdateDTO } from './dtos/post.dto';
import { User } from 'src/user/user.entity';
import { Permission } from 'src/helpers/permission.helper';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
  ) {}

  async getAllPost(): Promise<PostResponseDTO[]> {
    // realation để lấ userid
    const response = await this.postRepository.find({ relations: ['user'] });
    const postsDTO: PostResponseDTO[] = response.map((post: Posts) => {
      const postReponseDTO = new PostResponseDTO();
      postReponseDTO.id = post.id;
      postReponseDTO.title = post.title;
      postReponseDTO.content = post.content;
      postReponseDTO.userId = +post.user.id;
      return postReponseDTO;
    });
    return postsDTO;
  }

  async getPostById(id: string): Promise<PostResponseDTO> {
    try {
      const response = await this.postRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!response) {
        throw new BadRequestException('Post not found');
      }
      const postReponseDTO = new PostResponseDTO();
      postReponseDTO.id = response.id;
      postReponseDTO.title = response.title;
      postReponseDTO.content = response.content;
      postReponseDTO.userId = +response.user.id;
      return postReponseDTO;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error fetching post by ID:', error);
      throw new Error(`Failed to fetch post with ID ${id}: ${error.message}`);
    }
  }

  async getPostsByUserId(userId: number): Promise<PostResponseDTO[]> {
    try {
      const response = await this.postRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      if (!response) {
        throw new BadRequestException('User not found');
      }
      const postsDTO: PostResponseDTO[] = response.map((post: Posts) => {
        const postReponseDTO = new PostResponseDTO();
        postReponseDTO.id = post.id;
        postReponseDTO.title = post.title;
        postReponseDTO.content = post.content;
        postReponseDTO.userId = +post.user.id;
        return postReponseDTO;
      });
      return postsDTO;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error fetching posts by user ID:', error);
      throw new Error(
        `Failed to fetch posts for user ID ${userId}: ${error.message}`,
      );
    }
  }

  async createPost(
    requestBody: PostCreateDTO,
    currentUser: User,
  ): Promise<Posts> {
    const post = this.postRepository.create(requestBody);
    post.user = currentUser;
    return await this.postRepository.save(post);
  }

  async updatePost(id: string, requestBody: PostUpdateDTO): Promise<Posts> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }
      const post = await this.postRepository.findOneBy({ id: id });
      if (!post) {
        throw new BadRequestException('Post not found');
      }
      const updateData = { ...post, ...requestBody };
      return await this.postRepository.save(updateData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating post:', error);
      throw new Error(`Failed to update post with ID ${id}: ${error.message}`);
    }
  }

  async deletePost(id: string, currentUser: User): Promise<any> {
    try {
      if (!id) {
        throw new BadRequestException('ID is required');
      }
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!post) {
        throw new BadRequestException('Post not found');
      }
      if (Permission.checkUpdatePost(currentUser, post.user.id)) {
        return await this.postRepository.remove(post);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to delete post with ID ${id}: ${error.message}`);
    }
  }
}
