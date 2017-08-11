import { Codes as HttpStatusCodes } from "blow-http-statuses";
const bodyParser = require("body-parser");
import express = require("express");
import { RequestWithRawBody } from "typed-github-api";
import path = require("path");
import * as logger from "winston";

import routes from "./routes/index";
import { issueWebHook } from "./web-hooks/issues";

const app = express();

// Configure app to let us get the data from a POST
app.use(bodyParser.json({
  verify: function (req: RequestWithRawBody, _res: express.Response, buf: Uint8Array, _encoding: string) {
    req.rawBody = buf;
  },
}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/webhooks/github/issue", issueWebHook.router);

// catch 404 and forward to error handler
app.use(function (_req: express.Request, _res: express.Response, next) {
  const err: any = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err: any, _req: express.Request, res, _next) => {
    res.status(err.status || HttpStatusCodes.InternalServerError);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, _req: express.Request, res, _next) => {
  res.status(err.status || HttpStatusCodes.InternalServerError);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), function () {
  logger.info(`Express server listening on port ${server.address().port}`);
});
