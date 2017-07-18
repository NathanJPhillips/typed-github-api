import { GitHubApi } from "./github-api";

export { Options } from "./api-fetch";
export * from "./interfaces/commit";
export * from "./interfaces/issue";
export * from "./interfaces/label";
export * from "./interfaces/milestone";
export * from "./interfaces/organization";
export * from "./interfaces/repository";
export * from "./interfaces/user";

export { IssueWebHookData, IssueWebHook } from "./web-hook";

export { RequestWithRawBody } from "./utils/request-with-rawbody";

import "./issue-ref-impl";
import "./repository-ref-impl";
import "./user-ref-impl";

export default GitHubApi;
