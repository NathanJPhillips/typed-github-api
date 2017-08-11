import { GitHubRef } from "./github-ref";
import { RepositoryRefClass } from "./repository-ref";

import { Branch, BranchRef } from "./interfaces/branch";


export class BranchRefClass extends GitHubRef implements BranchRef {
  public readonly repository: RepositoryRefClass;
  public readonly name: string;

  public constructor(repository: RepositoryRefClass, name: string) {
    super(repository);
    this.repository = repository;
    this.name = name;
  }

  public loadAsync(): Promise<Branch | null> {
    throw new Error("Method not implemented.");
  }
}
