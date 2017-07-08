import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { RepositoryRef } from "./repository-ref";
import { UserSummary, UserCreator } from "./user";

export class Repository extends RepositoryRef {
  public owner: UserSummary;

  protected constructor(repository: apiTypes.Repository, options: OptionsOrRef) {
    const owner = UserCreator.createSummary(repository.owner, options);
    super(owner, repository.name);
    this.owner = owner;
  }
}

export class RepositoryCreator extends Repository {
  public static create(repository: apiTypes.Repository, options: OptionsOrRef) {
    return new Repository(repository, options);
  }
}
