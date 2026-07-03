import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-ink-950 text-parchment">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Topbar />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
          className="flex-1 overflow-y-auto bg-grid bg-[length:32px_32px] p-8"
        >
          <Outlet />
        </motion.main>

      </div>

    </div>
  );
}