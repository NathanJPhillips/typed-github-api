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

  public getAsync<T>(uri: string) {
    return fetch.getAsync<T>(uri, this.options);
  }

  public getPreviewAsync<T>(uri: string) {
    const previewOptions = Object.assign({}, this.options);
    previewOptions.version = "thor-preview";
    return fetch.getAsync<T>(uri, previewOptions);
  }

  public getAllPagesAsync<T>(uri: string) {
    return fetch.getAllPagesAsync<T>(uri, this.options);
  }
}
