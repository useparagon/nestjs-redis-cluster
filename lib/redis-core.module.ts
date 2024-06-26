import {
  DynamicModule,
  Global,
  Module,
  Inject,
  OnApplicationShutdown,
} from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import {
  createAsyncClientOptions,
  createClient,
  RedisClient,
} from './redis.provider';

import { REDIS_MODULE_OPTIONS, REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions | RedisModuleOptions[],
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
  ) {}

  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    return {
      module: RedisCoreModule,
      providers: [
        createClient(),
        { provide: REDIS_MODULE_OPTIONS, useValue: options },
      ],
      exports: [RedisService],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [RedisService],
    };
  }

  onApplicationShutdown() {
    const closeConnection = ({ clients, defaultKey }) => options => {
      const name = options.name || defaultKey;
      const client = clients.get(name);

      if (client && !options.keepAlive && !options.disableDisconnectOnShutdown) {
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
