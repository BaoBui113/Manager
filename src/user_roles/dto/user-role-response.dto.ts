export class UserRoleResponseDto {
  id: number;
  scope: string;
  created_at: Date;
  updated_at: Date;
  user: {
    id: number;
    email: string;
  };
  role: {
    id: number;
    name: string;
    description: string;
  };
}

export class AssignRoleDto {
  userId: number;
  roleId: number;
  scope?: string;
}
