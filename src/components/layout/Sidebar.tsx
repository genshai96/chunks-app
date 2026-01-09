import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Settings, 
  User, 
  ChevronRight,
  TrendingUp,
  Shield,
  LogOut,
  Mic
} from "lucide-react";
import { CoinBadge } from "@/components/ui/CoinBadge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/hooks/useUserData";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const menuItems = [
  { id: "dashboard", path: "/", label: "Dashboard", icon: Home },
  { id: "courses", path: "/courses", label: "Courses", icon: BookOpen },
  { id: "practice", path: "/practice", label: "Practice", icon: Mic },
  { id: "progress", path: "/progress", label: "Progress", icon: TrendingUp },
  { id: "leaderboard", path: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const bottomItems = [
  { id: "profile", path: "/profile", label: "Profile", icon: User },
];

export const Sidebar = () => {
  const { isAdmin, isTeacher, signOut } = useAuth();
  const { data: wallet } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <img src={logo} alt="CHUNKS" className="h-10 w-auto" />
          </motion.div>
        </Link>
      </div>

      {/* Coin Balance */}
      <div className="p-4 mx-4 mt-4 rounded-xl glass-card">
        <p className="text-xs text-muted-foreground mb-2">Your Balance</p>
        <CoinBadge amount={wallet?.balance || 0} size="lg" />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.id} to={item.path}>
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive(item.path)
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </motion.div>
          </Link>
        ))}
        
        {/* Admin Link */}
        {(isAdmin || isTeacher) && (
          <Link to="/admin">
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive("/admin")
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Shield size={20} />
              <span className="font-medium">Admin Panel</span>
              {isActive("/admin") && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </motion.div>
          </Link>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <Link key={item.id} to={item.path}>
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.div>
          </Link>
        ))}
        
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </motion.aside>
  );
};
