import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Volume2, 
  Mic, 
  Square, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CoinBadge } from "@/components/ui/CoinBadge";

interface PracticeItem {
  english: string;
  vietnamese: string;
}

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonName: string;
  category: string;
  items: PracticeItem[];
}

export const PracticeModal = ({
  isOpen,
  onClose,
  lessonName,
  category,
  items,
}: PracticeModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [coinChange, setCoinChange] = useState<number | null>(null);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handleListen = () => {
    // TTS playback would go here
    console.log("Playing TTS for:", currentItem.english);
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate scoring
      const simulatedScore = Math.floor(Math.random() * 40) + 60;
      setScore(simulatedScore);
      setCoinChange(simulatedScore >= 70 ? Math.floor(simulatedScore / 10) : -5);
    } else {
      setIsRecording(true);
      setScore(null);
      setCoinChange(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScore(null);
      setCoinChange(null);
      setShowEnglish(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setScore(null);
      setCoinChange(null);
      setShowEnglish(false);
    }
  };

  const handleRetry = () => {
    setScore(null);
    setCoinChange(null);
    setIsRecording(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl bg-card rounded-3xl border border-border/50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-lg">{lessonName}</h2>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
            <div className="flex items-center gap-3">
              <CoinBadge amount={1250} showChange={coinChange || undefined} />
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="px-6 py-3 bg-secondary/30">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Item {currentIndex + 1} of {items.length}
              </span>
              <span className="font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Vietnamese Text */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">Say this in English:</p>
              <motion.p 
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-display font-semibold text-foreground"
              >
                {currentItem.vietnamese}
              </motion.p>
            </div>

            {/* English Reference */}
            <div className="mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEnglish(!showEnglish)}
                className="mx-auto flex items-center gap-2 text-muted-foreground"
              >
                {showEnglish ? <EyeOff size={16} /> : <Eye size={16} />}
                {showEnglish ? "Hide Answer" : "Show Answer"}
              </Button>
              <AnimatePresence>
                {showEnglish && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-center mt-4 p-4 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <p className="text-lg text-primary">{currentItem.english}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Score Display */}
            {score !== null && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-8"
              >
                <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${
                  score >= 70 ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
                }`}>
                  <span className={`text-4xl font-display font-bold ${
                    score >= 70 ? "text-success" : "text-destructive"
                  }`}>
                    {score}
                  </span>
                  <span className="text-muted-foreground">points</span>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleListen}
                className="gap-2"
              >
                <Volume2 size={20} />
                Listen
              </Button>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={handleRecord}
                  className={`gap-2 w-40 ${
                    isRecording 
                      ? "bg-destructive hover:bg-destructive/90" 
                      : "gradient-primary text-primary-foreground"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square size={20} />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic size={20} />
                      Record
                    </>
                  )}
                </Button>
              </motion.div>

              {score !== null && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RotateCcw size={20} />
                  Retry
                </Button>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-border/50 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ChevronLeft size={20} />
              Previous
            </Button>
            <Button
              variant="default"
              onClick={handleNext}
              disabled={currentIndex === items.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight size={20} />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
