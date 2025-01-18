import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Posts } from 'src/posts/posts.entity';

export enum ROLES {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  // cài default
  @Column({ default: ROLES.GUEST })
  role: ROLES;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];
}
