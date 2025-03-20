import { defineFunction } from '@aws-amplify/backend';

export const BusinessAnalyzer = defineFunction({
    name: 'BusinessAnalyzer',
    entry: './handler.ts',
    environment: {
        REGION: 'us-east-1',
        FLOW_ID: 'HQ73PQGC05',
        FLOW_ALIAS_ID: 'JI4JQZ3VRD',
    },
});