import * as apiTypes from "./api-types";
import { Repository, RepositoryCreator } from "./repository";
import { OrganizationRef } from "./organization-ref";
import { Organization, OrganizationCreator } from "./organization";

declare module "./organization-ref" {
  interface OrganizationRef {
    load(): Promise<Organization | null>;

    loadRepositories(
      type?: "all" | "public" | "private" | "forks" | "sources" | "member",
      sort?: "created" | "updated" | "pushed" | "full_name",
      ascending?: boolean): Promise<Repository[]>;
  }
}

OrganizationRef.prototype.load = async function (this: OrganizationRef): Promise<Organization | null> {
  if (this instanceof Organization)
    return this;
  const response = await this.getAsync(`/orgs/${this.login}`);
  return OrganizationCreator.create(response, this);
}

function loadRepositories(
  type?: "all" | "public" | "private" | "forks" | "sources" | "member",
  sort?: "created" | "updated" | "pushed" | "full_name",
  ascending?: boolean): Promise<Repository[]>;
async function loadRepositories(
  this: OrganizationRef,
  type: "all" | "public" | "private" | "forks" | "sources" | "member" = "all",
  sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
  ascending?: boolean): Promise<Repository[]>
{
  if (ascending === undefined)
    ascending = sort === "full_name";
  const response = await this.getAsync(`/orgs/${this.login}/repos?type=${type}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
  return response.map((repository: apiTypes.Repository) => RepositoryCreator.create(repository, this));
}
OrganizationRef.prototype.loadRepositories = loadRepositories;
