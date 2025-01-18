import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LoggerMiddleware } from 'src/middlewares/logging.middleware';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
// import entity vao user module
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    // * là all route
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: '/api/v1/users/login', method: RequestMethod.POST },
        { path: '/api/v1/users/register', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
