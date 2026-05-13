import { createValidation } from '../packages/ion/src/methods/createValidation';
import { required } from '../packages/ion/src/actions/required';
import { when } from '../packages/ion/src/methods/combinators';

async function testConditionalValidation() {
  const data = {
    contactPreference: 'email',
    email: '', // Should be required because preference is 'email'
    fax: '12345', // Should be omitted if isModern is true
    isModern: true
  };

  const schema = [
    { key: 'pref', source: 'contactPreference' },
    { 
      key: 'userEmail', 
      source: 'email', 
      rules: [
        when((data) => data.contactPreference === 'email', required('Email is required when preference is set to email'))
      ] 
    },
    {
      key: 'faxNumber',
      source: 'fax',
      omit: (data: any) => data.isModern === true
    }
  ];

  console.log('--- Testing Conditional Validation ---');

  const validation = createValidation(data).schema(schema as any);
  const result = await validation.execute();

  console.log('Is Valid:', result.isValid);
  console.log('Errors:', JSON.stringify(result.errors, null, 2));
  console.log('Result Data (Fax should be missing):', JSON.stringify(result.data, null, 2));

  console.log('--- Testing with preference "phone" ---');
  const data2 = { ...data, contactPreference: 'phone' };
  const result2 = await createValidation(data2).schema(schema as any).execute();
  
  console.log('Is Valid (Email should be optional now):', result2.isValid);
  console.log('Errors (Should be empty):', JSON.stringify(result2.errors, null, 2));

  console.log('--- Finished ---');
}

testConditionalValidation().catch(console.error);
