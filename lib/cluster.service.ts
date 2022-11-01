import { Injectable, Inject } from '@nestjs/common';
import * as IORedis from 'ioredis';

import { REDIS_CLUSTER } from './cluster.constants';
import { RedisClusterProvider, RedisClusterError } from './cluster.provider';

@Injectable()
export class RedisClusterService {
  constructor(
    @Inject(REDIS_CLUSTER) private readonly provider: RedisClusterProvider,
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
}
