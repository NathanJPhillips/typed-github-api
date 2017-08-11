export interface Team {
  id: number;
  url: string;
  name: string;
  slug: string;
  description: string;
  privacy: "closed";
  permission: "admin";
  members_url: string;
  repositories_url: string;
}
