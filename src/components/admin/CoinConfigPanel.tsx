import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCoinConfig, useUpdateCoinConfig, CoinConfig } from '@/hooks/useCoinWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  Coins,
  TrendingUp,
  TrendingDown,
  Clock,
  Save
} from 'lucide-react';

const CoinConfigPanel: React.FC = () => {
  const { data: config, isLoading } = useCoinConfig();
  const updateConfig = useUpdateCoinConfig();
  
  const [localConfig, setLocalConfig] = useState<Partial<CoinConfig>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  const handleChange = (key: keyof CoinConfig, value: number) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await updateConfig.mutateAsync(localConfig);
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Coin Economy</h2>
          <p className="text-muted-foreground">Configure reward and penalty settings</p>
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || updateConfig.isPending}
          className="gap-2"
        >
          {updateConfig.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-success/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <CardTitle className="text-lg">Rewards</CardTitle>
              </div>
              <CardDescription>Coins earned for good performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Reward</label>
                  <Input
                    type="number"
                    value={localConfig.reward_min || 0}
                    onChange={(e) => handleChange('reward_min', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Reward</label>
                  <Input
                    type="number"
                    value={localConfig.reward_max || 0}
                    onChange={(e) => handleChange('reward_max', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Score Threshold</label>
                <Input
                  type="number"
                  value={localConfig.reward_score_threshold || 0}
                  onChange={(e) => handleChange('reward_score_threshold', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum score required to earn coins
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Penalties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-destructive/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                </div>
                <CardTitle className="text-lg">Penalties</CardTitle>
              </div>
              <CardDescription>Coins deducted for poor performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Penalty</label>
                  <Input
                    type="number"
                    value={localConfig.penalty_min || 0}
                    onChange={(e) => handleChange('penalty_min', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Penalty</label>
                  <Input
                    type="number"
                    value={localConfig.penalty_max || 0}
                    onChange={(e) => handleChange('penalty_max', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Penalty Threshold</label>
                <Input
                  type="number"
                  value={localConfig.penalty_score_threshold || 0}
                  onChange={(e) => handleChange('penalty_score_threshold', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Below this score, coins are deducted
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Deadlines</CardTitle>
              </div>
              <CardDescription>Bonus/penalty for deadline compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Early Bonus</label>
                  <Input
                    type="number"
                    value={localConfig.deadline_bonus || 0}
                    onChange={(e) => handleChange('deadline_bonus', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Late Penalty</label>
                  <Input
                    type="number"
                    value={localConfig.deadline_penalty || 0}
                    onChange={(e) => handleChange('deadline_penalty', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Withdrawal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-accent/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-accent" />
                </div>
                <CardTitle className="text-lg">Withdrawal Rules</CardTitle>
              </div>
              <CardDescription>Requirements for coin withdrawal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lessons Required</label>
                <Input
                  type="number"
                  value={localConfig.lessons_required_for_withdraw || 0}
                  onChange={(e) => handleChange('lessons_required_for_withdraw', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Average Score (%)</label>
                <Input
                  type="number"
                  value={localConfig.min_avg_score_for_withdraw || 0}
                  onChange={(e) => handleChange('min_avg_score_for_withdraw', parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CoinConfigPanel;
