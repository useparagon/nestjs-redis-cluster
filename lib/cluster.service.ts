import { Injectable, Inject } from '@nestjs/common';
import * as IORedis from 'ioredis';

import { REDIS_CLUSTER, REDIS_CLUSTER_MODULE_OPTIONS } from './cluster.constants';
import { RedisClusterProvider, RedisClusterError } from './cluster.provider';
import { RedisClusterModuleOptions } from './cluster.interface';

@Injectable()
export class RedisClusterService {
  constructor(
    @Inject(REDIS_CLUSTER)
    private readonly provider: RedisClusterProvider,

    @Inject(REDIS_CLUSTER_MODULE_OPTIONS)
    private readonly options: RedisClusterModuleOptions | RedisClusterModuleOptions[],
  ) {}

  getCluster(name?: string): IORedis.Cluster {
    if (!name) {
      name = this.provider.defaultKey;
    }

    if (!this.provider.clusters.has(name)) {
      throw new RedisClusterError(`cluster ${name} does not exist`);
    }
    return this.provider.clusters.get(name);
  }

  getClusters(): Map<string, IORedis.Cluster> {
    return this.provider.clusters;
  }

  disconnectAllClients(): void {
    const closeConnection =
      ({ clusters, defaultKey }: RedisClusterProvider) =>
      (options: RedisClusterModuleOptions) => {
        const name = options.name || defaultKey;
        const cluster: IORedis.Cluster = clusters.get(name) as IORedis.Cluster;

        if (cluster) {
          cluster.disconnect();
        }
      };

    const closeClusterConnection = closeConnection(this.provider);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClusterConnection);
    } else {
      closeClusterConnection(this.options);
    }
  }
}
