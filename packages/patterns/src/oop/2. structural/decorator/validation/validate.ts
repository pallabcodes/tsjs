import { plainToClass } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';

// Dynamic validation decorator
function Validate(
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      // Determine the platform-specific DTO
      const { platform } = req.body;

      let DTOClass;
      switch (platform) {
        case 'web':
          DTOClass = WebUserDTO;
          break;
        case 'mobile':
          DTOClass = MobileUserDTO;
          break;
        case 'iot':
          DTOClass = IoTUserDTO;
          break;
        default:
          return res.status(400).json({ message: 'Invalid platform specified' });
      }

      // Transform and validate the request body
      const dtoInstance = plainToClass(DTOClass, req.body, {
        excludeExtraneousValues: true,
      });
      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors,
        });
      }

      // Proceed to the original method
      return await originalMethod.apply(this, [req, res, next]);
    } catch (error) {
      return next(error);
    }
  };
}

// Platform-specific DTOs
class WebUserDTO {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  username!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  platform!: string;
}

class MobileUserDTO {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  platform!: string;

  @IsString()
  deviceId!: string;

  @IsString()
  deviceName!: string;

  @IsString()
  deviceModel!: string;
}

class IoTUserDTO {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  username!: string;

  @IsString()
  @MinLength(12)
  password!: string;

  @IsString()
  platform!: string;

  @IsString()
  deviceId!: string;

  @IsString()
  deviceName!: string;

  @IsString()
  deviceModel!: string;
}

// Updated UserController with @Validate
export class UserController {
  @Validate
  async register(req: Request, res: Response) {
    try {
      // Assuming further processing (e.g., saving user to DB)
      return res.status(201).json({ message: 'User has registered successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
  }
}
