export class RoleResponseDto {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  userCount?: number;
  permissionCount?: number;
}

export class RoleWithUsersDto extends RoleResponseDto {
  users: {
    userId: number;
    email: string;
    assignedAt: Date;
  }[];
}

export class RoleWithPermissionsDto extends RoleResponseDto {
  permissions: {
    permissionId: number;
    name: string;
    description: string;
    assignedAt: Date;
  }[];
}
