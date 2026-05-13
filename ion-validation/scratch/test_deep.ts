import { createValidation } from '../packages/ion/src/methods/createValidation';
import { required } from '../packages/ion/src/actions/required';

async function testDeepObjects() {
  const data = {
    user: {
      profile: {
        firstName: 'Antigravity',
        lastName: 'AI'
      },
      settings: {
        theme: 'dark'
      }
    }
  };

  const schema = [
    {
      key: 'identity',
      source: 'user.profile', // Deep source
      schema: [
        { key: 'first', source: 'firstName', rules: [required()] },
        { key: 'last', source: 'lastName', rules: [required()] }
      ]
    },
    {
      key: 'ui',
      source: 'user.settings',
      schema: [
        { key: 'mode', source: 'theme' }
      ]
    },
    {
      key: 'fullInfo',
      compute: (d: any) => `${d.user.profile.firstName} (${d.user.settings.theme})`
    }
  ];

  console.log('--- Testing Deep Object Support ---');

  const validation = createValidation(data).schema(schema as any);
  const result = await validation.execute();

  console.log('Is Valid:', result.isValid);
  console.log('Result Data:', JSON.stringify(result.data, null, 2));

  console.log('--- Testing Deep Error Yielding ---');
  const badData = { user: { profile: { firstName: '' }, settings: { theme: 'light' } } };
  const stream = createValidation(badData).schema(schema as any).stream();
  
  for await (const event of stream) {
    if (event.type === 'field_error') {
      console.log(`Detected Error at ${event.key}: ${event.error}`);
    }
  }

  console.log('--- Finished ---');
}

testDeepObjects().catch(console.error);
