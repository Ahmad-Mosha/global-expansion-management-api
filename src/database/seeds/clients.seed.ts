import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../users/entity/user.entity';
import { Client } from '../../clients/entity/clients.entity';

export async function seedClients(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const clientRepository = dataSource.getRepository(Client);

  // Check if clients already exist
  const existingClients = await clientRepository.count();
  if (existingClients > 0) {
    console.log('Clients already exist, skipping seed');
    return;
  }

  const clientsData = [
    {
      email: 'john.smith@techcorp.com',
      password: 'client123456',
      company_name: 'TechCorp Industries',
      contact_email: 'expansion@techcorp.com',
    },
    {
      email: 'maria.garcia@globalretail.com',
      password: 'client123456',
      company_name: 'Global Retail Solutions',
      contact_email: 'international@globalretail.com',
    },
    {
      email: 'david.chen@innovatesoft.com',
      password: 'client123456',
      company_name: 'InnovateSoft Ltd',
      contact_email: 'business@innovatesoft.com',
    },
    {
      email: 'sarah.johnson@healthplus.com',
      password: 'client123456',
      company_name: 'HealthPlus Medical',
      contact_email: 'expansion@healthplus.com',
    },
    {
      email: 'ahmed.hassan@financegroup.com',
      password: 'client123456',
      company_name: 'Finance Group International',
      contact_email: 'global@financegroup.com',
    },
    {
      email: 'lisa.mueller@autoparts.de',
      password: 'client123456',
      company_name: 'AutoParts Europe GmbH',
      contact_email: 'expansion@autoparts.de',
    },
    {
      email: 'hiroshi.tanaka@manufacturing.jp',
      password: 'client123456',
      company_name: 'Tanaka Manufacturing Co',
      contact_email: 'international@manufacturing.jp',
    },
    {
      email: 'emma.wilson@ecommerce.co.uk',
      password: 'client123456',
      company_name: 'E-Commerce Solutions UK',
      contact_email: 'global@ecommerce.co.uk',
    },
    {
      email: 'carlos.rodriguez@logistics.mx',
      password: 'client123456',
      company_name: 'Rodriguez Logistics',
      contact_email: 'expansion@logistics.mx',
    },
    {
      email: 'anna.kowalski@consulting.pl',
      password: 'client123456',
      company_name: 'Kowalski Consulting Group',
      contact_email: 'business@consulting.pl',
    },
  ];

  const hashedPassword = await bcrypt.hash('client123456', 12);

  for (const clientData of clientsData) {
    // Create user
    const user = userRepository.create({
      email: clientData.email,
      password: hashedPassword,
      role: UserRole.CLIENT,
    });

    const savedUser = await userRepository.save(user);

    // Create client profile
    const client = clientRepository.create({
      user_id: savedUser.id,
      company_name: clientData.company_name,
      contact_email: clientData.contact_email,
    });

    await clientRepository.save(client);
  }

  console.log(`${clientsData.length} clients seeded successfully`);
  console.log('All client passwords: client123456');
}
