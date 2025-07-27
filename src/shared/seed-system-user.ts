// Seed system user
export async function seedSystemUser(userRepository, roleRepository) {
  // Tìm admin role
  const adminRole = await roleRepository.findOne({
    where: { name: 'admin' },
  });

  // Tạo system user
  const systemUser = await userRepository.save({
    email: 'system@company.com',
    password: 'hashed_password', // Won't be used
    is_active: true,
    userRoles: [
      {
        role: adminRole,
        assigned_at: new Date(),
      },
    ],
  });

  console.log('System user created:', systemUser.id);
}
