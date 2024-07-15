import { empty, EMPTY } from 'rxjs';
import { EmbeddedMetadata } from 'typeorm/metadata/EmbeddedMetadata';

export const MESSAGES = {
  BOARD: {
    // Board 공통
    COMMON: {
      TITLE: {
        NO_TITLE: '제목을 입력해 주세요.',
      },
      COLOR: {
        NO_COLOR: '색상을 입력해 주세요.',
      },
      EMAIL: {
        NO_EMAIL: '초대할 사용자의 이메일을 입력해 주세요.',
        NOT_EMAIL_TYPE: '이메일 형식이 아닙니다.',
      },
    },
    // Board 생성(C)
    CREATE: {
      SUCCESS: '보드 생성에 성공했습니다.',
      FAILURE: '보드 생성에 실패했습니다.',
    },
    // Board 목록 조회(R-L)
    READ_LIST: {
      SUCCESS: '보드 목록 조회에 성공했습니다.',
      FAILURE: '보드 목록 조회에 실패했습니다.',
    },
    // Board 상세 조회(R-D)
    READ_DETAIL: {
      SUCCESS: '보드 상세 조회에 성공했습니다.',
      FAILURE: {
        UNAUTHORIZED: '초대 받지 않은 보드입니다.',
        NOTFOUND: '해당 보드가 존재하지 않습니다.',
      },
    },
    // Board 수정(U)
    UPDATE: {
      SUCCESS: '보드 수정에 성공했습니다.',
      FAILURE: {
        UNAUTHORIZED: '호스트만 수정할 수 있습니다.',
        NOTFOUND: '해당 보드가 존재하지 않습니다.',
      },
    },
    // Board 삭제(D)
    DELETE: {
      SUCCESS: '보드 삭제에 성공했습니다.',
      FAILURE: {
        UNAUTHORIZED: '호스트만 삭제할 수 있습니다.',
        NOTFOUND: '해당 보드가 존재하지 않습니다.',
      },
    },
    // Board 멤버 초대(Invite)
    INVITE: {
      SUCCESS: '보드 멤버 초대에 성공했습니다.',
      FAILURE: {
        UNAUTHORIZED: '호스트만 초대할 수 있습니다.',
        NOTFOUND: '존재하지 않는 사용자입니다.',
        CONFLICT: '이미 초대한 사용자입니다.',
      },
    },
  },
  LIST: {
    // List 공통
    COMMON: {
      TITLE: {
        NO_TITLE: '제목을 입력해 주세요.',
        CHANGE_TITLE: '제목을 수정해 주세요.',
      },
      USER: {
        UNAUTHORIZED: '인증된 사용자가 아닙니다.',
      },
    },
    // List 생성
    CREATE: {
      SUCCESS: '리스트 생성에 성공했습니다.',
    },
    // List 조회
    READ_LIST: {
      SUCCESS: '리스트 조회에 성공했습니다.',
      FAILURE: '리스트가 존재하지 않습니다.',
    },
    // List 상세 조회
    READ_DETAIL: {
      SUCCESS: '리스트 상세 조회에 성공했습니다.',
      FAILURE: '해당 아이디의 리스트가 존재하지 않습니다.',
    },
    // List 수정
    UPDATE: {
      SUCCESS_NAME: '리스트 이름 수정에 성공했습니다.',
      SUCCESS_ORDER: '리스트 순서 이동에 성공했습니다.',
    },
    // List 삭제
    DELETE: {
      SUCCESS: '리스트 삭제에 성공했습니다.',
    },
  },
  USER: {
    SIGNUP: {
      SUCCESS: '회원가입에 성공했습니다.',
      EMAIL: {
        EMPTY: '값을 입력해주세요.',
        CONFLICT: '이미 회원가입이 완료된 회원입니다.',
      },
      PASSWORD: {
        EMPTY: '값을 입력해주세요.',
        WEAKPASSWORD: '비밀번호 규칙이 맞지 않습니다.',
        NOTMATCHED: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      },
      NICKNAME: {
        EMPTY: '값을 입력해주세요.',
      },
    },
  },
};
