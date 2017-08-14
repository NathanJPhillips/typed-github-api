import * as moment from "moment";

import { Repository, RepositoryRef } from "./repository";

export interface OrganizationRef {
  login: string;

  getRepository(name: string): RepositoryRef;

  loadAsync(): Promise<Organization | null>;

  /**
   * Loads repositories owned by this organisation.
   * @param type      The type of repository to return (default all)
   * @param sort      The field to sort by (default full_name)
   * @param ascending Whether to sort ascending rather than descending (default false unless sorting by full_name)
   * @returns         The resulting array of repositories
   */
  loadRepositoriesAsync(
    type?: "all" | "public" | "private" | "forks" | "sources" | "member",
    sort?: "created" | "updated" | "pushed" | "full_name",
    ascending?: boolean): Promise<Repository[]>;
}

export interface OrganizationSummary extends OrganizationRef {
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
