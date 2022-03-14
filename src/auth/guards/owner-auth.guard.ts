import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const taskId = parseInt(request.params.id);
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return request.user.id === task.userId;
  }
}
