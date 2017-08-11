import { CommitSummary } from "./commit";
import { Repository, RepositoryRef } from "./repository";
import { UserSummary } from "./user";


export interface BranchRef {
  readonly repository: RepositoryRef;
  readonly name: string;

  loadAsync(): Promise<Branch | null>;
}

export interface Branch extends BranchRef {
  commit: CommitSummary;
}

export interface BranchSummary {
  name: string;
  sha: string;
  user: UserSummary;
  repository?: Repository;
}

export interface BranchSummaryWithRepository extends BranchSummary {
  repository: Repository;
}
