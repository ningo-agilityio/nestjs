import { Resolver, Query, Mutation, Args, Parent, ResolveField } from "@nestjs/graphql";
import { LessonType } from "./lesson.type";
import { LessonService } from "./lesson.service";
import { Lesson } from "./lesson.entity";
import { CreateLessonInput, AssignStudentsToLessonInput } from "./lesson.input";
import { StudentService } from "src/student/student.service";

@Resolver(of => LessonType)
export class LessonResolver {
  constructor(private lessonService: LessonService, private studentService: StudentService) {

  }
  @Query(returns => LessonType)
  lesson(@Args('id') id: string): Promise<Lesson> {
    return this.lessonService.getLesson(id);
  }

  @Query(returns => [LessonType])
  lessons(): Promise<Lesson[]> {
    return this.lessonService.getLessons();
  }

  @Mutation(returns => LessonType)
  createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ): Promise<Lesson> {
    return this.lessonService.createLesson(createLessonInput);
  }

  @Mutation(returns => LessonType)
  assignStudentsToLesson(@Args('assignStudentsToLessonInput') assignStudentsToLessonInput: AssignStudentsToLessonInput): Promise<Lesson> {
    const { lessonId, studentIds } = assignStudentsToLessonInput;
    return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
  }

  @ResolveField()
  async students(@Parent() lesson: Lesson) {
    console.log(lesson.students);
    return this.studentService.getManyStudents(lesson.students);
  }
}