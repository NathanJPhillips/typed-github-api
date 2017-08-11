import * as apiTypes from "./api-interfaces";
import { PullRequestClass } from "./pull-request";
import { PullRequestRefClass } from "./pull-request-ref";

import { PullRequest } from "./interfaces/pull-request";


PullRequestRefClass.prototype.loadAsync = async function (this: PullRequestRefClass): Promise<PullRequest | null> {
  const response = await this.getAsync<apiTypes.PullRequest>(
    `/repos/${encodeURIComponent(this.repository.owner.login)}/${encodeURIComponent(this.repository.name)}/pulls/${this.number}`);
  if (response === null)
    return null;
  return new PullRequestClass(response.data, this);
};
