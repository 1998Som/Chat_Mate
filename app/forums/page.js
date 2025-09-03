"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const topics = [
  {
    text: "Python",
    img: "/python.svg",
    desc: "Learn and share knowledge about Python programming language",
    slug: "python-discussion",
  },
  {
    text: "JavaScript",
    img: "/javascript.svg",
    desc: "Discuss frameworks, libraries, and tips for JavaScript development",
    slug: "javascript-discussion",
  },
  {
    text: "Tailwind CSS",
    img: "/tailwindcss.svg",
    desc: "Talk about frontend styling and responsive design",
    slug: "tailwind-discussion",
  },
  {
    text: "React.js",
    img: "/react.svg",
    desc: "Explore modern frontend development with React",
    slug: "react-discussion",
  },
  {
    text: "Node.js",
    img: "/nodedotjs.svg",
    desc: "Share best practices and tips for Node.js development",
    slug: "nodejs-discussion",
  },
  {
    text: "Next.js",
    img: "/next.svg",
    desc: "Discuss fullstack development with Next.js framework",
    slug: "nextjs-discussion",
  },
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const Forums = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Discussion Forums</h1>
      <div>
        <p className="text-gray-300 mb-8 font-bold text-center">
          Join our vibrant community to discuss various topics, share knowledge,
          and collaborate on projects.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="group 
                p-6 rounded-2xl 
                bg-gradient-to-br from-[oklch(0.150_0.05_182.503)] to-[oklch(0.25_0.07_182.503)]
                backdrop-blur-md 
                border border-white/10 
                hover:border-[oklch(0.704_0.14_182.503)] 
                hover:shadow-lg hover:shadow-[oklch(0.704_0.14_182.503)/30] 
                transition-all duration-500"
            >
              <div className="relative w-full h-32 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={topic.img}
                  alt={topic.text}
                  fill
                  className="object-contain rounded-md p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h2 className="text-xl font-semibold mb-3 group-hover:text-[oklch(0.704_0.14_182.503)] transition-colors duration-300">
                {topic.text}
              </h2>
              <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                {topic.desc}
              </p>
              <Link href={`/forum/${topic.slug}`}>
                <Button
                  className="bg-[oklch(0.704_0.14_182.503)] 
             text-black font-semibold 
             px-4 py-2 rounded-md mb-6 mt-4 
             transition-all duration-300 
             hover:bg-[oklch(0.704_0.14_182.503)/85] 
             hover:scale-105 
             hover:shadow-lg 
             hover:shadow-[oklch(0.704_0.14_182.503)/50]"
                >
                  Discuss Now
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forums;
