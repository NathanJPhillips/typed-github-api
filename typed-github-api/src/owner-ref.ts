import { GitHubRef, OptionsOrRef } from "./github-ref";
import { RepositoryRefClass } from "./repository-ref";

import { Organization } from "./interfaces/organization";
import { OwnerRef } from "./interfaces/owner-ref";
import { Repository, RepositoryRef } from "./interfaces/repository";
import { User } from "./interfaces/user";


export class OwnerRefClass extends GitHubRef implements OwnerRef {
  public login: string;

  public constructor(login: string, options: OptionsOrRef) {
    super(options);
    this.login = login;
  }

  public getRepository(name: string): RepositoryRef {
    return new RepositoryRefClass(this, name);
  }

  public loadUserAsync(): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  public loadOrganizationAsync(): Promise<Organization | null> {
    throw new Error("Method not implemented.");
  }

  public loadRepositoriesAsync(
    _type?: "all" | "owner" | "member" | undefined,
    _sort?: "created" | "updated" | "pushed" | "full_name" | undefined,
    _ascending?: boolean | undefined): Promise<Repository[]>
  {
    throw new Error("Method not implemented.");
  }

  public loadOrganizationRepositoriesAsync(
    _type?: "all" | "public" | "private" | "forks" | "sources" | "member" | undefined,
    _sort?: "created" | "updated" | "pushed" | "full_name" | undefined,
    _ascending?: boolean | undefined): Promise<Repository[]>
  {
    throw new Error("Method not implemented.");
  }
}
