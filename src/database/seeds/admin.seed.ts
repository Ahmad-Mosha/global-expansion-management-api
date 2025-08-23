import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../users/entity/user.entity';
import { Admin } from '../../admins/entity/admin.entity';

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const adminRepository = dataSource.getRepository(Admin);

  // Check if admins already exist
  const existingAdmins = await adminRepository.count();
  if (existingAdmins > 0) {
    console.log('Admin users already exist, skipping seed');
    return;
  }

  const adminsData = [
    {
      email: 'admin@expanders360.com',
      password: 'admin123456',
    },
    {
      email: 'superadmin@expanders360.com',
      password: 'admin123456',
    },
    {
      email: 'system.admin@expanders360.com',
      password: 'admin123456',
    },
  ];

  const hashedPassword = await bcrypt.hash('admin123456', 12);

  for (const adminData of adminsData) {
    // Create admin user
    const adminUser = userRepository.create({
      email: adminData.email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const savedUser = await userRepository.save(adminUser);

    // Create admin profile
    const adminProfile = adminRepository.create({
      user_id: savedUser.id,
    });

    await adminRepository.save(adminProfile);
  }

  console.log(`${adminsData.length} admin users created successfully`);
  console.log('All admin passwords: admin123456');
}
