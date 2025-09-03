import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
  try {
    const { message } = await req.json();
    

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful web development assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;

    return new Response(
      JSON.stringify({ reply }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ reply: "⚠️ Error: " + error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
