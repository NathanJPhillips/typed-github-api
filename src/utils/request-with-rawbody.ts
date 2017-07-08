import * as express from "express";

export interface RequestWithRawBody extends express.Request {
  rawBody?: Uint8Array;
}
