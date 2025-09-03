// app/forum/[slug]/page.js
import { currentUser } from "@clerk/nextjs/server";
import ChatForum from "@/components/ChatForum";

export default async function Page({ params }) {
  const user = await currentUser();
  const slug = (await params).slug;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white flex items-center justify-center p-6">
      <div
        className="w-full max-w-6xl 
        bg-[oklch(0.704_0.14_182.503)/10] 
        border border-[oklch(0.704_0.14_182.503)/30] 
        backdrop-blur-xl 
        shadow-[0_8px_40px_rgba(0,0,0,0.6)] 
        rounded-2xl 
        p-10
        transition-all duration-500 
        hover:shadow-[0_12px_50px_rgba(0,200,255,0.25)]"
      >
        {/* Forum Title */}
        <h1
          className="text-3xl md:text-5xl font-extrabold text-center mb-10 
          bg-gradient-to-r from-[oklch(0.704_0.14_182.503)] to-cyan-400 
          text-transparent bg-clip-text 
          drop-shadow-lg tracking-wide"
        >
          {slug.replace("-", " ").toUpperCase()} FORUM
        </h1>

        {/* Chat Forum Section */}
        <div
          className="rounded-xl overflow-hidden 
          border border-white/10 
          bg-gradient-to-br from-slate-900/80 to-slate-800/60
          shadow-inner p-6
          flex flex-col gap-4"
        >
          <ChatForum
            slug={slug}
            clerkUser={{
              id: user?.id,
              name: user?.firstName,
              token: user?.publicMetadata?.token,
            }}
          />
        </div>
      </div>
    </main>
  );
}
