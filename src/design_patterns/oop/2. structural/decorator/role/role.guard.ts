import express, { Request, Response, NextFunction } from 'express';

// Define the type for our route handler
type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

// Role-based access control decorator
function RoleGuard(requiredRole: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as RouteHandler;

    // Replace the original method with a wrapper
    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      const userRole = req.headers['role'] as string | undefined; // Assume role is passed in the headers

      console.log(`Checking role: ${userRole}`);
      if (!userRole) {
        return res.status(400).json({ message: 'Role is required' }); // Handle missing role
      }
      if (userRole !== requiredRole) {
        return res.status(403).json({ message: 'Access Denied' }); // Handle unauthorized role
      }

      // Call the original method if role check passes
      return originalMethod.apply(this, [req, res, next]);
    };

    return descriptor;
  };
}

// Example usage in a controller
class UserController {
  @RoleGuard('admin')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAdminData(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Welcome, Admin!' });
  }

  @RoleGuard('user')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUserData(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Welcome, User!' });
  }
}

// Setup Express and routes
const app = express();
const userController = new UserController();

// Routes
app.get('/admin', userController.getAdminData);
app.get('/user', userController.getUserData);

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));

// If the controller method doesn’t include `next`, the decorator’s wrapper function won’t have access to `next` either, as it relies on the same signature.
