import { GitHubApi } from "./github-api";

export { Options } from "./api-fetch";
export { IssueRef, Issue } from "./interfaces/issue";
export { Label } from "./interfaces/label";
export { Milestone } from "./interfaces/milestone";
export { OrganizationRef, OrganizationSummary, Organization } from "./interfaces/organization";
export { RepositoryRef, Repository } from "./interfaces/repository";
export { UserRef, UserSummary, User, MyUser } from "./interfaces/user";

export { IssueWebHookData, IssueWebHook } from "./web-hook";

export { RequestWithRawBody } from "./utils/request-with-rawbody";

import "./issue-ref-impl";
import "./repository-ref-impl";
import "./user-ref-impl";

export default GitHubApi;
