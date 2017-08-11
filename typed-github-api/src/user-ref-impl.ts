import * as apiTypes from "./api-interfaces";
import { RepositoryClass } from "./repository";
import { UserClass } from "./user";
import { UserRefClass } from "./user-ref";

import { Repository } from "./interfaces/repository";
import { User } from "./interfaces/user";


UserRefClass.prototype.loadAsync = async function (this: UserRefClass): Promise<User | null> {
  if (this instanceof UserClass)
    return <UserClass>this;
  const response = await this.getAsync<apiTypes.User>(`/users/${encodeURIComponent(this.login)}`);
  if (response === null)
    return null;
  return new UserClass(response.data, this);
};

function loadRepositoriesAsync(
  type?: "all" | "owner" | "member",
  sort?: "created" | "updated" | "pushed" | "full_name",
  ascending?: boolean): Promise<Repository[]>;
async function loadRepositoriesAsync(
  this: UserRefClass,
  type: "all" | "owner" | "member" = "owner",
  sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
  ascending?: boolean): Promise<Repository[]>
{
  if (ascending === undefined)
    ascending = sort === "full_name";
  const response = await this.getAllPagesAsync<apiTypes.Repository>(
    `/users/${encodeURIComponent(this.login)}/repos?type=${type}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
  if (response === null)
    throw new Error("Could not load repositories; user may not exist");
  return response.map((repository) => new RepositoryClass(repository, this));
}
UserRefClass.prototype.loadRepositoriesAsync = loadRepositoriesAsync;
