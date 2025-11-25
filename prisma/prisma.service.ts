import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {

    async onModuleInit() {
        await this.$connect();
    }

    // Called when Nest receives SIGINT/SIGTERM (see step 2)
    async onApplicationShutdown(signal?: string) {
        await this.$disconnect(); // safe to call multiple times
    }

}