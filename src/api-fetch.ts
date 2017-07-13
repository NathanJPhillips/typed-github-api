import { Codes as HttpStatusCodes } from "blow-http-statuses";
import * as moment from "moment";
import * as fetchTypes from "node-fetch";
import fetch from "node-fetch";
import * as logger from "winston";


export interface Options {
  userAgent: string;
  oAuthToken?: string;
}

export interface Response<T> {
  data: T;
  nextLink?: string;
}

const nextLinkRegExp = /<([^>]+)>; rel="next"/;

export async function getAsync<T>(uri: string, options: Options): Promise<Response<T> | null> {
  uri = getUri(uri);
  logger.verbose(`Getting GitHub URI: ${uri}`);
  const response = await fetch(uri, getRequestInfo("GET", options));
  // Check whether reached rate limit
  if (response.headers.has("X-RateLimit-Remaining") && parseInt(response.headers.get("X-RateLimit-Remaining"), 10) <= 0) {
    const rateLimitReset = moment(parseInt(response.headers.get("X-RateLimit-Reset"), 10) * 1000);
    logger.info(`GitHub rate limit reached, retrying at ${rateLimitReset.format("LTS")}`);
    await waitUntil(rateLimitReset);
    return getAsync<T>(uri, options);
  }
  // Check response code
  if (response.status === HttpStatusCodes.NotFound)
    return null;
  if (response.status === HttpStatusCodes.Unauthorized) {
    if (options.oAuthToken)
      throw new Error("Your token does not have permissions to view the requested resource");
    else
      throw new Error("You need to provide login credentials to view the requested resource");
  }
  if (Math.floor(response.status / 100) !== Math.floor(HttpStatusCodes.OK / 100))
    throw new Error("Unexpected status code from GitHub: " + response.statusText);
  // Create result
  const result: Response<T> = { data: await response.json() };
  // Get paging information
  const nextLink = response.headers.has("Link") ? nextLinkRegExp.exec(response.headers.get("Link")) : null;
  if (nextLink !== null)
    result.nextLink = nextLink[1];
  return result;
}

export async function getAllPagesAsync<T>(uri: string, options: Options): Promise<T[] | null> {
  const response: Response<T[]> | null = await getAsync<T[]>(uri, options);
  if (response === null)
    return null;
  if (!response.nextLink)
    return response.data;
  const remainingResponse = await getAllPagesAsync<T>(response.nextLink, options);
  if (remainingResponse === null)
    throw new Error("Subsequent page of GitHub request returned not found.");
  return response.data.concat(remainingResponse);
}

function getUri(uri: string) {
  if (uri.startsWith("http"))
    return uri;
  if (uri.length === 0 || uri[0] !== "/")
    uri = "/" + uri;
  return "https://api.github.com" + uri;
}

function getRequestInfo(method: string, options: Options): fetchTypes.RequestInit {
  const headers = new fetchTypes.Headers();
  headers.set("User-Agent", options.userAgent);
  headers.set("Accept", "application/vnd.github.v3+json");
  if (options.oAuthToken)
    headers.set("Authorization", "token " + options.oAuthToken);
  return {
    method: method,
    headers: headers,
  };
}

function waitUntil(when: moment.Moment): Promise<void> {
  const delay = when.diff(moment());
  if (delay <= 0)
    return Promise.resolve();
  else
    return new Promise<void>(function (resolve) { setTimeout(() => resolve(), delay); });
}
