import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { OrganizationRef } from "./organization-ref";


export class OrganizationSummary extends OrganizationRef {
  protected constructor(data: apiTypes.OrganizationSummary, options: OptionsOrRef) {
    super(data.login, options);
  }
}

export class Organization extends OrganizationSummary {
  protected constructor(data: apiTypes.Organization, options: OptionsOrRef) {
    super(data, options);
  }
}

export class OrganizationCreator extends Organization {
  public static createSummary(data: apiTypes.OrganizationSummary, options: OptionsOrRef): OrganizationSummary {
    return new OrganizationSummary(data, options);
  }

  public static create(data: apiTypes.Organization, options: OptionsOrRef): Organization {
    return new Organization(data, options);
  }
}
