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

// Create token using existing API
async function createStreamToken(userId) {
  const resp = await fetch("/api/create-stream-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!resp.ok) throw new Error("Failed to create Stream token");
  const data = await resp.json();
  return { token: data.token, apiKey: data.apiKey };
}

function ChatForumInner({ apiKey, token, slug, user, userId }) {
  const [channel, setChannel] = useState();
  const client = useCreateChatClient({ apiKey, tokenOrProvider: token, userData: user });

  useEffect(() => {
    if (!client) return;
    const channel = client.channel("messaging", slug, {
      image: "https://getstream.io/random_png/?name=react",
      name: capitalize(slug) + " Discussion",
      members: [userId],
    });
    setChannel(channel);
  }, [client, slug, userId]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-pulse text-[oklch(0.704_0.14_182.503)] text-lg">Connecting to chat...</div>
        </div>
      </div>
    );
  }

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
                <MessageList hideDeletedMessages messageActions={["react", "reply", "edit", "delete"]} typingIndicator />
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
}

const ChatForum = ({ clerkUser, slug }) => {
  const apiKey = "fst4hpzqna7c";
  const userId = clerkUser.id;
  const userName = clerkUser.name;
  const existingToken = clerkUser.token || clerkUser.streamToken;

  const [loading, setLoading] = useState(true);
  const [finalToken, setFinalToken] = useState(existingToken || "");
  const [tokenError, setTokenError] = useState(false);
  const [clientKey, setClientKey] = useState(apiKey);

  const user = {
    id: userId,
    name: userName || `User ${String(userId).slice(-4)}`,
    image: `https://getstream.io/random_png/?name=${userName || "User"}`,
  };

  useEffect(() => {
    let cancelled = false;
    async function ensureToken() {
      try {
        if (!finalToken) {
          console.warn("No token found, attempting to create one...");
          const { token, apiKey: returnedKey } = await createStreamToken(userId);
          if (!cancelled) {
            setFinalToken(token);
            if (returnedKey) setClientKey(returnedKey);
            setTokenError(false);
            console.log("✅ Token created successfully");
          }
        }
      } catch (err) {
        if (!cancelled) setTokenError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    ensureToken();
    return () => {
      cancelled = true;
    };
  }, [userId, existingToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(0.704_0.14_182.503)] mx-auto mb-4"></div>
          <p className="text-gray-400">Setting up chat...</p>
        </div>
      </div>
    );
  }

  if (tokenError || !finalToken) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-red-900/20 rounded-lg border border-red-500/30">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">Chat Setup Error</h3>
          <p className="text-gray-300 mb-4">Unable to initialize chat. This might happen with new accounts.</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[oklch(0.704_0.14_182.503)] text-white rounded-lg hover:bg-[oklch(0.65_0.14_182.503)] transition-colors">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatForumInner apiKey={clientKey} token={finalToken} slug={slug} user={user} userId={userId} />
  );
};

export default ChatForum;