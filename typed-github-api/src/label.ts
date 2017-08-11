import * as apiTypes from "./api-interfaces";
import { GitHubRef, OptionsOrRef } from "./github-ref";

import { Label } from "./interfaces/label";


export class LabelClass extends GitHubRef implements Label {
  public id: number;
  public name: string;
  public color: string;
  public default: boolean;

  public constructor(data: apiTypes.Label, options: OptionsOrRef) {
    super(options);
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.default = data.default;
  }
}
