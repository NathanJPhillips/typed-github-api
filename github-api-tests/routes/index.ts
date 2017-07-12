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

export default router;
