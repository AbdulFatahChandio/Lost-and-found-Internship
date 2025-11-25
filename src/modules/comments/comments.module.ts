import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CommentsService } from './comments.service';


@Module({
    controllers: [CommentsController],
    providers: [CommentsService, PrismaService],
})
export class CommentModule { }
