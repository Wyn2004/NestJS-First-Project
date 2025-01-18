import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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
}
