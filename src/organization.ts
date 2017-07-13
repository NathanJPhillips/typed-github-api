import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { OrganizationRefClass } from "./organization-ref";

import { Organization, OrganizationSummary } from "./interfaces/organization";

export class OrganizationSummaryClass extends OrganizationRefClass implements OrganizationSummary {
  public constructor(data: apiTypes.OrganizationSummary, options: OptionsOrRef) {
    super(data.login, options);
  }
}

export class OrganizationClass extends OrganizationSummaryClass implements Organization {
  public constructor(data: apiTypes.Organization, options: OptionsOrRef) {
    super(data, options);
  }
}
