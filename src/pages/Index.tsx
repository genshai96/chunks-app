import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Target, 
  Flame, 
  TrendingUp, 
  Clock,
  Mic,
  Play
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { LessonItem } from "@/components/dashboard/LessonItem";
import { CategoryTabs } from "@/components/dashboard/CategoryTabs";
import { PracticeItemCard } from "@/components/dashboard/PracticeItemCard";
import { PracticeModal } from "@/components/practice/PracticeModal";
import { Button } from "@/components/ui/button";

// Mock data
const mockCourses = [
  {
    code: "EREL",
    name: "English Real-Life Elementary",
    description: "Master everyday English through real-world conversations and practical scenarios.",
    lessonsCount: 15,
    studentsCount: 45,
    progress: 33,
    enrolled: true,
  },
  {
    code: "ERES",
    name: "English Real-Life Starter",
    description: "Perfect for beginners. Build your foundation with essential vocabulary and phrases.",
    lessonsCount: 15,
    studentsCount: 30,
    enrolled: false,
  },
];

const mockLessons = [
  {
    index: 1,
    name: "Food Tour - Street Food Adventures",
    categories: [
      { name: "Vocab", count: 20 },
      { name: "Slang", count: 5 },
      { name: "Phrase", count: 20 },
      { name: "Sentence", count: 9 },
      { name: "Review", count: 20 },
    ],
    deadline: "Jan 20",
    status: "completed" as const,
    score: 85,
  },
  {
    index: 2,
    name: "Coffee Culture - Morning Routines",
    categories: [
      { name: "Vocab", count: 18 },
      { name: "Slang", count: 4 },
      { name: "Phrase", count: 22 },
    ],
    deadline: "Jan 25",
    status: "in-progress" as const,
  },
  {
    index: 3,
    name: "Shopping - Market Bargaining",
    categories: [
      { name: "Vocab", count: 25 },
      { name: "Phrase", count: 15 },
    ],
    deadline: "Jan 30",
    status: "available" as const,
  },
  {
    index: 4,
    name: "Transportation - Getting Around",
    categories: [
      { name: "Vocab", count: 20 },
      { name: "Phrase", count: 18 },
    ],
    deadline: "Feb 5",
    status: "locked" as const,
  },
];

const mockCategories = [
  { id: "vocab", name: "Vocab", count: 20 },
  { id: "slang", name: "Slang", count: 5 },
  { id: "phrase", name: "Phrase", count: 20 },
  { id: "sentence", name: "Sentence", count: 9 },
  { id: "review", name: "Review", count: 20 },
];

const mockPracticeItems = [
  { english: "Tentacle", vietnamese: "Râu mực", mastered: true, score: 92 },
  { english: "I'm getting kinda full now", vietnamese: "Tôi hơi no rồi", mastered: true, score: 88 },
  { english: "Blame yourself for being late", vietnamese: "Ai biểu đến trễ", mastered: false, score: 65 },
  { english: "This is absolutely delicious!", vietnamese: "Món này ngon tuyệt vời!", mastered: false },
  { english: "Can I have the bill please?", vietnamese: "Cho tôi xin hóa đơn", mastered: false },
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<typeof mockLessons[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState("vocab");
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const coins = 1250;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        coins={coins}
      />
      
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground">
              Continue your English learning journey. You're doing great!
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Current Streak"
              value="7 days"
              icon={Flame}
              variant="primary"
              trend={{ value: 14, label: "this week" }}
            />
            <StatsCard
              title="Lessons Completed"
              value="23"
              subtitle="out of 45"
              icon={BookOpen}
              variant="default"
            />
            <StatsCard
              title="Average Score"
              value="82%"
              icon={Target}
              variant="success"
              trend={{ value: 5, label: "improvement" }}
            />
            <StatsCard
              title="Practice Time"
              value="4.5h"
              subtitle="this week"
              icon={Clock}
              variant="accent"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Courses & Lessons */}
            <div className="lg:col-span-2 space-y-6">
              {/* Continue Learning */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-semibold text-foreground">
                    Continue Learning
                  </h2>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All Courses
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCourses.map((course) => (
                    <CourseCard
                      key={course.code}
                      {...course}
                      onEnroll={() => console.log("Enroll in", course.code)}
                      onContinue={() => setSelectedLesson(mockLessons[1])}
                    />
                  ))}
                </div>
              </motion.section>

              {/* Lessons */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-semibold text-foreground">
                    EREL Lessons
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    5/15 completed
                  </span>
                </div>
                <div className="space-y-3">
                  {mockLessons.map((lesson) => (
                    <LessonItem
                      key={lesson.index}
                      {...lesson}
                      onClick={() => setSelectedLesson(lesson)}
                    />
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Practice Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Practice */}
              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="font-display font-semibold text-lg mb-4">
                  Quick Practice
                </h3>
                <CategoryTabs
                  categories={mockCategories}
                  activeCategory={activeCategory}
                  onSelect={setActiveCategory}
                />
                <div className="mt-4 space-y-2">
                  {mockPracticeItems.slice(0, 4).map((item, i) => (
                    <PracticeItemCard
                      key={i}
                      {...item}
                      onClick={() => setIsPracticeOpen(true)}
                      onListen={() => console.log("Listen to", item.english)}
                    />
                  ))}
                </div>
                <Button 
                  className="w-full mt-4 gradient-primary text-primary-foreground"
                  onClick={() => setIsPracticeOpen(true)}
                >
                  <Mic size={18} className="mr-2" />
                  Start Practice Session
                </Button>
              </div>

              {/* Recent Activity */}
              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="font-display font-semibold text-lg mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { action: "Completed D1 Vocab", coins: 15, time: "2h ago" },
                    { action: "Mastered 'Tentacle'", coins: 5, time: "2h ago" },
                    { action: "Started D2 Lesson", coins: 0, time: "1d ago" },
                    { action: "Deadline bonus", coins: 10, time: "2d ago" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{activity.action}</span>
                      <div className="flex items-center gap-2">
                        {activity.coins > 0 && (
                          <span className="text-success font-medium">+{activity.coins}</span>
                        )}
                        <span className="text-muted-foreground text-xs">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Practice Modal */}
      <PracticeModal
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
        lessonName="D1 - Food Tour"
        category="Vocabulary"
        items={mockPracticeItems}
      />
    </div>
  );
};

export default Index;
