import { createValidation, required, isEmail, minLen } from '../src/index';

/**
 * Example 01: Basic Declarative Validation
 * Proving the "Invisible Inference" and simple rule chaining.
 */
async function runExample() {
  const data = {
    username: 'antigravity',
    email: 'engineer@google.com',
    age: 25
  };

  const schema = [
    { key: 'username', rules: [required(), minLen(3)] },
    { key: 'email', rules: [required(), isEmail()] },
    { key: 'age' } // Optional field, no rules
  ] as const;

  console.log('--- Running Basic Example ---');
  
  const result = await createValidation(data).schema(schema).execute();

  if (result.isValid) {
    console.log('✅ Validation Passed!');
    console.log('Result Data:', result.data);
  } else {
    console.log('❌ Validation Failed');
    console.log('Errors:', result.errors);
  }
}

runExample();
