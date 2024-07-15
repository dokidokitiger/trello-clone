import { Sign } from 'crypto';
import { NOTFOUND } from 'dns';

export const MESSAGES = {
  USER: {
    SIGNUP: {
      SUCCESS: '회원가입에 성공했습니다.',
      EMAIL: {
        EMPTY: '값을 입력해주세요.',
        CONFLICT: '이미 회원가입이 완료된 회원입니다.',
      },
      PASSWORD: {
        EMPTY: '이메일을 입력해주세요.',
        WEAKPASSWORD: '비밀번호 규칙이 맞지 않습니다.',
        NOTMATCHED: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      },
      NICKNAME: {
        EMPTY: '값을 입력해주세요.',
      },
    },
    SIGNIN: {
      EMAIL: {
        EMPTY: '이메일을 입력해주세요.',
      },
      PASSWORD: {
        EMPTY: '비밀번호를 입력해주세요.',
        WRONGPASSWORD:
          '입력된 값이 정확하지 않습니다. 아이디 혹은 비밀번호를 다시 한 번 확인해주세요.',
      },
      USER: {
        NOTFOUND: '등록되지 않은 회원입니다. 회원가입을 먼저 진행해주세요.',
      },
    },
  },
};
