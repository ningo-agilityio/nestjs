import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";
import { stat } from "fs";

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  // It also accepts metadata param 
  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(`Status ${status} is invalid`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    return this.allowedStatuses.indexOf(status) > -1;
  }
}