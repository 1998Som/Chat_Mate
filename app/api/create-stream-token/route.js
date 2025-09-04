import { StreamChat } from "stream-chat";
import { clerkClient } from "@clerk/nextjs/server";

// Use the hardcoded key/secret pair that matches your Stream account
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

export async function POST(request) {
  try {
    const data = await request.json();

    // Manual token creation: { userId }
    if (data?.userId) {
      return handleManualTokenCreate(data.userId);
    }

    // Webhook style payload
    if (data?.type === "user.created") {
      return handleUserCreated(data);
    }

    return Response.json({ error: "Invalid payload" }, { status: 400 });
  } catch (error) {
    console.error("❌ API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function handleManualTokenCreate(userId) {
  if (!userId) return Response.json({ error: "Missing userId" }, { status: 400 });

  try {
    const serverClient = StreamChat.getInstance(api_key, api_secret);

    // Create the token (full string)
    const token = serverClient.createToken(userId);

    // Best-effort: fetch user details from Clerk
    let userName = undefined;
    let image = undefined;
    try {
      const client = await clerkClient();
      const u = await client.users.getUser(userId);
      userName = u?.firstName || u?.username;
      image = u?.imageUrl;
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { streamToken: token },
      });
    } catch {}

    await serverClient.upsertUser({
      id: userId,
      name: userName || `User ${String(userId).slice(-4)}`,
      image: image || `https://getstream.io/random_png/?name=${userName || "User"}`,
    });

    const slugs = [
      "python-discussion",
      "javascript-discussion",
      "tailwind-discussion",
      "react-discussion",
      "nodejs-discussion",
      "nextjs-discussion",
    ];

    await Promise.allSettled(
      slugs.map(async (slug) => {
        try {
          const channel = serverClient.channel("messaging", slug, {
            image: `https://getstream.io/random_png/?name=${slug}`,
            name: slug.replace("-", " "),
            created_by_id: userId,
          });
          await channel.create();
          await channel.addMembers([userId]);
        } catch (e) {
          // ignore channel errors to not block token creation
        }
      })
    );

    return Response.json({ message: "Token created", token, userId, apiKey: api_key });
  } catch (error) {
    console.error("❌ Manual token create error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function handleUserCreated(data) {
  const user = data.data;
  const userId = user.id;

  if (!userId) {
    throw new Error("User ID is missing from webhook data");
  }

  try {
    const serverClient = StreamChat.getInstance(api_key, api_secret);

    function capitalize(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const token = serverClient.createToken(userId);
    console.log("✅ Stream token created for user:", userId);

    const client = await clerkClient();

    await serverClient.upsertUser({
      id: userId,
      name: user.first_name || user.username || `User ${userId.slice(-4)}`,
      image: user.image_url || `https://getstream.io/random_png/?name=${user.first_name || 'User'}`,
    });

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        streamToken: token,
      },
    });

    const slugs = [
      "python-discussion",
      "javascript-discussion",
      "tailwind-discussion",
      "react-discussion",
      "nodejs-discussion",
      "nextjs-discussion",
    ];

    const channelPromises = slugs.map(async (slug) => {
      try {
        const channel = serverClient.channel("messaging", slug, {
          image: `https://getstream.io/random_png/?name=${slug}`,
          name: capitalize(slug.replace("-", " ")),
          created_by_id: userId
        });

        await channel.create();
        await channel.addMembers([userId]);
        console.log(`✅ User ${userId} added to channel: ${slug}`);
      } catch (channelError) {
        console.error(`❌ Error creating/joining channel ${slug}:`, channelError);
      }
    });

    await Promise.allSettled(channelPromises);

    return Response.json({
      message: "User setup completed successfully",
      userId,
      token,
      apiKey: api_key,
    });

  } catch (error) {
    console.error("❌ Error in handleUserCreated:", error);
    throw error;
  }
}