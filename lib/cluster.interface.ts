import { ModuleMetadata } from '@nestjs/common/interfaces';
import { ClusterOptions } from 'ioredis';
import * as IORedis from 'ioredis';

export interface RedisClusterModuleOptions extends ClusterOptions {
  /**
   * redis connection name
   */
  name?: string;

  /**
   * redis cluster nodes
   */
  nodes: (string | number | object)[];

  /**
   * callback to execute once cluster is connected & is in ready state
   */
  onClusterReady?(cluster: IORedis.Cluster): Promise<void>;

  /**
   * when `true`, doesn't close the redis connections on app shutdown, instead
   * delegates connection closure responsibility to the consumer via clusterService#disconnectAllClients
   */
  disableDisconnectOnShutdown?: boolean;
}

export interface RedisClusterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisClusterModuleOptions
    | RedisClusterModuleOptions[]
    | Promise<RedisClusterModuleOptions>
    | Promise<RedisClusterModuleOptions[]>;
  inject?: any[];
}
