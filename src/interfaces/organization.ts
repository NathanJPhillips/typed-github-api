import { Repository, RepositoryRef } from "./repository";

export interface OrganizationRef {
  login: string;

  getRepository(name: string): RepositoryRef;

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

export interface OrganizationSummary extends OrganizationRef {
}

export interface Organization extends OrganizationSummary {
}
