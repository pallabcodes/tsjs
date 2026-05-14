import { createValidation, required, transform } from '../index';

/**
 * Example 05: Complex Data Reshaping (Proto-to-UI Pattern)
 * Proving how Ion can transform a deeply nested system object 
 * into a flat, consumer-ready data contract.
 */
async function runExample() {
  const systemData = {
    metadata: {
      id: 'sys_123',
      timestamps: { created: 1620000000000 }
    },
    payload: {
      user: {
        info: { name: 'Antigravity', email: 'eng@google.com' }
      }
    }
  };

  const schema = [
    // Flat mapping from deep nested paths
    { key: 'id', source: 'metadata.id', rules: [required()] },
    { key: 'email', source: 'payload.user.info.email', rules: [required()] },
    
    // Transform timestamp to Date object
    { 
      key: 'createdAt', 
      source: 'metadata.timestamps.created',
      rules: [
        transform(val => new Date(val))
      ]
    },

    // Derived identity field
    { 
      key: 'displayName', 
      compute: (d: any) => `${d.payload.user.info.name} (${d.metadata.id})`
    }
  ] as const;

  console.log('\n--- Running Complex Reshaping Example ---');

  const result = await createValidation(systemData).schema(schema).execute();

  console.log('Processed UI Data Structure:');
  console.log(result.data);
  // Inference Proof: result.data.createdAt is a Date object.
}

runExample();
