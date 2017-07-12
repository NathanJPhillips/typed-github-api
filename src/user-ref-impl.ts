import * as apiTypes from "./api-types";
import { Repository, RepositoryCreator } from "./repository";
import { UserRef } from "./user-ref";
import { User, UserCreator } from "./user";

declare module "./user-ref" {
  interface UserRef {
    loadAsync(): Promise<User | null>;

    /**
     * @description Loads repositories accessible to this user.
     * @param type The type of search (default owner)
     * @param sort The field to sort by (default full_name)
     * @param ascending Whether to sort ascending rather than descending (default false unless sorting by full_name)
     * @return The resulting array of repositories
     */
    loadRepositoriesAsync(
      type?: "all" | "owner" | "member",
      sort?: "created" | "updated" | "pushed" | "full_name",
      ascending?: boolean): Promise<Repository[]>;
  }
}

UserRef.prototype.loadAsync = async function (this: UserRef): Promise<User | null> {
  if (this instanceof User)
    return <User>this;
  const response = await this.getAsync<apiTypes.User>(`/users/${this.login}`);
  if (response === null)
    return null;
  return UserCreator.create(response.data, this);
}

function loadRepositoriesAsync(
  type?: "all" | "owner" | "member",
  sort?: "created" | "updated" | "pushed" | "full_name",
  ascending?: boolean): Promise<Repository[]>;
async function loadRepositoriesAsync(
  this: UserRef,
  type: "all" | "owner" | "member" = "owner",
  sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
  ascending?: boolean): Promise<Repository[]>
{
  if (ascending === undefined)
    ascending = sort === "full_name";
  const response = await this.getAllPagesAsync<apiTypes.Repository>(`/users/${this.login}/repos?type=${type}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
  if (response === null)
    throw new Error("Could not load repositories; user may not exist");
  return response.map((repository) => RepositoryCreator.create(repository, this));
}
UserRef.prototype.loadRepositoriesAsync = loadRepositoriesAsync;
