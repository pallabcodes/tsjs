import { useState, useCallback, useMemo } from 'react';
import { createValidation } from '../methods/createValidation';
import { IonField } from '../types/fields';
import { InferSchema } from '../types/inference';
import { IonError } from '../types/monad';

/**
 * useIon: The primary React hook for Ion validation.
 * It manages the reactive lifecycle of form data and validation diagnostics.
 */
export function useIon<T, S extends ReadonlyArray<IonField<T>>>(
  initialData: T,
  schema: S
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, IonError>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validator = useMemo(() => createValidation(data).schema(schema), [data, schema]);

  /**
   * validate: Executes the full validation contract.
   */
  const validate = useCallback(async () => {
    setIsValidating(true);
    const report = await validator.execute();
    setErrors(report.errors);
    setIsValidating(false);
    return report;
  }, [validator]);

  /**
   * updateField: Updates a specific data field and re-validates the contract.
   */
  const updateField = useCallback(async <K extends keyof T>(key: K, value: T[K]) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    
    // We re-validate the entire schema for reactive consistency
    const report = await createValidation(newData).schema(schema).execute();
    setErrors(report.errors);
  }, [data, schema]);

  return {
    data,
    errors,
    isValidating,
    validate,
    updateField,
    isValid: Object.keys(errors).length === 0,
    inferred: data as unknown as InferSchema<S>
  };
}
