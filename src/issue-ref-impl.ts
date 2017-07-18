import * as apiTypes from "./api-types";
import { IssueRefClass } from "./issue-ref";
import { createIssue } from "./pull-request";

import { Issue } from "./interfaces/issue";


IssueRefClass.prototype.loadAsync = async function (this: IssueRefClass): Promise<Issue | null> {
  const response = await this.getAsync<apiTypes.Issue>(
    `/repos/${encodeURIComponent(this.repository.owner.login)}/${encodeURIComponent(this.repository.name)}/issues/${this.number}`);
  if (response === null)
    return null;
  return createIssue(response.data, this);
};
