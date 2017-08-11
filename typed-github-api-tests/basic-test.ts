const bodyParser = require("body-parser");
import * as express from "express";
import * as gitHubApi from "typed-github-api";
import GitHubApi, { RequestWithRawBody } from "typed-github-api";

const app = express();
const gitHub = new GitHubApi({ userAgent: "My Client/1.0.0", oAuthToken: process.env.gitHubAccessToken });
const issueWebHook = new gitHubApi.IssueWebHook(process.env.gitHubWebHookSecret, gitHub);

// Configure app to let us get the data from a POST
app.use(bodyParser.json({
  verify: function (req: RequestWithRawBody, _res: express.Response, buf: Uint8Array, _encoding: string) {
    req.rawBody = buf;
  },
}));

app.use("/webhooks/github/issue", issueWebHook.router);

issueWebHook.registerAsyncHandler(
  async function (data: gitHubApi.IssueWebHookData) {
    const issue = data.issue;
    console.log(`Issue #${issue.number} created at ${issue.created} and closed at ${issue.closed}`);
  });

app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"));
