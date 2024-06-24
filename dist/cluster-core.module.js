"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ClusterCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterCoreModule = void 0;
const common_1 = require("@nestjs/common");
const cluster_provider_1 = require("./cluster.provider");
const cluster_constants_1 = require("./cluster.constants");
const cluster_service_1 = require("./cluster.service");
let ClusterCoreModule = ClusterCoreModule_1 = class ClusterCoreModule {
    constructor(options, provider) {
        this.options = options;
        this.provider = provider;
    }
    static register(options) {
        return {
            module: ClusterCoreModule_1,
            providers: [
                cluster_provider_1.createCluster(),
                { provide: cluster_constants_1.REDIS_CLUSTER_MODULE_OPTIONS, useValue: options },
            ],
            exports: [cluster_service_1.RedisClusterService],
        };
    }
    static forRootAsync(options) {
        return {
            module: ClusterCoreModule_1,
            imports: options.imports,
            providers: [cluster_provider_1.createCluster(), cluster_provider_1.createAsyncClusterOptions(options)],
            exports: [cluster_service_1.RedisClusterService],
        };
    }
    onApplicationShutdown() {
        const closeConnection = ({ clusters, defaultKey, }) => options => {
            const name = options.name || defaultKey;
            const cluster = clusters.get(name);
            if (cluster && !options.disableDisconnectOnShutdown) {
                cluster.disconnect();
            }
        };
        const closeClusterConnection = closeConnection(this.provider);
        if (Array.isArray(this.options)) {
            this.options.forEach(closeClusterConnection);
        }
        else {
            closeClusterConnection(this.options);
        }
    }
};
ClusterCoreModule = ClusterCoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        providers: [cluster_service_1.RedisClusterService],
        exports: [cluster_service_1.RedisClusterService],
    }),
    __param(0, common_1.Inject(cluster_constants_1.REDIS_CLUSTER_MODULE_OPTIONS)),
    __param(1, common_1.Inject(cluster_constants_1.REDIS_CLUSTER)),
    __metadata("design:paramtypes", [Object, Object])
], ClusterCoreModule);
exports.ClusterCoreModule = ClusterCoreModule;
