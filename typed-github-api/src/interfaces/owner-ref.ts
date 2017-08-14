import { Organization } from "./organization";
import { Repository, RepositoryRef } from "./repository";
import { User } from "./user";

export interface OwnerRef {
  login: string;

  getRepository(name: string): RepositoryRef;

  loadUserAsync(): Promise<User | null>;
  loadOrganizationAsync(): Promise<Organization | null>;

  /**
   * Loads repositories accessible to this user.
   * @param type      The type of search (default owner)
   * @param sort      The field to sort by (default full_name)
   * @param ascending Whether to sort ascending rather than descending (default false unless sorting by full_name)
   * @returns         The resulting array of repositories
   */
  loadRepositoriesAsync(
    type?: "all" | "owner" | "member",
    sort?: "created" | "updated" | "pushed" | "full_name",
    ascending?: boolean): Promise<Repository[]>;

  /**
   * Loads repositories owned by this organisation.
   * @param type      The type of repository to return (default all)
   * @param sort      The field to sort by (default full_name)
   * @param ascending Whether to sort ascending rather than descending (default false unless sorting by full_name)
   * @returns         The resulting array of repositories
   */
  loadOrganizationRepositoriesAsync(
    type?: "all" | "public" | "private" | "forks" | "sources" | "member",
    sort?: "created" | "updated" | "pushed" | "full_name",
    ascending?: boolean): Promise<Repository[]>;
}
