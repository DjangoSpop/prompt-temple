'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card-unified';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '@/lib/api/auth';

// Import all tab components
import { PersonalInfoTab } from '@/components/profile/PersonalInfoTab';
import { PreferencesTab } from '@/components/profile/PreferencesTab';
import { SubscriptionTab } from '@/components/profile/SubscriptionTab';
import { NotificationsTab } from '@/components/profile/NotificationsTab';
import { PrivacyTab } from '@/components/profile/PrivacyTab';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { UserStats, LevelRankDisplay } from '@/components/profile/ProfileComponents';

export default function EnhancedProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
  });
  
  // Save all changes mutation
  const saveChangesMutation = useMutation({
    mutationFn: async (changes: any) => {
      // Combine all form changes and send to API
      return authService.updateProfile(changes);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setHasUnsavedChanges(false);
      toast.success('All changes saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save changes');
    },
  });
  
  const handleSaveAll = () => {
    // Collect all form data from different tabs
    const allChanges = {
      // This would collect data from all tab forms
      // Implementation depends on your form state management
    };
    saveChangesMutation.mutate(allChanges);
  };
  
  if (profileLoading) {
    return (
      <div className="temple-background min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="temple-background min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-fg">Profile Not Found</h1>
            <p className="text-fg/60">Unable to load your profile information.</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="temple-background min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-fg flex items-center justify-center gap-3">
            <User className="h-8 w-8 text-accent" />
            Profile Settings
          </h1>
          <p className="text-fg/70">
            Manage your account settings, preferences, and privacy controls
          </p>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserStats profile={profile} />
          </div>
          <div>
            <LevelRankDisplay profile={profile} />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar 
              profile={profile}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          
          {/* Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <PersonalInfoTab />
              </TabsContent>
              
              <TabsContent value="preferences">
                <PreferencesTab />
              </TabsContent>
              
              <TabsContent value="subscription">
                <SubscriptionTab />
              </TabsContent>
              
              <TabsContent value="notifications">
                <NotificationsTab />
              </TabsContent>
              
              <TabsContent value="privacy">
                <PrivacyTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Global Save Bar */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Card variant="temple" className="flex items-center gap-4 p-4 shadow-lg">
              <span className="text-sm text-fg">You have unsaved changes</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveAll}
                  disabled={saveChangesMutation.isPending}
                >
                  {saveChangesMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHasUnsavedChanges(false)}
                >
                  Discard
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}