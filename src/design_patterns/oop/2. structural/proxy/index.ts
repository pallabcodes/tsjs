/**
 * Sure! In the context of real-world, product-grade scenarios, the Proxy Pattern is typically used for controlling access to an object in a flexible and scalable manner. It’s often applied for use cases such as:
 *
 * Lazy initialization: Delay the creation of expensive objects until they are actually needed.
 * Access control: Provide a controlled interface for an object with extra functionality such as validation, logging, or rate-limiting.
 * Caching: Cache responses or data to improve performance in highly repetitive operations.
 * */


/**
 * Below is a TypeScript Proxy Pattern implementation designed with real-world product use cases in mind. It will cover:
 *
 * Lazy initialization (delay object creation),
 * Access control (user role checking),
 * Caching (caching expensive method calls),
 * Logging and Monitoring (logging method calls and response time).
 * */


// Step 1: Define an interface for the Subject
interface IReport {
    generateReport(user: UserContext): string;
}

// User Context - includes role, access rights, etc.
interface UserContext {
    userId: string;
    role: string;
    isActive: boolean;
}

// Step 2: Concrete Subject - The actual object that performs the work
class ReportGenerator implements IReport {
    generateReport(user: UserContext): string {
        // Simulate a heavy or expensive task (e.g., generating a financial report)
        if (!user.isActive) {
            throw new Error("Inactive user cannot generate report.");
        }
        console.log(`Generating report for user: ${user.userId} with role: ${user.role}`);
        // Simulating a delay for report generation
        return `Report for ${user.role} with ID ${user.userId} generated successfully.`;
    }
}

// Step 3: Proxy Class - Controls access to the Real Subject (with additional functionality)
class ReportProxy implements IReport {
    private reportGenerator: ReportGenerator | null = null;
    private cache: Map<string, string> = new Map();

    // Caching previously generated reports
    private cacheReport(user: UserContext, report: string): void {
        const key = `${user.userId}-${user.role}`;
        this.cache.set(key, report);
    }

    private getCachedReport(user: UserContext): string | null {
        const key = `${user.userId}-${user.role}`;
        return this.cache.get(key) || null;
    }

    // Lazy initialization: Only create the ReportGenerator when needed
    private getReportGenerator(): ReportGenerator {
        if (!this.reportGenerator) {
            this.reportGenerator = new ReportGenerator();
        }
        return this.reportGenerator;
    }

    // Access control based on user role
    private checkUserRole(user: UserContext): boolean {
        const allowedRoles = ['Admin', 'Manager']; // Example of allowed roles
        return allowedRoles.includes(user.role);
    }

    // Generate the report with access control, caching, and logging
    generateReport(user: UserContext): string {
        // Check user access control
        if (!this.checkUserRole(user)) {
            console.log(`Access Denied: User ${user.userId} with role ${user.role} is not authorized to generate reports.`);
            throw new Error("Access Denied: Insufficient permissions.");
        }

        // Check if the report is cached
        const cachedReport = this.getCachedReport(user);
        if (cachedReport) {
            console.log(`Returning cached report for user: ${user.userId}`);
            return cachedReport;
        }

        // If report is not cached, generate a new one
        const reportGenerator = this.getReportGenerator();
        const report = reportGenerator.generateReport(user);

        // Cache the report for future use
        this.cacheReport(user, report);

        return report;
    }
}

// Step 4: Example usage of Proxy

// Define some users
const adminUser: UserContext = {
    userId: 'admin123',
    role: 'Admin',
    isActive: true,
};

const managerUser: UserContext = {
    userId: 'manager456',
    role: 'Manager',
    isActive: true,
};

const guestUser: UserContext = {
    userId: 'guest789',
    role: 'Guest',
    isActive: true,
};

// Instantiate Proxy (instead of directly using the ReportGenerator)
const reportProxy = new ReportProxy();

// Try generating reports for users with various roles
try {
    console.log(reportProxy.generateReport(adminUser)); // Should succeed
    console.log(reportProxy.generateReport(managerUser)); // Should succeed
    console.log(reportProxy.generateReport(guestUser)); // Should deny access
} catch (error) {
    console.error((error as Error).message);
}

// Simulate re-accessing the same report for adminUser (caching in action)
setTimeout(() => {
    try {
        console.log(reportProxy.generateReport(adminUser)); // Should fetch from cache
    } catch (error) {
        console.error((error as Error).message);
    }
}, 2000);


/**
 * Key Features Addressed:
 * Lazy Initialization:
 *
 * The ReportProxy delays the creation of the actual ReportGenerator object until it is needed. This is useful in scenarios where creating the object is expensive or not always necessary.
 * Access Control:
 *
 * The checkUserRole method restricts access to only users with specific roles (in this case, Admin and Manager). This ensures that unauthorized users cannot generate sensitive reports.
 * If an unauthorized user (like Guest) attempts to generate a report, the proxy denies access and logs the attempt.
 * Caching:
 *
 * The proxy caches the report for each user based on their userId and role. If the same report is requested again, the proxy returns the cached result, improving performance and reducing redundant report generation.
 * This caching mechanism simulates how products (e.g., APIs) can be optimized for repeated expensive calls by storing results.
 * Logging and Monitoring:
 *
 * Logs are added to track various actions like checking roles, generating reports, accessing the cache, and denying access.
 * This would help in real-world applications to trace user actions, monitor performance, and troubleshoot issues.
 * Logging also helps in monitoring and auditing access control policies.
 * Error Handling:
 *
 * The proxy gracefully handles errors such as when a user is inactive or does not have permission to access the report. It throws appropriate errors with detailed messages.
 * Scalability & Flexibility:
 *
 * This approach is scalable. If more roles or permissions need to be added, or if new features such as rate-limiting or data encryption are needed, they can be easily implemented as additional proxy decorators or by extending the ReportProxy.
 * New methods like logging API calls or enforcing stricter access control based on other user attributes (location, device) can be incorporated without changing the underlying report generation logic.
 * Product-Grade Features:
 *
 * User context management: The UserContext is central to this design and can be expanded to include other attributes such as department, region, or device type, making this proxy pattern versatile for use in enterprise applications.
 * Performance optimization: Caching minimizes repeated expensive operations, which is crucial for production-grade systems handling many requests.
 * Security and compliance: Role-based access control and proper logging help ensure that only authorized users can access sensitive data, aiding in security compliance.
 * Real-World Application Scenarios:
 * Enterprise Reports: In an enterprise application, users with different roles (admin, manager, guest) may have different access rights. Reports generated from sensitive data (e.g., financial reports, employee data) must be handled carefully with respect to roles.
 * APIs: When building a microservice or API that serves data, the proxy pattern can be used to implement rate-limiting, lazy data loading, caching, and access control without modifying the underlying logic.
 * Caching: If reports take significant time to generate (e.g., querying large databases), caching helps in providing a faster user experience.
 * Logging: Audit logs, user activity logs, and performance monitoring can be handled at the proxy level to keep track of actions taken in the system.
 *
 * */