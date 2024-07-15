import { ApiProperty, PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { LIST_MESSAGES } from 'src/constants/list-message.constant';

export class CreateListDto extends PickType(List, ['boardId', 'title']) {
  @IsInt()
  @ApiProperty({ example: '1' })
  boardId: number;

  @IsString()
  @IsNotEmpty({ message: LIST_MESSAGES.LIST.COMMON.TITLE.NO_TITLE })
  @ApiProperty({ example: 'To do' })
  title: string;
}
