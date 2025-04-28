import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../users/users.entity';
import { Project } from '../projects/projects.entity';
import { Bid } from '../bids/bids.entity';
import { Message } from '../messages/messages.entity';
import { File } from '../files/files.entity';
import { Milestone } from '../milestones/milestones.entity';
import { Invoice } from '../invoices/invoices.entity';
import { Skill } from '../skills/skills.entity';

config(); // Load .env file
const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_NAME', 'freelancerdb'),
  entities: [User, Project, Bid, Message, File, Milestone, Invoice, Skill],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  migrationsRun: false,
});