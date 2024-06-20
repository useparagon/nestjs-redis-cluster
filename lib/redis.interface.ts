import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Redis, RedisOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
  /**
   * redis connection anme
   */
  name?: string;

  /**
   * redis connection url
   */
  url?: string;

  /**
   * callback to execute once client has connected and is in ready state
   */
  onClientReady?(client: Redis): Promise<void>;

  /**
   * when `true`, doesn't close the redis connections on app shutdown, instead
   * delegates connection closure responsibility to the consumer via redisService#disconnectAllClients
   */
  disableDisconnectOnShutdown?: boolean;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisModuleOptions
    | RedisModuleOptions[]
    | Promise<RedisModuleOptions>
    | Promise<RedisModuleOptions[]>;
  inject?: any[];
}
