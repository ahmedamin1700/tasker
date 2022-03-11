export class CreateTaskDto {
  title: string;
  description: string;
  status?: 'open' | 'onHold' | 'closed';
}
