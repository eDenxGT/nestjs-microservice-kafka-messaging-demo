import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class DlqMessageDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  originalTopic: string;

  @IsString()
  @IsNotEmpty()
  errorMessage: string;

  @IsDate()
  @IsNotEmpty()
  movedToDLQAt: Date;
}

export class DlqMessageEntity {
  from: string;
  to: string;
  message: string;
  originalTopic: string;
  errorMessage: string;
  movedToDLQAt: Date;
}
