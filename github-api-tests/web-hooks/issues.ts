import * as gitHubApi from "typed-github-api";

import { gitHub } from "../github";

export const issueWebHook = new gitHubApi.IssueWebHook(process.env.gitHubWebHookSecret, gitHub);

issueWebHook.registerAsyncHandler(
  async function (data: gitHubApi.IssueWebHookData) {
    const issue = data.issue;
    console.log(`Issue #${issue.number} created at ${issue.created} and closed at ${issue.closed}`);
  });
