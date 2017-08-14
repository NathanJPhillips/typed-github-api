import * as moment from "moment";

import { OwnerRef } from "./owner-ref";

export interface OrganizationSummary extends OwnerRef {
  id: number;
  avatarUri: string;
  description: string;
}

export interface Organization extends OrganizationSummary {
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: moment.Moment;
  updatedAt: moment.Moment;
  htmlUri: string;
  hasOrganizationProjects: boolean;
  hasRepositoryProjects: boolean;
}

export interface MyOrganization {
  privateReposTotal: number;
  privateReposOwned: number;
  privateGists: number;
  diskUsage: number;
  collaborators: number;
  plan: {
    name: string;
    space: number;
    privateRepos: number;
    collaborators: number;
  };
  billingEmail: string;
  defaultRepositorySettings: string;
  membersCanCreateRepositories: boolean;
}
