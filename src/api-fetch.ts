import { Codes as HttpStatusCodes } from "blow-http-statuses";
import * as fetchTypes from "node-fetch";
import fetch from "node-fetch";
import * as logger from "winston";


export interface Options {
  userAgent: string;
  oAuthToken?: string;
}

const nextLinkRegExp = /<([^>]+)>; rel="next"/g;

export function getAsync(relativeUri: string, options: Options): Promise<any> {
  return getAbsoluteAsync(getUri(relativeUri), options);
}

export async function getAbsoluteAsync(uri: string, options: Options): Promise<any> {
  logger.verbose(`Getting GitHub URI: ${uri}`);
  const response = await fetch(uri, getRequestInfo("GET", options));
  // Check whether reached rate limit
  if (response.headers.has("X-RateLimit-Remaining") && parseInt(response.headers.get("X-RateLimit-Remaining")) <= 0) {
    const rateLimitReset = new Date(parseInt(response.headers.get("X-RateLimit-Reset"), 10) * 1000);
    logger.info(`GitHub rate limit reached, retrying at ${rateLimitReset.toLocaleTimeString()}`);
    await waitUntil(rateLimitReset);
    return getAbsoluteAsync(uri, options);
  }
  // Check response code
  if (Math.floor(response.status / 100) !== Math.floor(HttpStatusCodes.OK / 100))
    throw new Error("Unexpected status code from GitHub: " + response.statusText);
  // Create result
  const data = await response.json();
  // Get paging information
  const nextLink = response.headers.has("Link") ? nextLinkRegExp.exec(response.headers.get("Link")) : null;
  if (nextLink === null)
    return data;
  else
    return (<any[]>data).concat(await getAbsoluteAsync(nextLink[1], options));
}

function getUri(relativeUri: string) {
  if (relativeUri.length === 0 || relativeUri[0] !== "/")
    relativeUri = "/" + relativeUri;
  return "https://api.github.com" + relativeUri;
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

function waitUntil(when: Date): Promise<void> {
  return new Promise<void>(function (resolve, _reject) {
    setTimeout(() => resolve(), when.getTime() - Date.now());
  });
}
