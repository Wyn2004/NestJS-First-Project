import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'root',
      password: '12345',
      database: 'store-nestjs',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
