import * as IORedis from 'ioredis';
import { RedisClusterProvider } from './cluster.provider';
import { RedisClusterModuleOptions } from './cluster.interface';
export declare class RedisClusterService {
    private readonly provider;
    private readonly options;
    constructor(provider: RedisClusterProvider, options: RedisClusterModuleOptions | RedisClusterModuleOptions[]);
    getCluster(name?: string): IORedis.Cluster;
    getClusters(): Map<string, IORedis.Cluster>;
    disconnectAllClients(): void;
}
