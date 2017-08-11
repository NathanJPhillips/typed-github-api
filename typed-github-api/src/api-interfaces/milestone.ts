import { UserSummary } from "./user";

export interface Milestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  number: number;
  title: string;
  description: string;
  creator: UserSummary;
  open_issues: number;
  closed_issues: number;
  state: "open" | "closed";
  created_at: Date;
  updated_at: Date;
  due_on: Date;
  closed_at: Date | null;
}
