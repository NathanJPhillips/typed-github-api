import { GitHubApi } from "./github-api";

export { Options } from "./api-fetch";
export { Issue } from "./issue";
import { IssueRef } from "./issue-ref";
import "./issue-ref-impl";
export { IssueRef };
export { Label } from "./label";
export { Milestone } from "./milestone";
export { Repository } from "./repository";
import { RepositoryRef } from "./repository-ref";
import "./repository-ref-impl";
export { RepositoryRef };
export { User } from "./user";
import { UserRef } from "./user-ref";
import "./user-ref-impl";
export { UserRef };
export { IssueWebHookData, IssueWebHook } from "./web-hook";
export { RequestWithRawBody } from "./utils/request-with-rawbody";

export default GitHubApi;
