import { Result, isSuccess, success, failure } from '../utils/result';
import { pipe } from './pipe';

export type ValidationSchema<T> = {
  [K in keyof T]?: Array<(val: any) => Result<any> | Promise<Result<any>>>;
};

export type ValidationReport<T> = {
  isValid: boolean;
  data: Partial<T>;
  errors: Partial<Record<keyof T, string>>;
};

/**
 * validate: The core execution engine for schema-driven validation.
 * It iterates over the schema, applies the rule pipelines, and generates a report.
 */
export async function validate<T>(data: T, schema: ValidationSchema<T>): Promise<ValidationReport<T>> {
  const report: ValidationReport<T> = {
    isValid: true,
    data: {},
    errors: {},
  };

  const keys = Object.keys(schema) as Array<keyof T>;

  for (const key of keys) {
    const rules = schema[key];
    if (!rules) continue;

    const value = data[key];
    
    // We use our internal pipe to execute the rules for this specific field
    // Note: Since rules can be async, we handle them accordingly.
    let currentResult: Result<any> = success(value);

    for (const rule of rules) {
      const result = await rule(currentResult.tag === 'success' ? currentResult.value : value);
      if (!isSuccess(result)) {
        currentResult = result;
        break;
      }
      currentResult = result;
    }

    if (isSuccess(currentResult)) {
      (report.data as any)[key] = currentResult.value;
    } else {
      report.isValid = false;
      report.errors[key] = currentResult.error;
    }
  }

  return report;
}
