import { useState, useCallback, useRef } from 'react';
import { createValidation } from '../methods/createValidation';
import { FieldDefinition } from '../protocols/ion';

/**
 * useIon: The high-performance React hook for the Ion Validation Protocol.
 * It treats validation as a lazy, event-driven stream, updating the UI progressively.
 */
export function useIon<T>(initialData: T, schema: FieldDefinition<T>[]) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Using a ref to track the latest data for the validation stream
  const dataRef = useRef(data);
  dataRef.current = data;

  /**
   * updateField: Updates state and clears the specific field error.
   */
  const updateField = useCallback((key: keyof T, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
    setErrors((prev: Record<string, string>) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  /**
   * validate: Executes the IonStream and yields errors progressively to the UI.
   */
  const validate = useCallback(async () => {
    setIsValidating(true);
    const validation = createValidation(dataRef.current).schema(schema);
    const stream = validation.stream();

    // Clear previous errors before starting
    setErrors({});

    for await (const event of stream) {
      if (event.type === 'field_error') {
        setErrors((prev: Record<string, string>) => ({
          ...prev,
          [event.key]: event.error
        }));
      }
    }

    setIsValidating(false);
    
    // Return final snapshot
    return await validation.execute();
  }, [schema]);

  return {
    data,
    errors,
    isValidating,
    updateField,
    validate,
    setData,
    setErrors
  };
}
