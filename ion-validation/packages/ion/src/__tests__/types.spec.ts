import { describe, it } from 'vitest';
import { IonField, InferSchema } from '../index';

/**
 * Type-Level Rigor: This spec does not run runtime tests.
 * It uses TypeScript's compiler behavior to verify the depth of 'InferSchema'.
 */
describe('Ion Type-Level Rigor: Inference Depth', () => {
  it('should correctly infer a 10-level deep recursive schema', () => {
    // 10 levels of manual nesting to stress the InferSchema utility
    const schema = [
      {
        type: 'schema',
        key: 'l1',
        schema: [
          {
            type: 'schema',
            key: 'l2',
            schema: [
              {
                type: 'schema',
                key: 'l3',
                schema: [
                  {
                    type: 'schema',
                    key: 'l4',
                    schema: [
                      {
                        type: 'schema',
                        key: 'l5',
                        schema: [
                          {
                            type: 'schema',
                            key: 'l6',
                            schema: [
                              {
                                type: 'schema',
                                key: 'l7',
                                schema: [
                                  {
                                    type: 'schema',
                                    key: 'l8',
                                    schema: [
                                      {
                                        type: 'schema',
                                        key: 'l9',
                                        schema: [
                                          { type: 'source', key: 'l10', source: 'val' }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ] as const;

    type Result = InferSchema<typeof schema>;

    // Static Assertion: If this compiles, the inference is working at depth.
    const assertion: Result = {
      l1: { l2: { l3: { l4: { l5: { l6: { l7: { l8: { l9: { l10: 'test' } } } } } } } } }
    };

    // We use the variable to satisfy the compiler
    console.log(assertion.l1.l2.l3.l4.l5.l6.l7.l8.l9.l10);
  });
});
