import { Handler } from "aws-lambda";
import { BedrockAgentRuntimeClient, InvokeFlowCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import type { Schema } from "../../data/resource";
import { env } from '../../../.amplify/generated/env/BusinessAnalyzer';

// import  variables from environment
const REGION = env.REGION;
const FLOW_ID = env.FLOW_ID;
const FLOW_ALIAS_ID = env.FLOW_ALIAS_ID;

// Adjust the function handler's return type to match the actual return type.
export const handler: Schema['BusinessAnalyzer']['functionHandler'] = async ( event, content ) => {  // Return type matching what the handler actually returns
  const client = new BedrockAgentRuntimeClient({ region: REGION });

  console.log("Event from Amplify Data:", event);

  const command = new InvokeFlowCommand({
    flowIdentifier: FLOW_ID,
    flowAliasIdentifier: FLOW_ALIAS_ID,
    inputs: [
      {
        content: {
          document: event.arguments.prompt ?? null, // Ensure document is never undefined
        },
        nodeName: "FlowInputNode",
        nodeOutputName: "document",
      },
    ],
  });

  // let flowResponse: (string | null)[] = [];

  var response: any = null;  // Adjust this to the actual response type

  try {
    response = await client.send(command);

    console.log("Response from Bedrock Flow:", response);

    // if (response.responseStream) {
    //   for await (const chunkEvent of response.responseStream) {
    //     const { flowOutputEvent, flowCompletionEvent } = chunkEvent;

    //     if (flowOutputEvent) {
    //       flowResponse.push(JSON.stringify(flowOutputEvent, null, 2));
    //       console.log("Flow output event:", flowOutputEvent);
    //     } else if (flowCompletionEvent) {
    //       flowResponse.push(JSON.stringify(flowCompletionEvent, null, 2));
    //       console.log("Flow completion event:", flowCompletionEvent);
    //     }
    //   }
    // } else {
    //   console.error("No response stream found");
    //   return [];  // Or some other default error response
    // }

  } catch (error) {
    console.error("Error invoking Bedrock Flow:", error);
    return [];
  }

  return response;
};
