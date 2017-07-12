import * as apiTypes from "./api-types";
import { Repository, RepositoryCreator } from "./repository";
import { OrganizationRef } from "./organization-ref";
import { Organization, OrganizationCreator } from "./organization";

declare module "./organization-ref" {
  interface OrganizationRef {
    loadAsync(): Promise<Organization | null>;

    /**
     * @description Loads repositories owned by this organisation.
     * @param type The type of repository to return (default all)
     * @param sort The field to sort by (default full_name)
     * @param ascending Whether to sort ascending rather than descending (default false unless sorting by full_name)
     * @return The resulting array of repositories
     */
    loadRepositoriesAsync(
      type?: "all" | "public" | "private" | "forks" | "sources" | "member",
      sort?: "created" | "updated" | "pushed" | "full_name",
      ascending?: boolean): Promise<Repository[]>;
  }
}

OrganizationRef.prototype.loadAsync = async function (this: OrganizationRef): Promise<Organization | null> {
  if (this instanceof Organization)
    return this;
  const response = await this.getAsync<apiTypes.Organization>(`/orgs/${this.login}`);
  if (response === null)
    return null;
  return OrganizationCreator.create(response.data, this);
}

function loadRepositoriesAsync(
  type?: "all" | "public" | "private" | "forks" | "sources" | "member",
  sort?: "created" | "updated" | "pushed" | "full_name",
  ascending?: boolean): Promise<Repository[]>;
async function loadRepositoriesAsync(
  this: OrganizationRef,
  type: "all" | "public" | "private" | "forks" | "sources" | "member" = "all",
  sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
  ascending?: boolean): Promise<Repository[]>
{
  if (ascending === undefined)
    ascending = sort === "full_name";
  const response = await this.getAllPagesAsync<apiTypes.Repository>(`/orgs/${this.login}/repos?type=${type}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
  if (response === null)
    throw new Error("Could not load repositories; organization may not exist");
  return response.map((repository) => RepositoryCreator.create(repository, this));
}
OrganizationRef.prototype.loadRepositoriesAsync = loadRepositoriesAsync;
