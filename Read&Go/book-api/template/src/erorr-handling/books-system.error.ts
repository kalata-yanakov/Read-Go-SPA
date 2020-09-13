export class BooksSystemError extends Error {
  public errorCode: number;
  public message: string;

  constructor(message: string, errorCode: number) {
    super()

    this.message = message;
    this.errorCode = errorCode;
  }

}

export enum ErrorType {
  // eslint-disable-next-line @typescript-eslint/camelcase
  Missing_Entity = 404,
  // eslint-disable-next-line @typescript-eslint/camelcase
  Invalid_Operation = 400,
}
