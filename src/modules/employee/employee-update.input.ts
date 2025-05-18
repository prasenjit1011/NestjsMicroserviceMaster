import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateEmployeeInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })  // 👈 Add this
  image?: string;

}
