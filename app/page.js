"use client";

import Image from "next/image";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

// Animation Variants
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  },
});

export default function Home() {
  const controls = useAnimation();
  const ref = useRef(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const features = [
    {
      icon: "/globe.svg",
      title: "Intelligent Conversations",
      description:
        "Engage in natural, meaningful conversations with our advanced AI system.",
      delay: 0.2,
    },
    {
      icon: "/window.svg",
      title: "Secure & Private",
      description:
        "Your conversations are encrypted and your privacy is our top priority.",
      delay: 0.4,
    },
    {
      icon: "/file.svg",
      title: "Always Available",
      description:
        "24/7 access to your AI companion whenever you need assistance.",
      delay: 0.6,
    },
  ];

  return (
    <main
      ref={ref}
      className="min-h-screen bg-black text-white overflow-hidden"
    >
      {/* Background Glow Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-3xl opacity-15"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ duration: 1.5, delay: i * 0.4 }}
            style={{
              width: 250 + i * 120,
              height: 250 + i * 120,
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? "oklch(0.704 0.14 182.503)" : "#3b82f6"
              }, transparent)`,
              left: `${15 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 relative">
        <motion.div
          initial="hidden"
          animate={controls}
          style={{ y, scale, opacity }}
          className="text-center"
        >
          <motion.h1
            variants={fadeUp(0.1)}
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-[oklch(0.704_0.14_182.503)] via-sky-400 to-[oklch(0.704_0.14_182.503)] text-transparent bg-clip-text"
          >
            Welcome to ChatMate
          </motion.h1>

          <motion.p
            variants={fadeUp(0.3)}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Your intelligent conversation companion. Connect, chat, and
            collaborate with AI-powered assistance.
          </motion.p>

          {/* Auth Buttons */}
          <motion.div
            variants={fadeUp(0.5)}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            {/* Sign In */}
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-[oklch(0.704_0.14_182.503)] rounded-xl font-semibold hover:bg-[oklch(0.65_0.14_182.503)] transition-all duration-200 shadow-lg hover:shadow-[oklch(0.704_0.14_182.503)_0px_0px_20px]">
                Sign In to Chat
              </button>
            </SignInButton>

            {/* Sign Up */}
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-transparent border-2 border-[oklch(0.704_0.14_182.503)] rounded-xl font-semibold hover:bg-[oklch(0.15_0.14_182.503)] transition-all duration-200">
                Create Account
              </button>
            </SignUpButton>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-10 mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeUp(feature.delay)}
                initial="hidden"
                animate="visible"
                className="p-8 rounded-2xl bg-[oklch(0.704_0.14_182.503)]/20 border border-[oklch(0.704_0.14_182.503)]/30 hover:bg-[oklch(0.704_0.14_182.503)]/30 hover:border-[oklch(0.704_0.14_182.503)] transition-all duration-500"
              >
                <div className="w-14 h-14 bg-[oklch(0.704_0.14_182.503)]/40 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Image
                    src={feature.icon}
                    width={28}
                    height={28}
                    alt={feature.title}
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
