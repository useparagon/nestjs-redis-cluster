import * as IORedis from 'ioredis';
import { RedisClusterProvider } from './cluster.provider';
export declare class RedisClusterService {
    private readonly provider;
    constructor(provider: RedisClusterProvider);
    getCluster(name?: string): IORedis.Cluster;
    getClusters(): Map<string, IORedis.Cluster>;
}
