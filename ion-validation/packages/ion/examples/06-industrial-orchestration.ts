import { createValidation, isEmail, minLen } from '../src/index';

/**
 * Example 06: Industrial-Strength Orchestration (Stable Architecture)
 * Proving the power of the Discriminated Union contract.
 */
async function runExample() {
  const data = {
    id: 'user_123',
    email: 'engineer@google.com',
    profile: {
      displayName: 'Antigravity'
    }
  };

  // The final, stable Ion Contract
  const schema = [
    { type: 'source', key: 'id', source: 'id', required: true },
    { type: 'source', key: 'email', source: 'email', required: true, rules: [isEmail()] },
    
    { 
      type: 'schema', 
      key: 'user', 
      source: 'profile', 
      schema: [
        { type: 'source', key: 'name', source: 'displayName', required: true, rules: [minLen(3)] }
      ]
    },

    {
      type: 'computed',
      key: 'identity',
      compute: (d: typeof data) => `${d.profile.displayName} (#${d.id})`
    }
  ] as const;

  console.log('\n--- Running Final Stable Orchestration Example ---');

  const result = await createValidation(data).schema(schema).execute();

  if (result.isValid) {
    console.log('✅ Validation Passed with Stable Architecture!');
    console.log('Result Data:', result.data);
  }
}

runExample();
