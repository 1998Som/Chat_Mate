// components/Navbar.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const menuItems = [
    { href: "/forums", label: "Forums" },
  
  ];

  // const user = useUser();
  // console.log(user.user?.id);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 10 }}
      className="bg-gradient-to-r from-[oklch(0.704_0.14_182.503)] via-[oklch(0.66_0.14_182.503)] to-[oklch(0.58_0.14_182.503)] text-white backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <motion.div
            className="text-3xl font-extrabold tracking-wide group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="relative inline-block">
              <motion.span
                className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-200 group-hover:to-pink-300"
                animate={{
                  backgroundPosition: ["0%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                ChatMate
              </motion.span>
              <motion.span
                className="absolute inset-0 bg-white/20 rounded-lg blur"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              ></motion.span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10 font-medium text-lg">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Link
                  href={item.href}
                  onClick={() => setActiveLink(item.href)}
                  className={`relative px-3 py-2 rounded-lg hover:bg-white/10 ${
                    activeLink === item.href
                      ? "text-yellow-300"
                      : "hover:text-yellow-200"
                  }`}
                >
                  <span>{item.label}</span>
                  <AnimatePresence>
                    {activeLink === item.href && (
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.2 }}
                      ></motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            ))}

            {/* User Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="ml-4"
            >
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 rounded-full border-2 border-white/20 hover:border-yellow-300 transition-colors duration-200",
                    userButtonPopoverCard:
                      "bg-gradient-to-b from-purple-700/95 to-indigo-900/95 backdrop-blur-lg border border-white/10",
                    userButtonPopoverActionButton:
                      "hover:bg-white/10 text-white",
                    userButtonPopoverActionButtonText: "text-white",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div className="md:hidden" whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 focus:outline-none group rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-6">
                <motion.span
                  className="absolute left-0 w-full h-0.5 bg-white"
                  animate={{
                    top: isOpen ? "50%" : "20%",
                    rotate: isOpen ? 45 : 0,
                    translateY: isOpen ? "-50%" : 0,
                  }}
                  transition={{ duration: 0.2 }}
                ></motion.span>
                <motion.span
                  className="absolute left-0 w-full h-0.5 bg-white top-1/2 -translate-y-1/2"
                  animate={{
                    opacity: isOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                ></motion.span>
                <motion.span
                  className="absolute left-0 w-full h-0.5 bg-white"
                  animate={{
                    top: isOpen ? "50%" : "80%",
                    rotate: isOpen ? -45 : 0,
                    translateY: isOpen ? "-50%" : 0,
                  }}
                  transition={{ duration: 0.2 }}
                ></motion.span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <motion.div className="bg-gradient-to-r from-[oklch(0.704_0.14_182.503)] via-[oklch(0.66_0.14_182.503)] to-[oklch(0.58_0.14_182.503)] backdrop-blur-sm px-6 py-4 space-y-4 text-lg border-t border-white/10">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      setActiveLink(item.href);
                      setIsOpen(false);
                    }}
                    className={`block py-2 px-4 rounded-lg ${
                      activeLink === item.href
                        ? "bg-white/10 text-yellow-300"
                        : "hover:bg-white/10 hover:text-yellow-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile User Button */}
              <motion.div
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                custom={menuItems.length}
                className="pt-4 px-4"
              >
                <div className="flex items-center gap-4">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full border-2 border-white/20",
                        userButtonPopoverCard:
                          "bg-gradient-to-b from-purple-700/95 to-indigo-900/95 backdrop-blur-lg border border-white/10",
                        userButtonPopoverActionButton:
                          "hover:bg-white/10 text-white",
                        userButtonPopoverActionButtonText: "text-white",
                        userButtonPopoverFooter: "hidden",
                      },
                    }}
                  />
                  <span className="text-white/70">Manage Account</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
