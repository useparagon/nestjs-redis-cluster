import { Injectable, Inject } from '@nestjs/common';
import * as IORedis from 'ioredis';

import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisClient, RedisClientError } from './redis.provider';
import { RedisModuleOptions } from './redis.interface';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) 
    private readonly redisClient: RedisClient,

    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions | RedisModuleOptions[]
  ) {}

  getClient(name?: string): IORedis.Redis {
    if (!name) {
      name = this.redisClient.defaultKey;
    }
    if (!this.redisClient.clients.has(name)) {
      throw new RedisClientError(`client ${name} does not exist`);
    }
    return this.redisClient.clients.get(name);
  }

  getClients(): Map<string, IORedis.Redis> {
    return this.redisClient.clients;
  }

  disconnectAllClients(): void {
    const closeConnection =
      ({ clients, defaultKey }) =>
      (options: RedisModuleOptions) => {
        const name = options.name || defaultKey;
        const client = clients.get(name) as IORedis.Redis;

        if (client && !options.keepAlive) {
          client.disconnect();
        }
      };

    const closeClientConnection = closeConnection(this.redisClient);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClientConnection);
    } else {
      closeClientConnection(this.options);
    }
  }
}
