import { createValidation } from '../packages/ion/src/methods/createValidation';
import { required } from '../packages/ion/src/actions/required';
import { isEmail } from '../packages/ion/src/actions/email';
import { minLen } from '../packages/ion/src/actions/minLen';

async function testConsumerDX() {
  const dummyData = {
    name: 'John',
    email: 'invalid-email',
    bio: 'Too short'
  };

  // 1. Initialize Validation with a clean, declarative Schema
  const validation = createValidation(dummyData).schema([
    { key: 'firstName', source: 'name', rules: [required()] },
    { key: 'userEmail', source: 'email', rules: [required(), isEmail()] },
    { key: 'userBio', source: 'bio', rules: [minLen(20)] }
  ]);

  console.log('--- Executing Ion Validation (Consumer DX) ---');

  // 2. Simple "One-Shot" execution
  const result = await validation.execute();

  console.log('Is Valid:', result.isValid);
  console.log('Errors:', JSON.stringify(result.errors, null, 2));
  console.log('Transformed Data:', JSON.stringify(result.data, null, 2));

  console.log('--- Finished ---');
}

testConsumerDX().catch(console.error);
