import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../users/entity/user.entity';
import { Admin } from '../../admins/entity/admin.entity';

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const adminRepository = dataSource.getRepository(Admin);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@expanders360.com' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123456', 12);

  const adminUser = userRepository.create({
    email: 'admin@expanders360.com',
    password: hashedPassword,
    role: UserRole.ADMIN,
  });

  const savedUser = await userRepository.save(adminUser);

  // Create admin profile
  const adminProfile = adminRepository.create({
    user_id: savedUser.id,
  });

  await adminRepository.save(adminProfile);

  console.log('Admin user created successfully');
  console.log('Email: admin@expanders360.com');
  console.log('Password: admin123456');
}
