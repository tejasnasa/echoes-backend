import { Response } from "express";

export class CustomResponse<T = null> {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
  accessToken: string | undefined;

  constructor(
    status: boolean,
    message: string,
    responseObject: T,
    statusCode: number,
    accessToken?: string
  ) {
    this.success = status;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
    this.accessToken = accessToken;
  }
}

export interface ServerResponse extends Response {
  json: <T>(body: CustomResponse<T>) => this;
}
