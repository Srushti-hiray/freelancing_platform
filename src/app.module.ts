import { Module, ValidationPipe ,MiddlewareConsumer} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { BidsModule } from './bids/bids.module';
import { MessagesModule } from './messages/messages.module';
import { FilesModule } from './files/files.module';
import { MilestonesModule } from './milestones/milestones.module';
import { InvoicesModule } from './invoices/invoices.module';
import { SkillsModule } from './skills/skills.module';
import { User } from './users/users.entity';
import { Project } from './projects/projects.entity';
import { Bid } from './bids/bids.entity';
import { Message } from './messages/messages.entity';
import { File } from './files/files.entity';
import { Milestone } from './milestones/milestones.entity';
import { Invoice } from './invoices/invoices.entity';
import { Skill } from './skills/skills.entity';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import * as cors from 'cors';
import 'reflect-metadata';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'freelancerdb'),
        entities: [User, Project, Bid, Message, File, Milestone, Invoice, Skill],
        migrations: [__dirname + '/database/migrations/*.ts'],
        migrationsRun: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    BidsModule,
    MessagesModule,
    FilesModule,
    MilestonesModule,
    InvoicesModule,
    SkillsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  configure(consumer:MiddlewareConsumer) {
   // consumer.apply(cors({ origin: 'http://localhost:3001' })).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
   //consumer.apply(RateLimiterMiddleware).forRoutes('*');
  }
}