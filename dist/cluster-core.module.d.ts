import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { RedisClusterModuleAsyncOptions, RedisClusterModuleOptions } from './cluster.interface';
import { RedisClusterProvider } from './cluster.provider';
export declare class ClusterCoreModule implements OnModuleDestroy {
    private readonly options;
    private readonly provider;
    constructor(options: RedisClusterModuleOptions | RedisClusterModuleOptions[], provider: RedisClusterProvider);
    static register(options: RedisClusterModuleOptions | RedisClusterModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisClusterModuleAsyncOptions): DynamicModule;
    onModuleDestroy(): void;
}
