import { createValidation } from '../packages/ion/src/methods/createValidation';
import { required } from '../packages/ion/src/actions/required';

async function testComputedProperties() {
  const dummyData = {
    name: 'John',
    lastName: 'Doe',
  };

  // 1. Schema with Computed and Static properties
  const validation = createValidation(dummyData).schema([
    { key: 'firstName', source: 'name', rules: [required()] },
    { key: 'surName', source: 'lastName', rules: [required()] },
    { 
      key: 'fullName', 
      compute: (data) => `${data.name} ${data.lastName}` 
    },
    { 
      key: 'apiVersion', 
      value: 'v1.0.0-ion' 
    }
  ]);

  console.log('--- Testing Computed & Static Properties ---');

  const result = await validation.execute();

  console.log('Result Data:', JSON.stringify(result.data, null, 2));
  console.log('--- Finished ---');
}

testComputedProperties().catch(console.error);
