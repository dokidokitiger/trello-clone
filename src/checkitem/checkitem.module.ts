import { Module } from '@nestjs/common';
import { CheckItemService } from './checkItem.service';
import { CheckItemController } from './checkItem.controller';
import { CheckItem } from './entities/checkItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckListModule } from 'src/checkList/checkList.module';
import { BoardModule } from 'src/board/board.module';
import { CheckList } from 'src/checkList/entities/checkList.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckItem, CheckList]),
    CheckListModule,
    BoardModule,
  ],
  controllers: [CheckItemController],
  providers: [CheckItemService],
  exports: [CheckItemService],
})
export class CheckItemModule {}
