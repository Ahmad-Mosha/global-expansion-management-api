import { DataSource } from 'typeorm';
import { seedAdmin } from './admin.seed';
import { seedClients } from './clients.seed';
import { seedVendors } from './vendors.seed';
import { seedProjects } from './projects.seed';
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

    console.log('\n=== Seeding Database ===');

    await seedAdmin(dataSource);
    await seedVendors(dataSource);
    await seedClients(dataSource);
    await seedProjects(dataSource);

    console.log('\n=== All seeds completed successfully ===');
    console.log('\nLogin Credentials:');
    console.log(
      'Admins: admin@expanders360.com, superadmin@expanders360.com, system.admin@expanders360.com',
    );
    console.log('Admin Password: admin123456');
    console.log(
      '\nClients: john.smith@techcorp.com, maria.garcia@globalretail.com, etc.',
    );
    console.log('Client Password: client123456');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  runSeeds();
}
