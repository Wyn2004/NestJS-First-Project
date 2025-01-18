import { IsNotEmpty } from 'class-validator';

export class PostCreateDTO {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
}

export class PostResponseDTO {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  userId: number;
}

export class PostUpdateDTO {
  title: string;
  content: string;
}
