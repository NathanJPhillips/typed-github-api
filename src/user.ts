import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { UserRef } from "./user-ref";

export class UserSummary extends UserRef {
  public id: number;
  public avatarUri: string;

  protected constructor(data: apiTypes.UserSummary, options: OptionsOrRef) {
    super(data.login, options);
    this.id = data.id;
    this.avatarUri = data.avatar_url;
  }
}

export class User extends UserSummary {
  public name: string;
  public company: string;
  public blog: string;
  public location: string;
  public email: string;
  public publicRepos: number;
  public publicGists: number;
  public followers: number;
  public following: number;
  public created: Date;

  protected constructor(data: apiTypes.User, options: OptionsOrRef) {
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
    this.created = data.created_at;
  }
}

export class MyUser extends User {
  twoFactorAuthentication: boolean;

  protected constructor(data: apiTypes.PrivateUser, options: OptionsOrRef) {
    super(data, options);
    this.twoFactorAuthentication = data.two_factor_authentication;
  }
}

export class UserCreator extends MyUser {
  public static createSummary(data: apiTypes.UserSummary, options: OptionsOrRef): UserSummary {
    return new UserSummary(data, options);
  }

  public static create(data: apiTypes.User, options: OptionsOrRef): User {
    return new User(data, options);
  }

  public static createMyUser(data: apiTypes.PrivateUser, options: OptionsOrRef) {
    return new MyUser(data, options);
  }
}
