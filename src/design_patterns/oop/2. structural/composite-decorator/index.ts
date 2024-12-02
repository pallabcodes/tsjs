// Base class/interface for permissions
abstract class Permission {
  abstract hasAccess(): boolean;
}

// Composite Role class
class Role extends Permission {
  name: string;
  permissions: Permission[]; // Collection of permissions or roles

  constructor(name: string) {
    super();
    this.name = name;
    this.permissions = [];
  }

  add(permission: Permission): void {
    this.permissions.push(permission);
  }

  // noinspection JSUnusedGlobalSymbols
  remove(permission: Permission): void {
    this.permissions = this.permissions.filter(p => p !== permission);
  }

  hasAccess(): boolean {
    // Check if any child permission grants access
    return this.permissions.some(permission => permission.hasAccess());
  }
}

// Basic Permission class
class BasicPermission extends Permission {
  resource: string;
  action: string;

  constructor(resource: string, action: string) {
    super();
    this.resource = resource;
    this.action = action;
  }

  hasAccess(): boolean {
    console.log(`Checking access for ${this.action} on ${this.resource}`);
    return true; // Placeholder for actual access logic
  }
}

// Base class for decorators
abstract class PermissionDecorator extends Permission {
  protected permission: Permission;

  protected constructor(permission: Permission) {
    super();
    this.permission = permission;
  }

  hasAccess(): boolean {
    return this.permission.hasAccess();
  }
}

// Time-based access decorator
class TimeBasedPermission extends PermissionDecorator {
  allowedHours: [number, number]; // Tuple for start and end hours

  constructor(permission: Permission, allowedHours: [number, number]) {
    super(permission);
    this.allowedHours = allowedHours;
  }

  override hasAccess(): boolean {
    const currentHour = new Date().getHours();
    const [start, end] = this.allowedHours;
    if (currentHour >= start && currentHour < end) {
      return super.hasAccess();
    }
    console.log('Access denied due to time restriction.');
    return false;
  }
}

// IP-restricted access decorator
class IPRestrictedPermission extends PermissionDecorator {
  allowedIPs: string[];

  constructor(permission: Permission, allowedIPs: string[]) {
    super(permission);
    this.allowedIPs = allowedIPs;
  }

  override hasAccess(): boolean {
    const currentIP = '192.168.1.1'; // Placeholder for actual IP detection
    if (this.allowedIPs.includes(currentIP)) {
      return super.hasAccess();
    }
    console.log('Access denied due to IP restriction.');
    return false;
  }
}

// Example Usage

// Basic Permissions
const readEmployeeData = new BasicPermission('Employee Data', 'Read');
const writeEmployeeData = new BasicPermission('Employee Data', 'Write');
const deleteEmployeeData = new BasicPermission('Employee Data', 'Delete');

// Role: Employee
const employeeRole = new Role('Employee');
employeeRole.add(readEmployeeData);

// Role: Manager
const managerRole = new Role('Manager');
managerRole.add(employeeRole); // Manager inherits Employee permissions
managerRole.add(writeEmployeeData);

// Role: Admin
const adminRole = new Role('Admin');
adminRole.add(managerRole); // Admin inherits Manager permissions
adminRole.add(deleteEmployeeData);

// Apply Decorators
const timeRestrictedAdmin = new TimeBasedPermission(adminRole, [9, 17]); // Access only during 9 AM to 5 PM
const ipRestrictedAdmin = new IPRestrictedPermission(timeRestrictedAdmin, [
  '192.168.1.1',
  '10.0.0.1',
]);

// Check Access
console.log('Admin Access:', ipRestrictedAdmin.hasAccess());
