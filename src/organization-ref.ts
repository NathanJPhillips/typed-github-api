import { GitHubRef, OptionsOrRef } from "./github-ref";
import { RepositoryRef, RepositoryRefCreator } from "./repository-ref";

export class OrganizationRef extends GitHubRef {
  public login: string;

  protected constructor(login: string, options: OptionsOrRef) {
    super(options);
    this.login = login;
  }

  public getRepository(name: string): RepositoryRef {
    return RepositoryRefCreator.create(this, name);
  }
}

export class OrganizationRefCreator extends OrganizationRef {
  private constructor(login: string, options: OptionsOrRef) {
    super(login, options);
  }

  public static create(login: string, options: OptionsOrRef): OrganizationRef {
    return new OrganizationRefCreator(login, options);
    //return new OrganizationRef(login, options);
  }
}
