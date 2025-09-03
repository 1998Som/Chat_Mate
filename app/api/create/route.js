import { StreamChat } from "stream-chat";
import { clerkClient } from "@clerk/nextjs/server";

const api_key = process.env.api_key;
const api_secret = process.env.api_secret;
 

export async function POST(request) {
  try {
    const serverClient = StreamChat.getInstance(api_key, api_secret);

    const user = await request.json();

    function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


    // Create User Token
    const token = serverClient.createToken(user.data.id);
    console.log("✅ A new user has been created:", token);

    // Update Clerk user metadata
    const client = await clerkClient();

    await serverClient.upsertUser({id: user.data.id})
    await client.users.updateUserMetadata(user.data.id, {
      publicMetadata: {
        token: token,
      },
    });

    //give access to this user of all chats
    const slugs = [
      "python-discussion",
      "javascript-discussion",
      "tailwind-discussion",
      "react-discussion", 
      "nodejs-discussion",
      "nextjs-discussion",
    ];

    slugs.forEach ( async(item) => {
       const channel = serverClient.channel("messaging", item, {
      image: "https://getstream.io/random_png/?name=react",
      name: capitalize(item) + "Discussion",
      created_by_id: user.data.id
    });
    await channel.create();
    channel.addMembers([user.data.id])
    })

    return Response.json({ message: "User token created", token });
  } catch (error) {
    console.error("❌ Error creating user token:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
