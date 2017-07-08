import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { Issue } from "./issue";

export class PullRequest extends Issue {
  protected constructor(issueData: apiTypes.Issue, _data: apiTypes.PullRequest, options: OptionsOrRef) {
    super(issueData, options);
  }
}

export class IssueCreator extends PullRequest {
  public static create(data: null, options: OptionsOrRef): null;
  public static create(data: apiTypes.Issue, options: OptionsOrRef): Issue;
  public static create(data: apiTypes.Issue | null, options: OptionsOrRef): Issue | null {
    if (data === null)
      return null;
    if (data.pull_request)
      return new PullRequest(data, data.pull_request, options);
    else
      return new Issue(data, options);
  }
}
