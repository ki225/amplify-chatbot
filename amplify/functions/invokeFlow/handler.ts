import type { Schema } from "../../data/resource";
import {
  BedrockAgentRuntimeClient,
  InvokeFlowCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

// For more details see https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-agent-runtime_example_bedrock-agent-runtime_InvokeFlow_section.html

export const REGION = 'us-east-1';
export const FLOW_IDENTIFIER = 'HQ73PQGC05';  // See: Bedrock Flow AWS Concole
export const FLOW_ALIAS_IDENTIFIER = 'JI4JQZ3VRD'; // See: Bedrock Flow AWS Concole

export const handler: Schema["invokeFlow"]["functionHandler"] = async (event) => {
  try {
    const client = new BedrockAgentRuntimeClient({ 
      region: REGION,
      maxAttempts: 3
    });
    
   const command = new InvokeFlowCommand({
      flowAliasIdentifier: FLOW_ALIAS_IDENTIFIER,
      flowIdentifier: FLOW_IDENTIFIER,
      inputs: [
        {
          content: {
            document: event.arguments.document || ''
          },
          nodeName: "FlowInputNode",
          nodeOutputName: "document"
        }
      ],
      enableTrace: true,
    });

    let responseText  = "";
  
    const response = await client.send(command);
    console.log(" INFO Response", response); 
   
    if (response.responseStream) {
      console.log(" INFO responseStream", response.responseStream);
 
     for await (const chunkEvent of response.responseStream!) {
         const { flowOutputEvent } = chunkEvent;
         if (flowOutputEvent?.content?.document) {
           responseText += flowOutputEvent.content.document;
         }
       }
     } 
 
     if (!responseText) {
       responseText = "No response received from the flow."
     }
     console.log(" FINAL output", responseText);
 
     return {
       title: responseText.split(" ").slice(0, 10).join(" ") as string,
       description: responseText.split(" ").slice(10).join(" ") as string,
     };
     
   } catch (error) {
     console.error('Error:', error);
     throw error;
   }
 };