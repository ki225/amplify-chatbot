import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { BusinessAnalyzer } from './functions/BusinessAnalyzer/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function } from 'aws-cdk-lib/aws-lambda';
import {
  invokeFlow,
  REGION,
  FLOW_IDENTIFIER as flowIdentifier,
  FLOW_ALIAS_IDENTIFIER as flowAliasIdentifier,
} from "./functions/invokeFlow/resource";

const FLOW_REGION = REGION;
const FLOW_IDENTIFIER = flowIdentifier;
const FLOW_ALIAS_IDENTIFIER = flowAliasIdentifier;
const backend = defineBackend({
  auth,
  data,
  BusinessAnalyzer,
  invokeFlow 
});

const bedrockFlowResources = [
  `arn:aws:bedrock:${FLOW_REGION}:*:flow/${FLOW_IDENTIFIER}/alias/${FLOW_ALIAS_IDENTIFIER}`,
  `arn:aws:bedrock:${FLOW_REGION}:*:flow/${FLOW_IDENTIFIER}`,
];

const bedrockFlowActions = [
  "bedrock:InvokeFlow",
  "bedrock-agent-runtime:InvokeFlow",
  "bedrock-agent-runtime:InvokeAgentFlow",
  "bedrock-agent-runtime:InvokeAgentFlowAlias",
];

backend.invokeFlow.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: bedrockFlowActions,
    resources: bedrockFlowResources,
  })
);

// IAM permissions for authenticated users (Amplify Gen2)
backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: bedrockFlowActions,
    resources: bedrockFlowResources,
  })
);