import * as IORedis from 'ioredis';
import { Cluster } from 'ioredis';
import * as uuid from 'uuid';
import { Provider } from '@nestjs/common';

import {
  REDIS_CLUSTER,
  REDIS_CLUSTER_MODULE_OPTIONS,
} from './cluster.constants';
import {
  RedisClusterModuleAsyncOptions,
  RedisClusterModuleOptions,
} from './cluster.interface';

export class RedisClusterError extends Error {}
export interface RedisClusterProvider {
  defaultKey: string;
  clusters: Map<string, IORedis.Cluster>;
  size: number;
}

async function getCluster(
  options: RedisClusterModuleOptions,
): Promise<IORedis.Cluster> {
  const { onClusterReady, nodes, ...opt } = options;
  const cluster: IORedis.Cluster = new Cluster(nodes, opt);

  if (onClusterReady) {
    onClusterReady(cluster);
  }

  return cluster;
}

export const createCluster = (): Provider => ({
  provide: REDIS_CLUSTER,
  useFactory: async (
    options: RedisClusterModuleOptions | RedisClusterModuleOptions[],
  ): Promise<RedisClusterProvider> => {
    const clusters: Map<string, IORedis.Cluster> = new Map<
      string,
      IORedis.Cluster
    >();
    let defaultKey = uuid.v4();

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async o => {
          const key: string = o.name || defaultKey;
          if (clusters.has(key)) {
            throw new RedisClusterError(
              `${o.name || 'default'} cluster already exists`,
            );
          }
          clusters.set(key, await getCluster(o));
        }),
      );
    } else {
      if (options.name && options.name.length !== 0) {
        defaultKey = options.name;
      }
      clusters.set(defaultKey, await getCluster(options));
    }

    return {
      defaultKey,
      clusters,
      size: clusters.size,
    };
  },
  inject: [REDIS_CLUSTER_MODULE_OPTIONS],
});

export const createAsyncClusterOptions = (
  options: RedisClusterModuleAsyncOptions,
) => ({
  provide: REDIS_CLUSTER_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});
