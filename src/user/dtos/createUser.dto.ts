import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
