import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength, IsDateString, Min, IsUUID } from 'class-validator';
import { StudentType } from 'src/student/student.type';

@InputType()
export class CreateLessonInput {
  @MinLength(1)
  @Field()
  name: string;

  @IsDateString()
  @Field()
  startDate: string;

  @IsDateString()
  @Field()
  endDate: string;

  @IsUUID("4", { each: true })
  @Field(() => [ID], { defaultValue: [] })
  students: string[];
}

@InputType()
export class AssignStudentsToLessonInput {
  @IsUUID()
  @Field(type => ID)
  lessonId: string;

  @IsUUID("4", { each: true })
  @Field(type => [ID])
  studentIds: string[];
}
