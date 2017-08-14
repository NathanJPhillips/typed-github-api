import * as apiTypes from "./api-interfaces";
import { OrganizationClass } from "./organization";
import { OwnerRefClass } from "./owner-ref";
import { RepositoryClass } from "./repository";
import { UserClass } from "./user";

import { Organization } from "./interfaces/organization";
import { Repository } from "./interfaces/repository";
import { User } from "./interfaces/user";


OwnerRefClass.prototype.loadUserAsync = async function (this: OwnerRefClass): Promise<User | null> {
  if (this instanceof UserClass)
    return <UserClass>this;
  const response = await this.getAsync<apiTypes.User>(`/users/${encodeURIComponent(this.login)}`);
  if (response === null)
    return null;
  return new UserClass(response.data, this);
};

OwnerRefClass.prototype.loadOrganizationAsync = async function (this: OwnerRefClass): Promise<Organization | null> {
  if (this instanceof OrganizationClass)
    return <OrganizationClass>this;
  const response = await this.getAsync<apiTypes.Organization>(`/orgs/${encodeURIComponent(this.login)}`);
  if (response === null)
    return null;
  return new OrganizationClass(response.data, this);
};

function loadRepositoriesAsync(
  type?: "all" | "owner" | "member",
  sort?: "created" | "updated" | "pushed" | "full_name",
  ascending?: boolean): Promise<Repository[]>;
async function loadRepositoriesAsync(
  this: OwnerRefClass,
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
OwnerRefClass.prototype.loadRepositoriesAsync = loadRepositoriesAsync;

function loadOrganizationRepositoriesAsync(
  type?: "all" | "public" | "private" | "forks" | "sources" | "member",
  sort?: "created" | "updated" | "pushed" | "full_name",
  ascending?: boolean): Promise<Repository[]>;
async function loadOrganizationRepositoriesAsync(
  this: OwnerRefClass,
  type: "all" | "public" | "private" | "forks" | "sources" | "member" = "all",
  sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
  ascending?: boolean): Promise<Repository[]> {
  if (ascending === undefined)
    ascending = sort === "full_name";
  const response = await this.getAllPagesAsync<apiTypes.Repository>(
    `/orgs/${encodeURIComponent(this.login)}/repos?type=${type}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
  if (response === null)
    throw new Error("Could not load repositories; organization may not exist");
  return response.map((repository) => new RepositoryClass(repository, this));
}
OwnerRefClass.prototype.loadOrganizationRepositoriesAsync = loadOrganizationRepositoriesAsync;
