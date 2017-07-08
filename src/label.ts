import * as apiTypes from "./api-types";
import { GitHubRef, OptionsOrRef } from "./github-ref";

export class Label extends GitHubRef {
  public id: number;
  public name: string;
  public color: string;
  public default: boolean;

  protected constructor(data: apiTypes.Label, options: OptionsOrRef) {
    super(options);
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.default = data.default;
  }
}

export class LabelCreator extends Label {
  public static create(data: null, options: OptionsOrRef): null;
  public static create(data: apiTypes.Label, options: OptionsOrRef): Label;
  public static create(data: apiTypes.Label | null, options: OptionsOrRef) {
    if (data === null)
      return null;
    return new Label(data, options);
  }
}
