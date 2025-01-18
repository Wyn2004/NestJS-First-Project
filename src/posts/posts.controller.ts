import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { PostCreateDTO, PostResponseDTO, PostUpdateDTO } from './dtos/post.dto';
import { CurrentUser } from 'src/user/decorator/user.decorator';
import { Roles } from 'src/user/decorator/auth.decorator';
import { ROLES } from 'src/user/user.entity';
import { RoleGuard } from 'src/guard/auth.guard';

@Controller('/api/v1/posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPost(): Promise<PostResponseDTO[]> {
    return await this.postService.getAllPost();
  }
  @Get('/:id')
  async getPostById(@Param('id') id: string): Promise<PostResponseDTO> {
    return await this.postService.getPostById(id);
  }

  @Get('/user/:id')
  async getPostsByUserId(@Param('id') id: number): Promise<PostResponseDTO[]> {
    return await this.postService.getPostsByUserId(id);
  }

  @Post()
  async createPost(
    @Body() requestBody: PostCreateDTO,
    @CurrentUser() user,
  ): Promise<any> {
    return this.postService.createPost(requestBody, user);
  }

  @Put('/:id')
  async updatePost(
    @Param('id') id,
    @Body() requestBody: PostUpdateDTO,
  ): Promise<any> {
    return await this.postService.updatePost(id, requestBody);
  }

  @Delete('/:id')
  @Roles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST)
  @UseGuards(RoleGuard)
  async deletePost(@Param('id') id: string, @CurrentUser() user): Promise<any> {
    return await this.postService.deletePost(id, user);
  }
}
