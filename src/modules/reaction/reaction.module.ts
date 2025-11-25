import { Module } from '@nestjs/common';
import { ReactionsController } from './reaction.controller';
import { ReactionsService } from './reaction.service';
import { PrismaService } from 'prisma/prisma.service';


@Module({
    controllers: [ReactionsController],
    providers: [ReactionsService, PrismaService],
})
export class ReactionModule { }
// 