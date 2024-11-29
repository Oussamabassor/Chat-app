import React, { useEffect, useState } from 'react';
import {
    Chat,
    Channel,
    ChannelHeader,
    MessageInput,
    MessageList,
    Window,
} from 'stream-chat-react';
import { chatConfig } from './Config';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';
import './App.css';

const App = () => {
    const [client, setClient] = useState(null);
    const [user, setUser] = useState(null);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        const initializeChat = async () => {
            const userId = prompt("Enter your user ID:");
            if (!userId) {
                console.error('No user ID provided');
                return;
            }

            console.log('User ID:', userId);  // Check if userId is correctly set

            const response = await fetch(`http://localhost:3001/api/getUserToken?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch token');
            }
            const { token } = await response.json();

            const chatClient = StreamChat.getInstance(chatConfig.apiKey);
            await chatClient.connectUser(
                {
                    id: userId,
                    name: `User ${userId}`,
                },
                token
            );

            const channel = chatClient.channel('messaging', 'general', {
                name: 'General Chat',
            });

            await channel.watch();

            setClient(chatClient);
            setUser(userId);
            setChannel(channel);
        };

        initializeChat().catch((error) => {
            console.error('Error initializing chat:', error);
        });

        return () => {
            if (client) {
                client.disconnectUser();
            }
        };
    }, [client]);

    if (!client || !channel) return <div>Loading...</div>;

    return (
        <div className="chat-container">
            <Chat client={client} theme="team light">
                <Channel channel={channel}>
                    <Window className="chat-window">
                        <ChannelHeader className="chat-header" />
                        <MessageList className="message-list" />
                        <MessageInput className="message-input" />
                    </Window>
                    {/* <Thread className="thread-container" /> */}
                </Channel>
                
            </Chat>
        </div>
    );
};

export default App;
