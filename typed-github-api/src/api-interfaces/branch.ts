import { Repository } from "./repository";
import { UserSummary } from "./user";

export interface Branch {
  label: string;
  ref: string;
  sha: string;
  user: UserSummary;
  repo: Repository;
}
