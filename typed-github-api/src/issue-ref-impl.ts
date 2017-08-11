import * as apiTypes from "./api-types";
import { IssueClass } from "./issue";
import { IssueRefClass } from "./issue-ref";

import { Issue } from "./interfaces/issue";


IssueRefClass.prototype.loadAsync = async function (this: IssueRefClass): Promise<Issue | null> {
  const response = await this.getAsync<apiTypes.Issue>(
    `/repos/${encodeURIComponent(this.repository.owner.login)}/${encodeURIComponent(this.repository.name)}/issues/${this.number}`);
  if (response === null)
    return null;
  return new IssueClass(response.data, this);
};
