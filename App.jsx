import React, { useEffect, useState } from "react";
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { chatConfig } from "./Config";
import "./App.css";

const App = () => {
    const [userToken, setUserToken] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        // Fetch the user token from the server
        fetch('http://localhost:3001/api/getUserToken', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        })
        .then((response) => response.json())
        .then((data) => {
            setUserToken(data.token); // Store token in state
        })
        .catch((error) => {
            console.error('Error fetching token:', error);
        });
    }, []); // Only runs on mount

    // Initialize client when userToken is available
    useEffect(() => {
        if (userToken) {
            const newClient = StreamChat.getInstance(chatConfig.apiKey);
            newClient.connectUser(
                {
                    id: "Oussama123",
                    name: "Oussama",
                },
                userToken
            );
            setClient(newClient);

            return () => {
                newClient.disconnectUser();
            };
        }
    }, [userToken]); // Runs when userToken is updated

    if (!userToken || !client) {
        return <div>Loading...</div>; // Show loading until token and client are available
    }

    const channel = client.channel("messaging", "react-chat", { name: "React Chat" });

    return (
        <div className="chat-container">
            <Chat client={client} theme="team light">
                <Channel channel={channel}>
                    <Window className="chat-window">
                        <ChannelHeader className="chat-header" />
                        <MessageList className="message-list" />
                        <MessageInput className="message-input" />
                    </Window>
                    <Thread className="thread-container" />
                </Channel>
            </Chat>
        </div>
    );
};

export default App;
