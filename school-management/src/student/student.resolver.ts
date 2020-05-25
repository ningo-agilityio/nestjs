import { StudentService } from "./student.service";
import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { StudentType } from "./student.type";
import { CreateStudentInput } from "./create-student.input";
import { Student } from "./student.entity";

@Resolver(of => StudentType)
export class StudentResolver {
  constructor(private studentService: StudentService) { }

  @Mutation(returns => StudentType)
  createStudent(@Args('createStudentInput') createStudentInput: CreateStudentInput): Promise<Student> {
    return this.studentService.createStudent(createStudentInput);
  }

  @Query(returns => [StudentType])
  students(): Promise<Student[]> {
    return this.studentService.getStudents();
  }

  @Query(returns => StudentType)
  student(@Args('id') id: string): Promise<Student> {
    return this.studentService.getStudent(id);
  }
}