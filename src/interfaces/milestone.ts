import * as moment from "moment";

import { UserSummary } from "./user";

export interface Milestone {
  id: number;
  number: number;
  title: string;
  description: string;
  creator: UserSummary;
  openIssueCount: number;
  closedIssueCount: number;
  state: "open" | "closed";
  created: moment.Moment;
  updated: moment.Moment;
  due: moment.Moment;
  closed?: moment.Moment;
}
