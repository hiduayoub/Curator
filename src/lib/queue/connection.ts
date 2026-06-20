import { type ConnectionOptions } from "bullmq";

import { env } from "../../env";

/**
 * BullMQ connection options derived from `REDIS_URL`.
 *
 * We hand BullMQ plain options (rather than a shared `ioredis` instance) so it
 * owns the lifecycle of its connections and applies the settings its blocking
 * workers require. `maxRetriesPerRequest: null` is mandatory for worker
 * connections — without it BullMQ's blocking commands would time out.
 */
function parseRedisUrl(urlString: string): ConnectionOptions {
  const url = new URL(urlString);

  const options: Record<string, unknown> = {
    host: url.hostname,
    port: url.port ? Number(url.port) : 6379,
    maxRetriesPerRequest: null,
    // Defer the actual TCP connection until the first command so importing the
    // queue (e.g. during `next build`) never tries to reach Redis.
    lazyConnect: true,
  };

  if (url.username) options.username = decodeURIComponent(url.username);
  if (url.password) options.password = decodeURIComponent(url.password);

  const database = url.pathname.replace(/^\//, "");
  if (database.length > 0) options.db = Number(database);

  if (url.protocol === "rediss:") options.tls = {};

  return options as ConnectionOptions;
}

export const redisConnection: ConnectionOptions = parseRedisUrl(env.REDIS_URL);
