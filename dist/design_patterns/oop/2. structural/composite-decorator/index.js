"use strict";
// Base class/interface for permissions
class Permission {
}
// Composite Role class
class Role extends Permission {
    constructor(name) {
        super();
        this.name = name;
        this.permissions = [];
    }
    add(permission) {
        this.permissions.push(permission);
    }
    // noinspection JSUnusedGlobalSymbols
    remove(permission) {
        this.permissions = this.permissions.filter(p => p !== permission);
    }
    hasAccess() {
        // Check if any child permission grants access
        return this.permissions.some(permission => permission.hasAccess());
    }
}
// Basic Permission class
class BasicPermission extends Permission {
    constructor(resource, action) {
        super();
        this.resource = resource;
        this.action = action;
    }
    hasAccess() {
        console.log(`Checking access for ${this.action} on ${this.resource}`);
        return true; // Placeholder for actual access logic
    }
}
// Base class for decorators
class PermissionDecorator extends Permission {
    constructor(permission) {
        super();
        this.permission = permission;
    }
    hasAccess() {
        return this.permission.hasAccess();
    }
}
// Time-based access decorator
class TimeBasedPermission extends PermissionDecorator {
    constructor(permission, allowedHours) {
        super(permission);
        this.allowedHours = allowedHours;
    }
    hasAccess() {
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
    constructor(permission, allowedIPs) {
        super(permission);
        this.allowedIPs = allowedIPs;
    }
    hasAccess() {
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
//# sourceMappingURL=index.js.map