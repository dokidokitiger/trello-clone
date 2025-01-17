import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { COMMENT_MESSAGE } from 'src/constants/comment.message.constant';
import { elapsedTime } from 'src/utils/elapsedtime';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}
  // 댓글 생성
  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
    cardId: number
  ) {
    const { content } = createCommentDto;
    const comment = this.commentRepository.save({ userId, cardId, content });
    return comment;
  }

  // 댓글 조회
  async findAll(cardId: number) {
    const comments = await this.commentRepository.find({
      where: { cardId },
      relations: ['user'],
    });

    return comments.map((comment) => ({
      id: comment.id,
      nickname: comment.user.nickname,
      content: comment.content,
      updatedAt: comment.updatedAt,
      elapsedTime:
        elapsedTime(comment.createdAt.getTime()) +
        (comment.createdAt === comment.updatedAt ? '' : ' (수정됨)'),
    }));
  }

  // 댓글 수정
  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, deletedAt: null },
    });

    // 댓글이 존재하는지 확인
    if (!comment) {
      throw new NotFoundException(COMMENT_MESSAGE.COMMENT.NOT_FOUND);
    }

    // 댓글 작성자가 본인인지 확인
    if (userId !== comment.userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.commentRepository.update({ id }, updateCommentDto);
    return await this.commentRepository.findOneBy({ id });
  }

  // 댓글 삭제
  async remove(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, deletedAt: null },
    });
    // 댓글이 존재하는지 확인
    if (!comment) {
      throw new NotFoundException(COMMENT_MESSAGE.COMMENT.NOT_FOUND);
    }
    // 댓글 작성자가 본인인지 확인
    if (userId !== comment.userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    await this.commentRepository.softDelete({ id });
    const deletedComment = await this.commentRepository.findOne({
      where: { id },
      withDeleted: true,
      select: ['deletedAt'],
    });
    return { deletedAt: deletedComment.deletedAt };
  }
}
