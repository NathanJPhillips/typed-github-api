import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { IssueClass } from "./issue";

import { Issue } from "./interfaces/issue";


export class PullRequestClass extends IssueClass implements Issue {
  public constructor(issueData: apiTypes.Issue, _data: apiTypes.PullRequest, options: OptionsOrRef) {
    super(issueData, options);
  }
}

export function createIssue(data: apiTypes.Issue, options: OptionsOrRef): Issue {
  if (data.pull_request)
    return new PullRequestClass(data, data.pull_request, options);
  else
    return new IssueClass(data, options);
}
