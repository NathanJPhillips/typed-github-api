import * as apiTypes from "./api-types";
import { Repository, RepositoryCreator } from "./repository";
import { UserRef } from "./user-ref";
import { User, UserCreator } from "./user";

declare module "./user-ref" {
  interface UserRef {
    load(): Promise<User>;

    loadRepositories(
      type: "all" | "owner" | "member",
      sort: "created" | "updated" | "pushed" | "full_name",
      ascending?: boolean): Promise<Repository[]>;
  }
}

UserRef.prototype.load = async function (this: UserRef): Promise<User> {
  if (this instanceof User)
    return <User>this;
  const response = await this.getAsync(`/users/${this.login}`);
  return UserCreator.create(response.body, this);
}

UserRef.prototype.loadRepositories = async function (
  this: UserRef,
  type: "all" | "owner" | "member" = "owner",
  sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
  ascending?: boolean): Promise<Repository[]>
{
  if (ascending === undefined)
    ascending = sort === "full_name";
  const response = await this.getAsync(`/users/${this.login}/repos?type=${type}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
  return response.body.map((repository: apiTypes.Repository) => RepositoryCreator.create(repository, this));
}
