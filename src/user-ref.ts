import { GitHubRef, OptionsOrRef } from "./github-ref";
import { RepositoryRefClass } from "./repository-ref";

import { Repository, RepositoryRef } from "./interfaces/repository";
import { User, UserRef } from "./interfaces/user";


export class UserRefClass extends GitHubRef implements UserRef {
  public login: string;

  public constructor(login: string, options: OptionsOrRef) {
    super(options);
    this.login = login;
  }

  public getRepository(name: string): RepositoryRef {
    return new RepositoryRefClass(this, name);
  }

  public loadAsync(): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  public loadRepositoriesAsync(
    _type?: "all" | "owner" | "member" | undefined,
    _sort?: "created" | "updated" | "pushed" | "full_name" | undefined,
    _ascending?: boolean | undefined): Promise<Repository[]>
  {
    throw new Error("Method not implemented.");
  }
}
