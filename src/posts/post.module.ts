import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { LoggerMiddleware } from 'src/middlewares/logging.middleware';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User])],
  controllers: [PostController],
  providers: [PostService, UserService],
})
export class PostModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: '/api/v1/posts', method: RequestMethod.GET },
        { path: '/api/v1/posts/:id', method: RequestMethod.GET },
        { path: '/api/v1/posts/user/:id', method: RequestMethod.GET },
      )
      .forRoutes(PostController);
  }
}
