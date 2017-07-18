export interface UserOrOrgSummary {
  type: "User" | "Organization";
  login: string;
  id: number;
  avatar_url: string;
  url: string;
  repos_url: string;
  events_url: string;
}

export interface UserSummary extends UserOrOrgSummary {
  type: "User";
  gravatar_id: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  received_events_url: string;
  site_admin: boolean;
}

export interface OrganizationSummary extends UserOrOrgSummary {
  type: "Organization";
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  description: string;
}

export interface UserOrOrg extends UserOrOrgSummary {
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
}

export interface User extends UserSummary, UserOrOrg {
  type: "User";
  hireable: boolean;
  bio: string;
  updated_at: Date;
}

export interface PrivateUserOrOrg extends UserOrOrg {
  total_private_repos: number;
  owned_private_repos: number;
  private_gists: number;
  disk_usage: number;
  collaborators: number;
  plan: {
    name: string;
    space: number;
    private_repos: number;
    collaborators: number;
  };
}

export interface PrivateUser extends User, PrivateUserOrOrg {
  type: "User";
  two_factor_authentication: boolean;
}

export interface Organization extends OrganizationSummary, PrivateUserOrOrg {
  type: "Organization";
  html_url: string;
  billing_email: string;
  default_repository_settings: string;
  members_can_create_repositories: boolean;
  has_organization_projects: boolean;
  has_repository_projects: boolean;
}

export interface Event {
  action: string;
}

export interface IssueEvent extends Event {
  action: "assigned" | "unassigned" | "labeled" | "unlabeled" | "opened" | "edited" | "milestoned" | "demilestoned" | "closed" | "reopened";
  issue: Issue;
}

export interface IssueAssignedEvent extends IssueEvent {
  action: "assigned" | "unassigned";
  assignee: UserSummary;
}

export interface IssueLabeledEvent extends IssueEvent {
  action: "labeled" | "unlabeled";
  label: Label;
}

export interface IssueEditedEvent extends IssueEvent {
  action: "edited";
  changes: {
    title: {
      from: string;
    };
    body: {
      from: string;
    };
  };
}

export interface WebHookData extends Event {
  sender: UserSummary;
  organization?: OrganizationSummary;
  repository?: Repository;
}

export interface IssueWebHookData extends IssueEvent, WebHookData {
  action: "assigned" | "unassigned" | "labeled" | "unlabeled" | "opened" | "edited" | "milestoned" | "demilestoned" | "closed" | "reopened";
}

export interface Label {
  id: number;
  url: string;
  name: string;
  color: string;
  default: boolean;
}

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

export interface Issue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  number: number;
  title: string;
  user: UserSummary;
  labels: Label[];
  state: "open" | "closed";
  locked: boolean;
  assignee: UserSummary | null;
  assignees: UserSummary[];
  milestone: Milestone | null;
  comments: number;
  created_at: Date;
  updated_at: Date;
  closed_at: Date | null;
  body: string;
  closed_by: User | null;
  pull_request?: PullRequest;
}

export interface PullRequest {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
}

export interface Repository {
  id: number;
  owner: UserSummary;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  fork: boolean;
  url: string;
  html_url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  clone_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  hooks_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  mirror_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  svn_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  homepage: string;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  topics: string[];
  has_issues: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  pushed_at: Date;
  created_at: Date;
  updated_at: Date;
  permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  allow_rebase_merge: boolean;
  allow_squash_merge: boolean;
  allow_merge_commit: boolean;
  subscribers_count: number;
  network_count: number;
}

export interface GitActor {
  name: string;
  email: string;
  date: Date;
}

export interface GitRef {
  url: string;
  sha: string;
}

export interface CommitRef extends GitRef {
  html_url: string;
}

export interface GitCommitSummary {
  url: string;
  author: GitActor;
  committer: GitActor;
  message: string;
  tree: GitRef;
  comment_count: number;
  verification?: {
    verified: boolean;
    reason: "valid";
    signature: string;
    payload: string;
  };
}

export interface GitCommit extends GitCommitSummary {
  "sha": string;
  "html_url": string;
  "parents": CommitRef[];
}

export interface CommitSummary {
  url: string;
  sha: string;
  html_url: string;
  comments_url: string;
  commit: GitCommitSummary;
  author: UserSummary;
  committer: UserSummary;
  parents: CommitRef[];
}

export interface Commit extends CommitSummary {
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  files: [
    {
      filename: string;
      additions: number;
      deletions: number;
      changes: number;
      status: "modified";
      raw_url: string;
      blob_url: string;
      patch: string;
    }
  ];
}

export interface SearchResult {
  score: number;
}

export interface SearchResults<T> {
  total_count: number;
  incomplete_results: boolean;
  items: Array<T & SearchResult>;
}
