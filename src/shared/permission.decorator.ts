import { SetMetadata } from '@nestjs/common';
import { RequiredPermission } from './permission.guard';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: RequiredPermission[]) => {
  console.log('Requiring permissions:', permissions);

  return SetMetadata(PERMISSIONS_KEY, permissions);
};

// Helper decorators for common permission patterns
export const RequireAdminAccess = () =>
  RequirePermissions({ action: 'manage', resource: 'all', scope: true });

export const RequireEmployeeRead = () =>
  RequirePermissions(
    { action: 'read', resource: 'employees', scope: true },
    { action: 'read', resource: 'employees', scope: false },
  );

export const RequireEmployeeWrite = () =>
  RequirePermissions(
    { action: 'create', resource: 'employees', scope: true },
    { action: 'update', resource: 'employees', scope: true },
  );

export const RequireEmployeeManage = () =>
  RequirePermissions(
    { action: 'create', resource: 'employees', scope: true },
    { action: 'read', resource: 'employees', scope: true },
    { action: 'update', resource: 'employees', scope: true },
    { action: 'delete', resource: 'employees', scope: true },
  );
