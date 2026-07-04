import { Bell, Search, Sparkles, CalendarDays, Italic } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar() {
  const today = new Date();

  const hour = today.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="h-20 border-b border-ink-600 bg-ink-900/95 backdrop-blur-xl"
    >
      <div className="flex h-full items-center justify-between px-4 pl-16 md:px-8 md:pl-8">

        {/* Left */}

        <div>

          <h2 className="font-display text-xl md:text-3xl text-parchment">
            Welcome Back, Nakul! 👋
          </h2>

          {/* <p className="mt-1 text-sm text-parchment-dim">
            
          </p> */}

        </div>

        {/* Search */}

        <div className="hidden w-[430px] xl:block">

          <div className="flex items-center rounded-2xl border border-ink-600 bg-ink-800 px-4 py-3 transition duration-300 focus-within:border-emerald">

            <Search
              size={18}
              className="text-gold"
            />

            <input
              placeholder="Search companies, news or portfolio..."
              className="ml-3 border-none bg-transparent p-0 text-parchment placeholder:text-parchment-dim focus:ring-0"
            />

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          {/* AI Status */}

          <div className="hidden items-center gap-2 rounded-full border border-emerald/20 bg-emerald/10 px-4 py-2 md:flex">

            <Sparkles
              size={15}
              className="text-emerald-light"
            />

            <span className="text-sm font-medium text-emerald-light">
              AI Online
            </span>

          </div>

          {/* Notification */}

          <button className="relative rounded-2xl border border-ink-600 bg-ink-800 p-3 transition hover:bg-ink-700">

            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald" />

          </button>

          {/* User */}

          <div className="hidden sm:block rounded-2xl border border-ink-600 bg-ink-800 px-5 py-3">

            <div className="font-semibold text-parchment">
              Nakul
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-parchment-dim">

              <CalendarDays size={13} />

              {today.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}

            </div>

          </div>

        </div>

      </div>

    </motion.header>
  );
}