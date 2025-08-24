import { DataSource } from 'typeorm';
import { seedAdmin } from './admin.seed';
import { seedClients } from './clients.seed';
import { seedVendors } from './vendors.seed';
import { seedProjects } from './projects.seed';
import { seedDocuments } from './documents.seed';
import { User } from '../../users/entity/user.entity';
import { Admin } from '../../admins/entity/admin.entity';
import { Client } from '../../clients/entity/clients.entity';
import { Project } from '../../projects/entity/project.entity';
import { Vendor } from '../../vendors/entity/vendor.entity';
import { Match } from '../../matches/entity/match.entity';

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'expanders360',
    entities: [User, Admin, Client, Project, Vendor, Match],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected for seeding');

    // Quick check if data already exists
    const userRepository = dataSource.getRepository(User);
    const existingUsers = await userRepository.count();

    if (existingUsers > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('=== Seeding Database ===');

    await seedAdmin(dataSource);
    await seedVendors(dataSource);
    await seedClients(dataSource);
    await seedProjects(dataSource);

    // Seed MongoDB documents
    await seedDocuments();

    console.log('=== Seeding completed ===');
    console.log('Login: admin@expanders360.com / admin123456');
    console.log('Client: john.smith@techcorp.com / client123456');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  runSeeds();
}
