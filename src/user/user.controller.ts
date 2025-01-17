import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { USER_MESSAGES } from 'src/constants/user-message.constant';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { LogIn } from 'src/auth/decorator/login.decorator';
import { SignUpDto } from 'src/user/dto/sign-up.dto';
import { SignInDto } from 'src/user/dto/sign-in.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserPasswordUpdateDto } from './dto/user-password-update.dto';
import { UserUpdateDto } from './dto/user-update.dto';

@ApiTags('1. 사용자 API')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 회원 가입 API **/
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: USER_MESSAGES.USER.SIGNUP.SUCCESS,
  })
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.userService.signUp(signUpDto);
    return {
      status: HttpStatus.CREATED,
      message: USER_MESSAGES.USER.SIGNUP.SUCCESS,
      data: data,
    };
  }

  /** 로그인 API **/
  @ApiResponse({
    status: HttpStatus.OK,
    description: USER_MESSAGES.USER.SIGNIN.SUCCESS,
  })
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const data = await this.userService.signIn(signInDto);
    return {
      status: HttpStatus.OK,
      message: USER_MESSAGES.USER.SIGNIN.SUCCESS,
      data: data,
    };
  }

  /** 회원 정보 조회 API **/
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: USER_MESSAGES.USER.USERINFO.READ.SUCCESS,
  })
  @Get('me')
  async findUserInfo(@LogIn() user: User) {
    const data = await this.userService.findUserInfo(user);
    return {
      status: HttpStatus.OK,
      message: USER_MESSAGES.USER.USERINFO.READ.SUCCESS,
      data: data,
    };
  }

  /** 회원 탈퇴 API **/
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: USER_MESSAGES.USER.USERINFO.DELETE.SUCCESS,
  })
  @Delete('me')
  async quit(@LogIn() user: User) {
    const data = await this.userService.quit(user);
    return {
      status: HttpStatus.OK,
      message: USER_MESSAGES.USER.USERINFO.DELETE.SUCCESS,
      data: data,
    };
  }

  /** 회원 정보 수정 API **/
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: USER_MESSAGES.USER.USERINFO.UPDATE.SUCCESS,
  })
  @Patch('me')
  async updateUserInfo(
    @LogIn() user: User,
    @Body() userUpdateDto: UserUpdateDto
  ) {
    const data = await this.userService.updateUserInfo(user, userUpdateDto);
    return {
      status: HttpStatus.OK,
      message: USER_MESSAGES.USER.USERINFO.UPDATE.SUCCESS,
      data: data,
    };
  }

  /** 회원 비밀번호 수정 API **/
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: USER_MESSAGES.USER.USERINFO.UPDATE.SUCCESS,
  })
  @Patch('me/password')
  async updateUserPassword(
    @LogIn() user: User,
    @Body() userPasswordUpdateDto: UserPasswordUpdateDto
  ) {
    const data = await this.userService.updateUserPassword(
      user,
      userPasswordUpdateDto
    );
    return {
      status: HttpStatus.OK,
      message: USER_MESSAGES.USER.USERINFO.UPDATE.SUCCESS,
      data: { success: true },
    };
  }
}
