import GitHubApi from "typed-github-api";

export const gitHub = new GitHubApi({ userAgent: "My Client/1.0.0", oAuthToken: process.env.gitHubAccessToken });
