import * as fetch from "./api-fetch";

export type OptionsOrRef = fetch.Options | GitHubRef;

export class GitHubRef {
  protected readonly options: fetch.Options;

  protected constructor(options: OptionsOrRef) {
    if (options instanceof GitHubRef)
      this.options = options.options;
    else
      this.options = options;
  }

  public getAsync(relativeUri: string) {
    return fetch.getAsync(relativeUri, this.options);
  }

  protected getAbsoluteAsync(uri: string) {
    return fetch.getAbsoluteAsync(uri, this.options);
  }
}
