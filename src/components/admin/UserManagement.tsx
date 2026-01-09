import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAllUsers } from '@/hooks/useUserData';
import { useAddCoins } from '@/hooks/useCoinWallet';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  Users,
  Search,
  Coins,
  Shield,
  User as UserIcon,
  GraduationCap
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const UserManagement: React.FC = () => {
  const { data: users, isLoading } = useAllUsers();
  const addCoins = useAddCoins();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [coinAmount, setCoinAmount] = useState('');
  const [coinDescription, setCoinDescription] = useState('');
  const [isCoinsDialogOpen, setIsCoinsDialogOpen] = useState(false);

  const handleAddCoins = async () => {
    if (!selectedUser || !coinAmount) return;
    
    await addCoins.mutateAsync({
      userId: selectedUser.id,
      amount: parseInt(coinAmount),
      description: coinDescription || 'Admin adjustment'
    });
    
    setIsCoinsDialogOpen(false);
    setCoinAmount('');
    setCoinDescription('');
    setSelectedUser(null);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole as 'admin' | 'teacher' | 'user'
        });

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      toast.success('Role updated successfully');
    } catch (error: any) {
      toast.error(`Failed to update role: ${error.message}`);
    }
  };

  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'teacher': return <GraduationCap className="w-4 h-4" />;
      default: return <UserIcon className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive/10 text-destructive';
      case 'teacher': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Users</h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-[250px]"
          />
        </div>
      </div>

      {filteredUsers?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No users found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredUsers?.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="group hover:border-primary/50 transition-colors">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{user.display_name || 'No name'}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Coin Balance */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 rounded-lg">
                        <Coins className="w-4 h-4 text-accent" />
                        <span className="font-medium text-accent">
                          {user.wallet?.balance || 0}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsCoinsDialogOpen(true);
                        }}
                      >
                        Adjust
                      </Button>
                    </div>
                    
                    {/* Role Selector */}
                    <Select 
                      value={user.role} 
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className={`w-[130px] ${getRoleColor(user.role)}`}>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4" />
                            User
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Teacher
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Coins Dialog */}
      <Dialog open={isCoinsDialogOpen} onOpenChange={setIsCoinsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Coins</DialogTitle>
            <DialogDescription>
              Add or remove coins for {selectedUser?.display_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-accent">
                {selectedUser?.wallet?.balance || 0} coins
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (use negative to deduct)</label>
              <Input
                type="number"
                placeholder="e.g., 100 or -50"
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Reason for adjustment..."
                value={coinDescription}
                onChange={(e) => setCoinDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCoinsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCoins}
              disabled={!coinAmount || addCoins.isPending}
            >
              {addCoins.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
