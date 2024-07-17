import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { List } from './entities/list.entity';
import { Board } from 'src/board/entities/board.entity';
import { BoardUser } from 'src/board/entities/board-user.entity';
import { Card } from 'src/card/entities/card.entity';
import { LIST_MESSAGES } from 'src/constants/list-message.constant';
import { BOARD_MESSAGES } from 'src/constants/board-message.constant';

import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { MoveListDto } from './dto/move-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { midRank } from 'src/utils/lexorank';

@Injectable()
export class ListService {
  // 의존성 주입
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardUser)
    private readonly boardUserRepository: Repository<BoardUser>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>
  ) {}

  /** 리스트 생성 API **/
  async createList(
    userId: number,
    boardId: number,
    createListDto: CreateListDto
  ) {
    // 인증된 사용자 여부 확인
    if (!userId) {
      throw new UnauthorizedException(
        LIST_MESSAGES.LIST.COMMON.USER.UNAUTHORIZED
      );
    }

    const { title } = createListDto;

    // 초대된 member인지 확인
    const inviteMember = await this.boardUserRepository.findOne({
      where: { userId, boardId },
    });

    if (!inviteMember) {
      throw new UnauthorizedException(
        BOARD_MESSAGES.BOARD.READ_DETAIL.FAILURE.UNAUTHORIZED
      );
    }

    // 해당 id의 Board 있는지 확인
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException(
        BOARD_MESSAGES.BOARD.READ_DETAIL.FAILURE.NOTFOUND
      );
    }

    const lastList = await this.listRepository.findOne({
      where: { boardId },
      order: { listOrder: 'DESC' },
    });

    // List 생성 시 새로운 리스트가 어느 위치에 삽입될지 결정
    // 이전/이후 listId 기반으로 새로운 newRank 값 생성
    const newRank = midRank(lastList ? lastList.listOrder : null, null);

    const createList = await this.listRepository.create({
      board,
      title,
      listOrder: newRank,
    });

    const newList = await this.listRepository.save(createList);

    return newList;
  }

  /** 리스트 조회 API **/
  async findAllLists(userId: number, boardId: number) {
    // 인증된 사용자 여부 확인
    if (!userId) {
      throw new UnauthorizedException(
        LIST_MESSAGES.LIST.COMMON.USER.UNAUTHORIZED
      );
    }

    const lists = await this.listRepository.find({
      where: { boardId },
      order: { listOrder: 'ASC' },
    });

    return lists;
  }

  /** 리스트 상세 조회 API **/
  async findListById(userId: number, listId: number) {
    // 인증된 사용자 여부 확인
    if (!userId) {
      throw new UnauthorizedException(
        LIST_MESSAGES.LIST.COMMON.USER.UNAUTHORIZED
      );
    }

    const list = await this.listRepository.findOne({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException(LIST_MESSAGES.LIST.READ_LIST.FAILURE);
    }

    // 해당 list의 card 정보(title) 불러오기
    const cards = await this.cardRepository
      .createQueryBuilder('card')
      .select(['card.id', 'card.title'])
      .where('card.listId = :listId', { listId })
      .getMany();

    return { ...list, cards };
  }

  /** 리스트 이름 수정 API **/
  async updateList(
    userId: number,
    listId: number,
    updateListDto: UpdateListDto
  ) {
    // 인증된 사용자 여부 확인
    if (!userId) {
      throw new UnauthorizedException(
        LIST_MESSAGES.LIST.COMMON.USER.UNAUTHORIZED
      );
    }

    // 해당하는 listId 가져오기
    const list = await this.findListById(userId, listId);

    if (!list) {
      throw new NotFoundException(LIST_MESSAGES.LIST.READ_DETAIL.FAILURE);
    }

    const { title } = updateListDto;

    await this.listRepository.update({ id: listId }, { title });

    const updateList = {
      before: list.title,
      after: updateListDto.title,
    };

    return updateList;
  }

  /** 리스트 순서 이동 API **/
  async moveList(userId: number, listId: number, moveListDto: MoveListDto) {
    // 인증된 사용자 여부 확인
    if (!userId) {
      throw new UnauthorizedException(
        LIST_MESSAGES.LIST.COMMON.USER.UNAUTHORIZED
      );
    }

    // 해당하는 listId 가져오기
    const list = await this.findListById(userId, listId);

    if (!list) {
      throw new NotFoundException(LIST_MESSAGES.LIST.READ_DETAIL.FAILURE);
    }

    const { toPrevId, toNextId } = moveListDto;

    // 순서 이동 후 위치할 이전/이후 list 조회
    const prevList = toPrevId
      ? await this.listRepository.findOneBy({ id: toPrevId })
      : null;
    const nextList = toNextId
      ? await this.listRepository.findOneBy({ id: toNextId })
      : null;

    // 이전/이후 list의 lexorank 값 기반으로 새로운 newRank 값 생성
    const newRank = midRank(
      prevList ? prevList.listOrder : null,
      nextList ? nextList.listOrder : null
    );

    // 이동할 list의 lexorank 값을 새로운 newRank 값으로 변경
    list.listOrder = newRank;

    const moveList = await this.listRepository.save(list);

    return moveList;
  }

  /** 리스트 삭제 API **/
  async removeList(userId: number, listId: number) {
    // 인증된 사용자 여부 확인
    if (!userId) {
      throw new UnauthorizedException(
        LIST_MESSAGES.LIST.COMMON.USER.UNAUTHORIZED
      );
    }

    // 해당하는 listId 가져오기
    const list = await this.findListById(userId, listId);

    if (!list) {
      throw new NotFoundException(LIST_MESSAGES.LIST.READ_DETAIL.FAILURE);
    }

    await this.listRepository.softDelete({
      id: listId,
    });

    const removeList = {
      id: list.id,
      title: list.title,
    };

    return removeList;
  }
}
