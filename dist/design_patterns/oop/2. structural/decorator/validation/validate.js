"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
require("reflect-metadata");
// Dynamic validation decorator
function Validate(
// eslint-disable-next-line @typescript-eslint/ban-types
target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (req, res, next) {
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
            const dtoInstance = (0, class_transformer_1.plainToClass)(DTOClass, req.body, {
                excludeExtraneousValues: true,
            });
            const errors = await (0, class_validator_1.validate)(dtoInstance);
            if (errors.length > 0) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors,
                });
            }
            // Proceed to the original method
            return await originalMethod.apply(this, [req, res, next]);
        }
        catch (error) {
            return next(error);
        }
    };
}
// Platform-specific DTOs
class WebUserDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], WebUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], WebUserDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], WebUserDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebUserDTO.prototype, "platform", void 0);
class MobileUserDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], MobileUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], MobileUserDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], MobileUserDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MobileUserDTO.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MobileUserDTO.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MobileUserDTO.prototype, "deviceName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MobileUserDTO.prototype, "deviceModel", void 0);
class IoTUserDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], IoTUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], IoTUserDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(12),
    __metadata("design:type", String)
], IoTUserDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoTUserDTO.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoTUserDTO.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoTUserDTO.prototype, "deviceName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IoTUserDTO.prototype, "deviceModel", void 0);
// Updated UserController with @Validate
class UserController {
    async register(req, res) {
        try {
            // Assuming further processing (e.g., saving user to DB)
            return res.status(201).json({ message: 'User has registered successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}
exports.UserController = UserController;
__decorate([
    Validate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
//# sourceMappingURL=validate.js.map