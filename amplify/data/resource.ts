import { a, defineData, defineFunction, type ClientSchema } from '@aws-amplify/backend';
import { BusinessAnalyzer } from '../functions/BusinessAnalyzer/resource';
import { invokeFlow } from "../functions/invokeFlow/resource";


const schema = a.schema({

  // This adds a new generation route to your Amplify Data backend.
  BusinessAnalyzer: a
      .query()
      .arguments({
        prompt: a.string(),
      })
      .returns(
        a.customType({
          report: a.string(),
          image: a.string(),
        })
      )
      .handler(a.handler.function(BusinessAnalyzer))
      .authorization((allow) => [allow.authenticated()]),

  invokeFlow: a
      .query()
      .arguments({
         document: a.string(),
       })
       .returns(
         a.customType({
           title: a.string(),
           description: a.string(),
         })
       )
       .authorization((allow) => allow.authenticated())
       .handler(a.handler.function(invokeFlow)),

  // This will add a new conversation route to your Amplify Data backend.
  chat: a.conversation({
    aiModel: a.ai.model("Claude 3 Sonnet"),
    systemPrompt: "你是個專業的助理",
    // "你是個專業的助理，如果用戶與商業相關的問題，請你調用BusinessAnalyzer工具",

    // conversation routes can have multiple tools
    tools: [
      {
        name: "sleep",
        description: "用戶想睡覺才call這個工具",
        query: a.ref("BusinessAnalyzer"),
      },
      a.ai.dataTool({
        name: "BusinessAnalyzer", // "invokeFlow",
        description:
          "用來作為商業分析的工具",
          // "Connects to an Amazon Bedrock Flow to generate" +
          // "dynamic content based on user queries. " +
          // "The tool streams responses from Bedrock for optimal performance.",
        query: a.ref("invokeFlow") 
      }),
      // a.ai.dataTool({
      //   name: "BusinessAnalyzer",
      //   description: "處理商業相關事務的工具",
      //   query: a.ref("BusinessAnalyzer"),
      // })
    ],
  }).authorization((allow) => allow.owner()),  

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

console.log("Data schema:", schema);