import { Codes as HttpStatusCodes } from "blow-http-statuses";
import express = require("express");
const router = express.Router();

import { gitHub } from "../github";

router.get("/", async (_req: express.Request, res: express.Response) => {
  res.render("index");
});

router.get("/repos", async (_req: express.Request, res: express.Response) => {
  try {
    const repos = await gitHub.loadMyRepositoriesAsync("all");
    res.render("repos", { title: "Repositories", repos: repos });
  } catch (err) {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  }
});

router.get("/repos/:owner/:repo", async (req: express.Request, res: express.Response) => {
  try {
    const repo = await gitHub.getUser(req.params.owner).getRepository(req.params.repo).loadAsync();
    if (repo === null)
      throw { status: HttpStatusCodes.NotFound, message: "Repository not found" };
    res.render("repo", { title: `${repo.fullName} - Repositories`, repo: repo });
  } catch (err) {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  }
});

router.get("/repos/:owner/:repo/commits", async (req: express.Request, res: express.Response) => {
  try {
    const repo = await gitHub.getUser(req.params.owner).getRepository(req.params.repo).loadAsync();
    if (repo === null)
      throw { status: HttpStatusCodes.NotFound, message: "Repository not found" };
    const commits = await repo.loadCommitsAsync();
    res.render("commits", { title: `Commits - ${repo.fullName} - Repositories`, repo: repo, commits: commits });
  } catch (err) {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  }
});

router.get("/repos/:owner/:repo/commits/:sha", async (req: express.Request, res: express.Response) => {
  try {
    const repo = await gitHub.getUser(req.params.owner).getRepository(req.params.repo).loadAsync();
    if (repo === null)
      throw { status: HttpStatusCodes.NotFound, message: "Repository not found" };
    const commit = await repo.getCommit(req.params.sha).loadAsync();
    if (commit === null)
      throw { status: HttpStatusCodes.NotFound, message: "Commit not found" };
    res.render("commit", { title: `${commit.sha} - Commits - ${repo.fullName} - Repositories`, repo: repo, commit: commit });
  } catch (err) {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  }
});

router.get("/repos/:owner/:repo/issues", async (req: express.Request, res: express.Response) => {
  try {
    const repo = await gitHub.getUser(req.params.owner).getRepository(req.params.repo).loadAsync();
    if (repo === null)
      throw { status: HttpStatusCodes.NotFound, message: "Repository not found" };
    const issues = await repo.loadIssuesAsync("none", "all");
    res.render("issues", { title: `Issues - ${repo.fullName} - Repositories`, repo: repo, issues: issues });
  } catch (err) {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  }
});

router.get("/repos/:owner/:repo/issues/:number", async (req: express.Request, res: express.Response) => {
  try {
    const repo = await gitHub.getUser(req.params.owner).getRepository(req.params.repo).loadAsync();
    if (repo === null)
      throw { status: HttpStatusCodes.NotFound, message: "Repository not found" };
    const issue = await repo.getIssue(req.params.number).loadAsync();
    if (issue === null)
      throw { status: HttpStatusCodes.NotFound, message: "Issue not found" };
    res.render("issue", { title: `#${issue.number} - Issues - ${repo.fullName} - Repositories`, repo: repo, issue: issue });
  } catch (err) {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  }
});

router.get("/repos/:owner/:repo/pull-requests", async (req: express.Request, res: express.Response) => {
  try {
    const repo = await gitHub.getUser(req.params.owner).getRepository(req.params.repo);
    const pullRequests = await repo.loadPullRequestsAsync("all");
    const repository = pullRequests.length !== 0 ? pullRequests[0].base.repository : await repo.loadAsync();
    if (repository === null)
      throw { status: HttpStatusCodes.NotFound, message: "Repository not found" };
    res.render("pull-requests", { title: `Pull Requests - ${repository.fullName} - Repositories`, repo: repository, pullRequests: pullRequests });
  } catch (err) {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  }
});

router.get("/repos/:owner/:repo/pull-requests/:number", async (req: express.Request, res: express.Response) => {
  try {
    const repo = await gitHub.getUser(req.params.owner).getRepository(req.params.repo);
    const pullRequest = await repo.getPullRequest(req.params.number).loadAsync();
    if (pullRequest === null)
      throw { status: HttpStatusCodes.NotFound, message: "Pull Request not found" };
    const repository = pullRequest.base.repository;
    res.render("pull-request",
      {
        title: `#${pullRequest.number} - Pull Requests - ${repository.fullName} - Repositories`,
        repo: repository,
        pullRequest: pullRequest,
        reviews: await pullRequest.loadReviewsAsync(),
        reviewRequests: await pullRequest.loadReviewRequestsAsync(),
        reviewRequestsWithTeams: await pullRequest.loadReviewRequestsIncludingTeamsPreviewAsync(),
      });
  } catch (err) {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  }
});

export default router;
