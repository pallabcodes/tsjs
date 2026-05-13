import { createValidation } from '../packages/ion/src/methods/createValidation';
import { transform } from '../packages/ion/src/actions/transform';
import { required } from '../packages/ion/src/actions/required';

// Mock async enrichment function
const fetchUserId = async (name: string) => {
  console.log(`[Mock API] Fetching ID for ${name}...`);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(`ID-${name.toUpperCase()}-99`), 100);
  });
};

async function testAdvancedTransformers() {
  
  const data = {
    username: '  antigravity  ',
  };

  const schema = [
    { 
      key: 'user', 
      source: 'username', 
      rules: [
        required(),
        transform((val: string) => val.trim()),
        transform((val: string) => val.toUpperCase()),
        transform(async (val: string) => await fetchUserId(val))
      ] 
    },
    {
      key: 'processedAt',
      compute: () => new Date().toISOString()
    }
  ];

  console.log('--- Testing Advanced Transformers ---');

  const validation = createValidation(data).schema(schema as any);
  const result = await validation.execute();

  console.log('Result Data:', JSON.stringify(result.data, null, 2));
  console.log('--- Finished ---');
}

testAdvancedTransformers().catch(console.error);
