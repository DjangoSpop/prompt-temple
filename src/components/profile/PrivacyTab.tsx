// 🏛️ Enhanced Profile Features - Sprint 2 Additional Components


// File: src/components/profile/PrivacyTab.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card-unified';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Users, 
  Globe, 
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  show_activity: boolean;
  show_templates: boolean;
  show_achievements: boolean;
  data_processing_consent: boolean;
  analytics_consent: boolean;
  marketing_consent: boolean;
  third_party_sharing: boolean;
}

export const PrivacyTab = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'public',
    show_activity: true,
    show_templates: true,
    show_achievements: true,
    data_processing_consent: true,
    analytics_consent: true,
    marketing_consent: false,
    third_party_sharing: false,
  });

  const updateSetting = (key: keyof PrivacySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Visible to everyone' },
    { value: 'friends', label: 'Friends', icon: Users, description: 'Visible to friends only' },
    { value: 'private', label: 'Private', icon: Lock, description: 'Visible only to you' }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card variant="default" padding="lg">
        <h3 className="text-lg font-semibold text-fg mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Profile Visibility
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label>Who can see your profile</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              {visibilityOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => updateSetting('profile_visibility', option.value)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      settings.profile_visibility === option.value
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:bg-card/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <p className="text-sm text-fg/60">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Activity Feed</Label>
                <p className="text-sm text-fg/60">Display your recent template usage and achievements</p>
              </div>
              <Switch
                checked={settings.show_activity}
                onCheckedChange={(checked) => updateSetting('show_activity', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Templates</Label>
                <p className="text-sm text-fg/60">Allow others to see your created templates</p>
              </div>
              <Switch
                checked={settings.show_templates}
                onCheckedChange={(checked) => updateSetting('show_templates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Achievements</Label>
                <p className="text-sm text-fg/60">Display your badges and level progress</p>
              </div>
              <Switch
                checked={settings.show_achievements}
                onCheckedChange={(checked) => updateSetting('show_achievements', checked)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Data Processing */}
      <Card variant="default" padding="lg">
        <h3 className="text-lg font-semibold text-fg mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Data Processing
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Data Processing Consent</Label>
              <p className="text-sm text-fg/60">Allow processing of your data to improve our services</p>
            </div>
            <Switch
              checked={settings.data_processing_consent}
              onCheckedChange={(checked) => updateSetting('data_processing_consent', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics Consent</Label>
              <p className="text-sm text-fg/60">Help us understand how you use our platform</p>
            </div>
            <Switch
              checked={settings.analytics_consent}
              onCheckedChange={(checked) => updateSetting('analytics_consent', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing Consent</Label>
              <p className="text-sm text-fg/60">Receive personalized marketing communications</p>
            </div>
            <Switch
              checked={settings.marketing_consent}
              onCheckedChange={(checked) => updateSetting('marketing_consent', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Third-Party Sharing</Label>
              <p className="text-sm text-fg/60">Allow sharing anonymized data with partners</p>
            </div>
            <Switch
              checked={settings.third_party_sharing}
              onCheckedChange={(checked) => updateSetting('third_party_sharing', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Data Rights */}
      <Card variant="temple" padding="lg">
        <h3 className="text-lg font-semibold text-fg mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Your Data Rights
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download My Data
            </Button>
            
            <Button variant="outline" className="justify-start">
              <Eye className="h-4 w-4 mr-2" />
              View Data Usage
            </Button>
          </div>
          
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Delete All Data</h4>
                <p className="text-sm text-red-700 mt-1">
                  Permanently delete all your data from our servers. This action cannot be undone.
                </p>
                <Button variant="outline" size="sm" className="mt-3 text-red-600 border-red-300">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Request Data Deletion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// File: src/app/profile/page-enhanced.tsx - Updated main profile page with all tabs
