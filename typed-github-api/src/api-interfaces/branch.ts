import { CommitSummary, GitRef } from "./commit";
import { Repository } from "./repository";
import { UserSummary } from "./user";


export interface BranchRef {
  name: string;
  commit: GitRef;
}

export interface BranchSummary {
  label: string;
  ref: string;
  sha: string;
  user: UserSummary;
  repo: Repository;
}

export interface Branch {
  name: string;
  commit: CommitSummary;
  _links: {
    html: string,
    self: string,
  };
  protected?: boolean;
  protection_url?: string;
}
