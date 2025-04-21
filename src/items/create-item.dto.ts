import { IsNotEmpty, IsString } from "class-validator";

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsString()
  // @IsNotEmpty()
  // description: string;

  @IsString()
  message: string;
}
