import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950 text-parchment">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="
          fixed
          left-4
          top-4
          z-50
          rounded-xl
          bg-ink-900
          p-2
          shadow-lg
          md:hidden
        "
      >
        <Menu size={22} />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed
          z-50
          h-full
          transition-transform
          duration-300
          ease-in-out

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:relative
          md:translate-x-0
        `}
      >
        <div className="relative h-full">

          {/* Close Button */}

          <button
            onClick={() => setSidebarOpen(false)}
            className="
              absolute
              right-4
              top-4
              rounded-lg
              bg-ink-800
              p-2
              md:hidden
            "
          >
            <X size={20} />
          </button>

          <Sidebar />

        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        <Topbar />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
          className="flex-1 overflow-y-auto bg-grid bg-[length:32px_32px] p-4 md:p-8"
        >
          <Outlet />
        </motion.main>

      </div>

    </div>
  );
}