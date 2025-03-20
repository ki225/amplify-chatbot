import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { Authenticator } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";
import {AIConversation, createAIHooks} from '@aws-amplify/ui-react-ai';
import React from "react";
import { User } from "aws-cdk-lib/aws-iam";



Amplify.configure(outputs);
const client = generateClient<Schema>();
const { useAIConversation } = createAIHooks(client);


export default function Page() {
    const [ 
        { 
            data: { messages }, 
            isLoading, 
        },
        sendMessage,
    ] = useAIConversation('chat');
    console.log(messages);
    return (<Authenticator>
        {({ signOut, user}) => (
            <>
                <AIConversation
                messages={messages}
                handleSendMessage={sendMessage}
                isLoading={isLoading}
                avatars={
                    {
                        user: {
                            username: "Kiki",
                            // avatar: 
                        }
                    }
                }
                />
            </>
        )}
    </Authenticator>
    )
}