import * as apiTypes from "./api-interfaces";
import { BranchRefClass } from "./branch-ref";
import { CommitSummaryClass } from "./commit";
import { RepositoryRefClass } from "./repository-ref";

import { Branch } from "./interfaces/branch";
import { CommitSummary } from "./interfaces/commit";


export class BranchClass extends BranchRefClass implements Branch {
  public commit: CommitSummary;

  public constructor(repository: RepositoryRefClass, data: apiTypes.Branch) {
    super(repository, data.name);

    this.commit = new CommitSummaryClass(repository, data.commit);
  }
}
