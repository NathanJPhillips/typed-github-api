import * as moment from "moment";

import { Repository, RepositoryRef } from "./repository";

export interface UserRef {
  login: string;

  getRepository(name: string): RepositoryRef;

  loadAsync(): Promise<User | null>;

  /**
   * @description Loads repositories accessible to this user.
   * @param type The type of search (default owner)
   * @param sort The field to sort by (default full_name)
   * @param ascending Whether to sort ascending rather than descending (default false unless sorting by full_name)
   * @returns The resulting array of repositories
   */
  loadRepositoriesAsync(
    type?: "all" | "owner" | "member",
    sort?: "created" | "updated" | "pushed" | "full_name",
    ascending?: boolean): Promise<Repository[]>;
}

export interface UserSummary extends UserRef {
  id: number;
  avatarUri: string;
}

export interface User extends UserSummary {
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
}

export interface MyUser extends User {
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
  twoFactorAuthentication: boolean;
}
