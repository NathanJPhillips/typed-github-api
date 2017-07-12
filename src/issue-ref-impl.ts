import * as apiTypes from "./api-types";
import { IssueRef } from "./issue-ref";
import { Issue } from "./issue";
import { IssueCreator } from "./pull-request";

declare module "./issue-ref" {
  interface IssueRef {
    loadAsync(): Promise<Issue | null>;
  }
}

IssueRef.prototype.loadAsync = async function (this: IssueRef): Promise<Issue | null> {
  const response = await this.getAsync<apiTypes.Issue>(`/repos/${this.repository.owner.login}/${this.repository.name}/issues/${this.number}`);
  if (response === null)
    return null;
  return IssueCreator.create(response.data, this);
}
