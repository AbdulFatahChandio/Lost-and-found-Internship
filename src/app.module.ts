import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comments/comments.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { MatchingModule } from './modules/matching/matching.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    ClsModule.forRoot({ middleware: { mount: true }, }),
    AuthModule,
    PostModule,
    CommentModule,
    ReactionModule,
    MatchingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
