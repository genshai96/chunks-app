import { motion } from "framer-motion";
import { 
  Target, 
  Flame, 
  TrendingUp, 
  Clock,
  Trophy,
  History,
  Loader2,
  Calendar
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useUserStats } from "@/hooks/usePractice";
import { formatDistanceToNow, format } from "date-fns";

const Progress = () => {
  const { data: userStats, isLoading } = useUserStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Your Progress
            </h1>
            <p className="text-muted-foreground">
              Track your learning journey and see how far you've come.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Current Streak"
              value={`${userStats?.streak || 0} days`}
              icon={Flame}
              variant="primary"
            />
            <StatsCard
              title="Total Practices"
              value={userStats?.totalPractice?.toString() || "0"}
              icon={Target}
              variant="default"
            />
            <StatsCard
              title="Average Score"
              value={userStats?.avgScore ? `${userStats.avgScore}%` : "--"}
              icon={TrendingUp}
              variant="success"
            />
            <StatsCard
              title="Practice Time"
              value={`${userStats?.practiceHours || 0}h`}
              subtitle="this week"
              icon={Clock}
              variant="accent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-xl">
                  Recent Activity
                </h2>
              </div>
              
              {userStats?.recentHistory && userStats.recentHistory.length > 0 ? (
                <div className="space-y-4">
                  {userStats.recentHistory.map((history: any, i: number) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          history.score >= 70 ? "bg-success/20 text-success" : "bg-muted/50 text-muted-foreground"
                        }`}>
                          <Target size={24} />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {history.category} Practice
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(history.practiced_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          history.score >= 70 ? "text-success" : "text-muted-foreground"
                        }`}>
                          {history.score}%
                        </div>
                        <div className={`text-sm font-medium ${
                          history.coins_earned >= 0 ? "text-success" : "text-destructive"
                        }`}>
                          {history.coins_earned >= 0 ? "+" : ""}{history.coins_earned} coins
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No activity yet. Start practicing to see your progress!
                  </p>
                </div>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-xl">
                  Achievements
                </h2>
              </div>
              
              <div className="space-y-4">
                {/* Streak Achievement */}
                <div className={`p-4 rounded-xl border ${
                  (userStats?.streak || 0) >= 3 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-muted/20 border-border/30"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      (userStats?.streak || 0) >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <Flame size={20} />
                    </div>
                    <div>
                      <div className="font-medium">3-Day Streak</div>
                      <div className="text-sm text-muted-foreground">
                        Practice 3 days in a row
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practice Achievement */}
                <div className={`p-4 rounded-xl border ${
                  (userStats?.totalPractice || 0) >= 10 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-muted/20 border-border/30"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      (userStats?.totalPractice || 0) >= 10 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <Target size={20} />
                    </div>
                    <div>
                      <div className="font-medium">First 10 Practices</div>
                      <div className="text-sm text-muted-foreground">
                        Complete 10 practice sessions
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Achievement */}
                <div className={`p-4 rounded-xl border ${
                  (userStats?.avgScore || 0) >= 80 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-muted/20 border-border/30"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      (userStats?.avgScore || 0) >= 80 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <Trophy size={20} />
                    </div>
                    <div>
                      <div className="font-medium">High Performer</div>
                      <div className="text-sm text-muted-foreground">
                        Maintain 80%+ average score
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;
