import { DataSource } from 'typeorm';
import { seedAdmin } from './admin.seed';
import { User } from '../../users/entity/user.entity';
import { Admin } from '../../admins/entity/admin.entity';
import { Client } from '../../clients/entity/clients.entity';

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'expanders360',
    entities: [User, Admin, Client],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected for seeding');

    await seedAdmin(dataSource);

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  runSeeds();
}
