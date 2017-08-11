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
  updated_at: Date;
}

export interface User extends UserSummary, UserOrOrg {
  type: "User";
  hireable: boolean;
  bio: string;
}

export interface Organization extends OrganizationSummary, UserOrOrg {
  type: "Organization";
  html_url: string;
  has_organization_projects: boolean;
  has_repository_projects: boolean;
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

export interface PrivateOrganization extends Organization, PrivateUserOrOrg {
  type: "Organization";
  billing_email: string;
  default_repository_settings: string;
  members_can_create_repositories: boolean;
}
