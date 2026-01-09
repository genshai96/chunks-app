import { motion } from "framer-motion";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Settings, 
  User, 
  ChevronRight,
  Mic,
  TrendingUp
} from "lucide-react";
import { CoinBadge } from "@/components/ui/CoinBadge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  coins: number;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "practice", label: "Practice", icon: Mic },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
];

const bottomItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({ currentPage, onNavigate, coins }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
            <span className="text-xl font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-xl font-display font-bold text-foreground">CHUNKS</span>
        </motion.div>
      </div>

      {/* Coin Balance */}
      <div className="p-4 mx-4 mt-4 rounded-xl glass-card">
        <p className="text-xs text-muted-foreground mb-2">Your Balance</p>
        <CoinBadge amount={coins} size="lg" />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              currentPage === item.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {currentPage === item.id && (
              <ChevronRight size={16} className="ml-auto" />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              currentPage === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.aside>
  );
};
