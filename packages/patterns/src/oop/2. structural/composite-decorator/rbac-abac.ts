/**
 * Real-World Applications:
 * ------------------------
 * Enterprise RBAC Systems:
 * For managing hierarchical roles with nested permissions.
 * ABAC for Fine-Grained Access Control:
 * Tailored to specific user attributes or contexts (e.g., department, project, location).

 * Compliance:
 * Ensures systems meet business logic, time constraints, or regional restrictions.
 * */

// Base Permission Interface
abstract class Permission {
  abstract hasAccess(userContext: UserContext): boolean;
}

// User Context: Real-world user attributes
interface UserContext {
  userId: string;
  role: string;
  attributes: Record<string, any>; // e.g., { department: "Sales", region: "APAC" }
  ip: string;
  currentHour: number;
  isActive: boolean; // User account status (active/inactive)
}

// Basic Permission Class (Defines basic permissions on resources)
class BasicPermission extends Permission {
  private resource: string;
  private action: string;

  constructor(resource: string, action: string) {
    super();
    this.resource = resource;
    this.action = action;
  }

  hasAccess(userContext: UserContext): boolean {
    console.log(
      `Checking ${this.action} access on ${this.resource} for user ${userContext.userId}`
    );
    if (!userContext.isActive) {
      console.log('Access denied: User is inactive.');
      return false;
    }
    return true; // Placeholder for actual business logic (e.g., database or service check)
  }
}

// Composite Role Class (Manages roles with possible nested roles or permissions)
class Role extends Permission {
  private name: string;
  private permissions: Permission[];
  private inheritedRoles: Role[];

  constructor(name: string) {
    super();
    this.name = name;
    this.permissions = [];
    this.inheritedRoles = [];
  }

  add(permission: Permission): void {
    this.permissions.push(permission);
  }

  remove(permission: Permission): void {
    this.permissions = this.permissions.filter(p => p !== permission);
  }

  addInheritedRole(role: Role): void {
    this.inheritedRoles.push(role);
  }

  hasAccess(userContext: UserContext): boolean {
    console.log(`Checking access for role: ${this.name}`);
    if (
      this.permissions.some(permission => permission.hasAccess(userContext))
    ) {
      return true;
    }

    // Check inherited roles
    for (const inheritedRole of this.inheritedRoles) {
      if (inheritedRole.hasAccess(userContext)) {
        return true;
      }
    }

    return false;
  }
}

// Decorator Base Class (Allows wrapping permissions for additional behavior)
abstract class PermissionDecorator extends Permission {
  protected permission: Permission;

  protected constructor(permission: Permission) {
    super();
    this.permission = permission;
  }

  abstract override hasAccess(userContext: UserContext): boolean;
}

// Time-Based Permission Class (Restricts access based on time)
class TimeBasedPermission extends PermissionDecorator {
  private allowedHours: [number, number];

  constructor(permission: Permission, allowedHours: [number, number]) {
    super(permission);
    this.allowedHours = allowedHours;
  }

  hasAccess(userContext: UserContext): boolean {
    const [start, end] = this.allowedHours;
    if (userContext.currentHour >= start && userContext.currentHour < end) {
      return this.permission.hasAccess(userContext);
    }
    console.log('Access denied due to time restriction.');
    return false;
  }
}

// IP-Restricted Permission Class (Restricts access based on IP address)
class IPRestrictedPermission extends PermissionDecorator {
  private allowedIPs: string[];

  constructor(permission: Permission, allowedIPs: string[]) {
    super(permission);
    this.allowedIPs = allowedIPs;
  }

  hasAccess(userContext: UserContext): boolean {
    if (this.allowedIPs.includes(userContext.ip)) {
      return this.permission.hasAccess(userContext);
    }
    console.log('Access denied due to IP restriction.');
    return false;
  }
}

// Attribute-Based Permission Class (Access control based on user attributes like department)
class AttributeBasedPermission extends PermissionDecorator {
  private attributeConditions: Record<string, any>;

  constructor(
    permission: Permission,
    attributeConditions: Record<string, any>
  ) {
    super(permission);
    this.attributeConditions = attributeConditions;
  }

  hasAccess(userContext: UserContext): boolean {
    for (const [key, value] of Object.entries(this.attributeConditions)) {
      if (userContext.attributes[key] !== value) {
        console.log(
          `Access denied: User attribute ${key} does not match required value.`
        );
        return false;
      }
    }
    return this.permission.hasAccess(userContext);
  }
}

// Example Usage

// Define user context
const userContext: UserContext = {
  userId: '12345',
  role: 'Manager',
  attributes: { department: 'Sales', region: 'APAC' },
  ip: '192.168.1.1',
  currentHour: 10,
  isActive: true, // User is active
};

// Define basic permissions
const readSalesData = new BasicPermission('Sales Data', 'Read');
const writeSalesData = new BasicPermission('Sales Data', 'Write');

// Define roles
const salesRole = new Role('Sales');
salesRole.add(readSalesData);

const managerRole = new Role('Manager');
managerRole.add(salesRole); // Manager role inherits Sales permissions
managerRole.add(writeSalesData);

// Define a Time-Based Permission
const timeRestrictedManager = new TimeBasedPermission(managerRole, [9, 17]); // Access allowed only from 9 AM to 5 PM

// Define IP-Restricted Permission
const ipRestrictedManager = new IPRestrictedPermission(timeRestrictedManager, [
  '192.168.1.1',
  '10.0.0.1',
]);

// Define Attribute-Based Permission
const attributeRestrictedManager = new AttributeBasedPermission(
  ipRestrictedManager,
  { department: 'Sales' }
);

// Check access for the manager
console.log(
  'Manager Access:',
  attributeRestrictedManager.hasAccess(userContext)
); // Should pass all conditions

// Example with inactive user
const inactiveUserContext: UserContext = {
  ...userContext,
  isActive: false,
};

console.log(
  'Inactive User Access:',
  attributeRestrictedManager.hasAccess(inactiveUserContext)
); // Should deny access due to inactivity

/**
 * Key Features Addressed:
 * RBAC (Role-Based Access Control):
 *
 * Roles can inherit other roles (e.g., Manager inherits Sales).
 * Permissions are grouped by roles, and roles manage access to permissions.
 * ABAC (Attribute-Based Access Control):
 *
 * Permissions can be granted based on user attributes (e.g., department, region).
 * Attribute-based rules can be defined and checked during the permission evaluation.
 * Decorator Pattern:
 *
 * Access control features like time-based restrictions, IP restrictions, and attribute conditions are implemented using decorators, enabling flexibility and extensibility.
 * Account Status (Active/Inactive):
 *
 * Permissions are denied if the user account is inactive, which is a common real-world condition for permission validation.
 * Real-World Integration:
 *
 * User context can contain information like user attributes, role, current IP, time, and account status, which are all relevant in a real-world enterprise application for access control.
 * Logging & Debugging:
 *
 * Log messages at every stage of access control help in tracking and troubleshooting access issues.
 * Scenarios This Can Be Used For:
 * Enterprise Access Management Systems: Systems where roles and permissions need to be highly dynamic and flexible.
 * Time/Region-based Access Control: Systems where access is constrained by time (e.g., working hours) or geography (e.g., IP-based restrictions).
 * User Attribute Validation: Systems requiring access to be granted only if the user has specific attributes (e.g., "Sales" department, "APAC" region).
 * Product-Based Code Standards:
 * Separation of Concerns: Each class has a single responsibility (e.g., BasicPermission, Role, PermissionDecorator).
 * Extendable: The decorator pattern allows easy extension (e.g., adding new restrictions such as geo-location).
 * Flexible and Scalable: The code allows easy addition of new roles, permissions, and access rules without changing the core logic.
 * This solution is now better aligned with real-world enterprise access control systems, combining both RBAC and ABAC in a scalable and flexible way.
 *
 * */
