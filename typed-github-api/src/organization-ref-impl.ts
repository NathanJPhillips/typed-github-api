import * as apiTypes from "./api-interfaces";
import { OrganizationClass } from "./organization";
import { OrganizationRefClass } from "./organization-ref";
import { RepositoryClass } from "./repository";

import { Organization } from "./interfaces/organization";
import { Repository } from "./interfaces/repository";


OrganizationRefClass.prototype.loadAsync = async function (this: OrganizationRefClass): Promise<Organization | null> {
  if (this instanceof OrganizationClass)
    return <OrganizationClass>this;
  const response = await this.getAsync<apiTypes.Organization>(`/orgs/${encodeURIComponent(this.login)}`);
  if (response === null)
    return null;
  return new OrganizationClass(response.data, this);
};

function loadRepositoriesAsync(
  type?: "all" | "public" | "private" | "forks" | "sources" | "member",
  sort?: "created" | "updated" | "pushed" | "full_name",
  ascending?: boolean): Promise<Repository[]>;
async function loadRepositoriesAsync(
  this: OrganizationRefClass,
  type: "all" | "public" | "private" | "forks" | "sources" | "member" = "all",
  sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
  ascending?: boolean): Promise<Repository[]>
{
  if (ascending === undefined)
    ascending = sort === "full_name";
  const response = await this.getAllPagesAsync<apiTypes.Repository>(
    `/orgs/${encodeURIComponent(this.login)}/repos?type=${type}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
  if (response === null)
    throw new Error("Could not load repositories; organization may not exist");
  return response.map((repository) => new RepositoryClass(repository, this));
}
OrganizationRefClass.prototype.loadRepositoriesAsync = loadRepositoriesAsync;
