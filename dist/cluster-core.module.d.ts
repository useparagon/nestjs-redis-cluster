import { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import { RedisClusterModuleAsyncOptions, RedisClusterModuleOptions } from './cluster.interface';
import { RedisClusterProvider } from './cluster.provider';
export declare class ClusterCoreModule implements OnApplicationShutdown {
    private readonly options;
    private readonly provider;
    constructor(options: RedisClusterModuleOptions | RedisClusterModuleOptions[], provider: RedisClusterProvider);
    static register(options: RedisClusterModuleOptions | RedisClusterModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisClusterModuleAsyncOptions): DynamicModule;
    onApplicationShutdown(): void;
}
