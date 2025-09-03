"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: "https://github.com/1998Som", icon: <Github size={20} />, label: "GitHub" },
    { href: "https://www.linkedin.com/in/somesankar-santra-3b811b222/", icon: <Linkedin size={20} />, label: "LinkedIn" },
    { href: "somesankarsantra199818@gmail.com", icon: <Mail size={20} />, label: "Email" },
  ];

  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-[oklch(0.704_0.14_182.503)] via-[oklch(0.66_0.14_182.503)] to-[oklch(0.58_0.14_182.503)] text-white border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo / Brand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xl font-bold tracking-wide"
        >
          <Link href="/">ChatMate</Link>
        </motion.div>

        {/* Links */}
        <div className="flex space-x-6 text-sm font-medium">
          <Link href="/forums" className="hover:text-yellow-300 transition-colors">Forums</Link>
          {/* <Link href="/ai-agent" className="hover:text-yellow-300 transition-colors">AI Agent</Link> */}
          {/* <Link href="/about" className="hover:text-yellow-300 transition-colors">About</Link> */}
        </div>

        {/* Social Icons */}
        <div className="flex space-x-3">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/10 hover:bg-yellow-300/20 transition-colors"
              aria-label={link.label}
            >
              {link.icon}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center text-xs text-white/60 border-t border-white/10 py-2">
        © {year} ChatMate · Built by SOM with ❤️ using Next.js
      </div>
    </motion.footer>
  );
}
