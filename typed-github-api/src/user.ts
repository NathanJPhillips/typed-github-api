import * as moment from "moment";

import * as apiTypes from "./api-interfaces";
import { OptionsOrRef } from "./github-ref";
import { UserRefClass } from "./user-ref";

import { MyUser, User, UserSummary } from "./interfaces/user";


export class UserSummaryClass extends UserRefClass implements UserSummary {
  public id: number;
  public avatarUri: string;
  public siteAdministrator: boolean;

  public constructor(data: apiTypes.UserSummary, options: OptionsOrRef) {
    super(data.login, options);
    this.id = data.id;
    this.avatarUri = data.avatar_url;
    this.siteAdministrator = data.site_admin;
  }
}

export class UserClass extends UserSummaryClass implements User {
  public name: string;
  public company: string;
  public blog: string;
  public location: string;
  public email: string;
  public publicRepos: number;
  public publicGists: number;
  public followers: number;
  public following: number;
  public createdAt: moment.Moment;
  public updatedAt: moment.Moment;
  public isHireable: boolean;
  public biography: string;

  public constructor(data: apiTypes.User, options: OptionsOrRef) {
    super(data, options);
    this.name = data.name;
    this.company = data.company;
    this.blog = data.blog;
    this.location = data.location;
    this.email = data.email;
    this.publicRepos = data.public_repos;
    this.publicGists = data.public_gists;
    this.followers = data.followers;
    this.following = data.following;
    this.createdAt = moment(data.created_at);
    this.updatedAt = moment(data.updated_at);
    this.isHireable = data.hireable;
    this.biography = data.bio;
  }
}

export class MyUserClass extends UserClass implements MyUser {
  public privateReposTotal: number;
  public privateReposOwned: number;
  public privateGists: number;
  public diskUsage: number;
  public collaborators: number;
  public plan: {
    name: string;
    space: number;
    privateRepos: number;
    collaborators: number;
  };
  public twoFactorAuthentication: boolean;

  public constructor(data: apiTypes.PrivateUser, options: OptionsOrRef) {
    super(data, options);
    this.privateReposTotal = data.total_private_repos;
    this.privateReposOwned = data.owned_private_repos;
    this.privateGists = data.private_gists;
    this.diskUsage = data.disk_usage;
    this.collaborators = data.collaborators;
    this.plan = {
      name: data.plan.name,
      space: data.plan.space,
      privateRepos: data.plan.private_repos,
      collaborators: data.plan.collaborators,
    };
    this.twoFactorAuthentication = data.two_factor_authentication;
  }
}
