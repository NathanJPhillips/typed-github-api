import { IssueRef } from "./issue-ref";
import { Issue } from "./issue";
import { IssueCreator } from "./pull-request";

declare module "./issue-ref" {
  interface IssueRef {
    load(): Promise<Issue | null>;
  }
}

IssueRef.prototype.load = async function (this: IssueRef): Promise<Issue | null> {
  const response = await this.getAsync(`/repos/${this.repository.owner.login}/${this.repository.name}/issues/${this.number}`);
  return IssueCreator.create(response, this);
}
