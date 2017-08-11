import * as apiTypes from "./api-interfaces";
import { BranchClass } from "./branch";
import { BranchRefClass } from "./branch-ref";

import { Branch } from "./interfaces/branch";


BranchRefClass.prototype.loadAsync = async function (this: BranchRefClass): Promise<Branch | null> {
  if (this instanceof BranchClass)
    return <BranchClass>this;
  const response = await this.getAsync<apiTypes.Branch>(
    `/repos/${encodeURIComponent(this.repository.owner.login)}/${encodeURIComponent(this.repository.name)}`
      + `/branches/${encodeURIComponent(this.name)}`);
  if (response === null)
    return null;
  return new BranchClass(this.repository, response.data);
};
