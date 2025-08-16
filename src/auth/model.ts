import { t } from 'elysia';

export enum Status {
  SUCCESS = 'success',
  FAIL = 'fail',
  ERROR = 'error',
}

export namespace AuthModel {
  export const registerBody = t.Object({
    username: t.String(),
    password: t.String(),
  });
  export type registerBody = typeof registerBody.static;

  export const registerResponse = t.Object({
    status: t.Enum(Status),
    message: t.String(),
    data: t.Optional(
      t.Object({
        id: t.String(),
        username: t.String(),
      }),
    ),
  });
  export type registerResponse = typeof registerResponse.static;
}
