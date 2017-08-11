import * as moment from "moment";

import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { OrganizationRefClass } from "./organization-ref";

import { MyOrganization, Organization, OrganizationSummary } from "./interfaces/organization";

export class OrganizationSummaryClass extends OrganizationRefClass implements OrganizationSummary {
  public id: number;
  public avatarUri: string;
  public description: string;

  public constructor(data: apiTypes.OrganizationSummary, options: OptionsOrRef) {
    super(data.login, options);
    this.id = data.id;
    this.avatarUri = data.avatar_url;
    this.description = data.description;
  }
}

export class OrganizationClass extends OrganizationSummaryClass implements Organization {
  public name: string;
  public company: string;
  public blog: string;
  public location: string;
  public email: string;
  public publicRepos: number;
  public publicGists: number;
  public followers: number;
  public following: number;
  public createdAt: moment.Moment;
  public updatedAt: moment.Moment;
  public htmlUri: string;
  public hasOrganizationProjects: boolean;
  public hasRepositoryProjects: boolean;

  public constructor(data: apiTypes.Organization, options: OptionsOrRef) {
    super(data, options);
    this.name = data.name;
    this.company = data.company;
    this.blog = data.blog;
    this.location = data.location;
    this.email = data.email;
    this.publicRepos = data.public_repos;
    this.publicGists = data.public_gists;
    this.followers = data.followers;
    this.following = data.following;
    this.createdAt = moment(data.created_at);
    this.updatedAt = moment(data.updated_at);
    this.htmlUri = data.html_url;
    this.hasOrganizationProjects = data.has_organization_projects;
    this.hasRepositoryProjects = data.has_repository_projects;
  }
}

export class MyOrganizationClass extends OrganizationClass implements MyOrganization {
  public privateReposTotal: number;
  public privateReposOwned: number;
  public privateGists: number;
  public diskUsage: number;
  public collaborators: number;
  public plan: {
    name: string;
    space: number;
    privateRepos: number;
    collaborators: number;
  };
  public billingEmail: string;
  public defaultRepositorySettings: string;
  public membersCanCreateRepositories: boolean;

  public constructor(data: apiTypes.PrivateOrganization, options: OptionsOrRef) {
    super(data, options);
    this.privateReposTotal = data.total_private_repos;
    this.privateReposOwned = data.owned_private_repos;
    this.privateGists = data.private_gists;
    this.diskUsage = data.disk_usage;
    this.collaborators = data.collaborators;
    this.plan = {
      name: data.plan.name,
      space: data.plan.space,
      privateRepos: data.plan.private_repos,
      collaborators: data.plan.collaborators,
    };
    this.billingEmail = data.billing_email;
    this.defaultRepositorySettings = data.default_repository_settings;
    this.membersCanCreateRepositories = data.members_can_create_repositories;
  }
}
