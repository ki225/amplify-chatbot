import { defineFunction } from '@aws-amplify/backend';

export const REGION = 'us-east-1';
export const FLOW_IDENTIFIER = 'HQ73PQGC05';  // See: Bedrock Flow AWS Concole
export const FLOW_ALIAS_IDENTIFIER = 'JI4JQZ3VRD'; // See: Bedrock Flow AWS Concole

export const invokeFlow = defineFunction({
  name: 'invokeFlow',
  entry: './handler.ts',
  timeoutSeconds: 500,
  environment: {
    REGION,
    FLOW_IDENTIFIER,
    FLOW_ALIAS_IDENTIFIER,
  },
});