"use client";
import React from "react";
import { useState, useEffect } from "react";
import "stream-chat-react/dist/css/v2/index.css";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";


function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}


const ChatForum = ({ clerkUser, slug }) => {
    const apiKey = "fst4hpzqna7c";
    const userId = clerkUser.id;
    const userName = clerkUser.name;
    const userToken = clerkUser.token;

    const user = {
        id: userId,
        name: userName,
        image: `https://getstream.io/random_png/?name=${userName}`,
    };
    

   const [channel, setChannel] = useState();
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  useEffect(() => {
    if (!client) return;

    const channel = client.channel("messaging", slug, {
      image: "https://getstream.io/random_png/?name=react",
      name: capitalize(slug) + "Discussion",
      members: [userId],
    });

    setChannel(channel);
  }, [client]);

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 shadow-inner p-2 md:p-3">
      <div className="h-[70vh] md:h-[75vh] lg:h-[80vh] rounded-lg overflow-hidden">
        <Chat client={client} theme="str-chat__theme-dark">
          <Channel channel={channel} watchers={true} typingEvents={true}>
            <Window>
              <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/20">
                <ChannelHeader title={capitalize(slug)} live />
              </div>
              <div className="h-full overflow-y-auto">
                <MessageList
                  hideDeletedMessages
                  messageActions={['react','reply','edit','delete']}
                  typingIndicator
                />
              </div>
              <div className="sticky bottom-0 z-10 backdrop-blur-sm bg-black/20">
                <MessageInput focus grow placeholder="Write a message..." />
              </div>
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatForum;
