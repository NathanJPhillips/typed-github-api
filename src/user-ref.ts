import { GitHubRef, OptionsOrRef } from "./github-ref";
import { RepositoryRef, RepositoryRefCreator } from "./repository-ref";

export class UserRef extends GitHubRef {
  public login: string;

  protected constructor(login: string, options: OptionsOrRef) {
    super(options);
    this.login = login;
  }

  public getRepository(name: string): RepositoryRef {
    return RepositoryRefCreator.create(this, name);
  }
}

export class UserRefCreator extends UserRef {
  private constructor(login: string, options: OptionsOrRef) {
    super(login, options);
  }

  public static create(login: string, options: OptionsOrRef): UserRef {
    return new UserRefCreator(login, options);
    //return new UserRef(login, options);
  }
}
