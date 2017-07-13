import { GitHubRef, OptionsOrRef } from "./github-ref";
import { RepositoryRefClass } from "./repository-ref";

import { Organization, OrganizationRef } from "./interfaces/organization";
import { Repository, RepositoryRef } from "./interfaces/repository";


export class OrganizationRefClass extends GitHubRef implements OrganizationRef {
  public login: string;

  public constructor(login: string, options: OptionsOrRef) {
    super(options);
    this.login = login;
  }

  public getRepository(name: string): RepositoryRef {
    return new RepositoryRefClass(this, name);
  }

  public loadAsync(): Promise<Organization | null> {
    throw new Error("Method not implemented.");
  }

  public loadRepositoriesAsync(
    _type?: "all" | "public" | "private" | "forks" | "sources" | "member" | undefined,
    _sort?: "created" | "updated" | "pushed" | "full_name" | undefined,
    _ascending?: boolean | undefined): Promise<Repository[]>
  {
    throw new Error("Method not implemented.");
  }
}
