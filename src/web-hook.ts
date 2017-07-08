import { Codes as HttpStatusCodes } from "blow-http-statuses";
const hmacSha1 = require("crypto-js/hmac-sha1");
import * as express from "express";
import { Action, AsyncAction, EventHandler } from "typescript-event-handler";
import * as logger from "winston";

import { RequestWithRawBody } from "./utils/request-with-rawbody";

import * as apiTypes from "./api-types";
import { GitHubRef, OptionsOrRef } from "./github-ref";
import { Issue } from "./issue";
import { IssueCreator } from "./pull-request";
import { UserSummary, UserCreator } from "./user";


export interface WebHookData {
  id: string;
  event: string;
  action: string;
  sender: UserSummary;
}

export abstract class WebHook<TData extends WebHookData, TApiData extends apiTypes.WebHookData> extends GitHubRef {
  public readonly router: express.Router = express.Router();
  private readonly handlers = new EventHandler<TData>();
  private secret?: string;

  public constructor(options: OptionsOrRef);
  public constructor(secret: string | undefined, options: OptionsOrRef);
  public constructor(secretOrOptions: string | undefined | OptionsOrRef, options?: OptionsOrRef) {
    super(<OptionsOrRef>(options ? options : secretOrOptions));
    if (typeof secretOrOptions === "string")
      this.secret = secretOrOptions;
    // Maintain the context of requestHandler by running it in a lambda
    this.router.post("/", (req: RequestWithRawBody, res: express.Response) => this.requestHandler(req, res));
  }

  private requestHandler(req: RequestWithRawBody, res: express.Response) {
    // Check headers are provided
    const id = req.header("X-GitHub-Delivery");
    const event = req.header("X-GitHub-Event");
    if (!id || !event) {
      logger.warn("GitHub headers not provided to GitHub Web hook");
      res.status(HttpStatusCodes.BadRequest).json("Required headers not provided");
      return;
    }
    // Check signature
    if (this.secret) {
      if (!req.rawBody) {
        logger.warn("JSON body not provided to GitHub Web hook - can't validate signature");
        logger.info("Enable JSON with raw body middleware to validate signature");
      } else {
        const signature = req.header("X-Hub-Signature");
        if (!signature) {
          logger.warn("GitHub signature header not provided to GitHub Web hook");
          res.status(HttpStatusCodes.BadRequest).json("Signature header not provided");
          return;
        }
        const signatureParts = signature.split("=");
        if (signatureParts.length !== 2) {
          logger.warn("Signature provided to GitHub Web hook doesn't have two parts separated by '='");
          res.status(HttpStatusCodes.BadRequest).json("No signature provided");
          return;
        }
        let validSignature: string;
        if (signatureParts[0] === "sha1")
          validSignature = new hmacSha1(req.rawBody, this.secret).toString();
        else {
          logger.warn(`Unknown signature type '${signatureParts[0]}' passed to GitHub Web hook`);
          res.status(HttpStatusCodes.BadRequest).json("Invalid signature provided");
          return;
        }
        if (validSignature !== signatureParts[1]) {
          logger.warn("Invalid signature provided to GitHub Web hook");
          logger.debug(`Expected ${validSignature}, got ${signatureParts[1]}`);
          res.status(HttpStatusCodes.BadRequest).json("Invalid signature provided");
          return;
        }
      }
    }
    res.sendStatus(HttpStatusCodes.Accepted);
    const data: TApiData = req.body;
    const request: WebHookData = {
      id: id,
      event: event,
      action: data.action,
      sender: UserCreator.createSummary(data.sender, this),
    };
    this.handlers.handleAsync(this.convertData(request, data));
  }

  protected abstract convertData(request: WebHookData, data: TApiData): TData;

  public registerHandler(handler: Action<TData>) {
    this.handlers.register((_webHookRequest: TData) => true, handler);
  }
  public registerAsyncHandler(handler: AsyncAction<TData>) {
    this.handlers.registerAsync(async (_webHookRequest: TData) => true, handler);
  }
}

export interface IssueWebHookData extends WebHookData {
  action: "assigned" | "unassigned" | "labeled" | "unlabeled" | "opened" | "edited" | "milestoned" | "demilestoned" | "closed" | "reopened";
  issue: Issue;
}

export class IssueWebHook extends WebHook<IssueWebHookData, apiTypes.IssueWebHookData> {
  protected convertData(request: WebHookData, data: apiTypes.IssueWebHookData): IssueWebHookData {
    if (!data.repository) {
      logger.warn("Issue did not have repository to find it in.");
      throw new Error("Issue did not have repository to find it in.");
    }
    return {
      id: request.id,
      event: request.event,
      sender: request.sender,
      action: data.action,
      issue: IssueCreator.create(data.issue, this),
    };
  }
}
