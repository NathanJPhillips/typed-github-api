import * as moment from "moment";

import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { UserRefClass } from "./user-ref";

import { MyUser, User, UserSummary } from "./interfaces/user";


export class UserSummaryClass extends UserRefClass implements UserSummary {
  public id: number;
  public avatarUri: string;

  public constructor(data: apiTypes.UserSummary, options: OptionsOrRef) {
    super(data.login, options);
    this.id = data.id;
    this.avatarUri = data.avatar_url;
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
  public created: moment.Moment;

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
    this.created = moment(data.created_at);
  }
}

export class MyUserClass extends UserClass implements MyUser {
  public twoFactorAuthentication: boolean;

  public constructor(data: apiTypes.PrivateUser, options: OptionsOrRef) {
    super(data, options);
    this.twoFactorAuthentication = data.two_factor_authentication;
  }
}
