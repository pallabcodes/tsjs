import { describe, it, expect } from 'vitest';
import { joi } from '../src';

describe('Field Redaction', () => {
    it('should redact sensitive fields', () => {
        const schema = joi.object<{
            username: string;
            password: string;
            email: string;
        }>({
            username: joi.string().required(),
            password: joi.string().required(),
            email: joi.string().email().required()
        });

        const data = {
            username: 'john',
            password: 'secret123',
            email: 'john@example.com'
        };

        const validated = schema.validate(data);
        
        const redacted = schema
            .withRedactedFields(['password'])
            .redact(validated);

        expect(redacted).toEqual({
            username: 'john',
            password: '[REDACTED]',
            email: 'john@example.com'
        });
    });

    it('should handle multiple redacted fields', () => {
        const schema = joi.object<{
            username: string;
            password: string;
            ssn: string;
        }>({
            username: joi.string().required(),
            password: joi.string().required(),
            ssn: joi.string().required()
        });

        const data = {
            username: 'john',
            password: 'secret123',
            ssn: '123-45-6789'
        };

        const validated = schema.validate(data);
        
        const redacted = schema
            .withRedactedFields(['password', 'ssn'], '***')
            .redact(validated);

        expect(redacted).toEqual({
            username: 'john',
            password: '***',
            ssn: '***'
        });
    });
});