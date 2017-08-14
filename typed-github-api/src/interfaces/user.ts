import * as moment from "moment";

import { OwnerRef } from "./owner-ref";


export interface UserSummary extends OwnerRef {
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
