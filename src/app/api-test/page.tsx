'use client';

import React, { useState, useEffect } from 'react';
import { usePromptTemple } from '@/hooks/usePromptTemple';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, TestTube, Zap } from 'lucide-react';

export default function ApiTestPage() {
  const {
    isConnected,
    isLoading,
    error,
    profile,
    connect,
    getTemplates,
    getCategories,
    assessPrompt,
    optimizePrompt,
    getTemplateRecommendations,
    clearError,
  } = usePromptTemple();

  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error' | 'loading'>>({});
  const [testOutputs, setTestOutputs] = useState<Record<string, any>>({});
  const [promptText, setPromptText] = useState('Write a professional email to a client about project delays');

  // Test functions
  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setTestResults(prev => ({ ...prev, [testName]: 'loading' }));
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: 'success' }));
      setTestOutputs(prev => ({ ...prev, [testName]: result }));
    } catch (err) {
      setTestResults(prev => ({ ...prev, [testName]: 'error' }));
      setTestOutputs(prev => ({ ...prev, [testName]: err instanceof Error ? err.message : String(err) }));
    }
  };

  const testHealthCheck = () => runTest('health', async () => {
    const response = await fetch('https://api.prompt-temple.com/health/');
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  });

  const testGetTemplates = () => runTest('templates', async () => {
    return await getTemplates({ page_size: 5 });
  });

  const testGetCategories = () => runTest('categories', async () => {
    return await getCategories();
  });

  const testAssessPrompt = () => runTest('assess', async () => {
    return await assessPrompt({
      prompt: promptText,
      context: 'business_communication',
    });
  });

  const testOptimizePrompt = () => runTest('optimize', async () => {
    return await optimizePrompt(promptText, {
      intent: 'professional_communication',
      targetAudience: 'business_clients',
      desiredTone: 'professional',
    });
  });

  const testRecommendations = () => runTest('recommendations', async () => {
    return await getTemplateRecommendations(promptText, 'communication');
  });

  const runAllTests = async () => {
    await testHealthCheck();
    await testGetTemplates();
    await testGetCategories();
    await testAssessPrompt();
    await testOptimizePrompt();
    await testRecommendations();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'loading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'loading':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (!isConnected && !isLoading) {
      connect();
    }
  }, [isConnected, isLoading, connect]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <TestTube className="w-8 h-8 text-blue-500" />
            Prompt Temple API Integration Test
          </h1>
          <p className="text-gray-600 mt-2">
            Test the integration with your production API endpoints
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? 'default' : 'secondary'}>
                  {isLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">API URL:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  https://api.prompt-temple.com
                </code>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Profile:</span>
                <span className="text-sm text-gray-600">
                  {profile ? profile.email || 'Authenticated' : 'Not authenticated'}
                </span>
              </div>
            </div>

            {error && (
              <Alert className="mt-4">
                <XCircle className="w-4 h-4" />
                <AlertDescription>
                  {error}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={clearError}
                    className="ml-2 p-0 h-auto"
                  >
                    Clear
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Prompt (for AI features)
              </label>
              <Textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter a prompt to test AI features..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={runAllTests} disabled={isLoading}>
                Run All Tests
              </Button>
              <Button variant="outline" onClick={clearError}>
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Individual Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Health Check</span>
                {getStatusIcon(testResults.health || 'pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test basic connectivity to the API
              </p>
              <Button onClick={testHealthCheck} size="sm" disabled={testResults.health === 'loading'}>
                Test Health
              </Button>
              {testOutputs.health && (
                <div className="mt-4">
                  <Badge className={getStatusColor(testResults.health || 'pending')}>
                    {testResults.health}
                  </Badge>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {typeof testOutputs.health === 'string' 
                      ? testOutputs.health 
                      : JSON.stringify(testOutputs.health, null, 2)
                    }
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Get Templates</span>
                {getStatusIcon(testResults.templates || 'pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Fetch templates from the API
              </p>
              <Button onClick={testGetTemplates} size="sm" disabled={testResults.templates === 'loading'}>
                Test Templates
              </Button>
              {testOutputs.templates && (
                <div className="mt-4">
                  <Badge className={getStatusColor(testResults.templates || 'pending')}>
                    {testResults.templates}
                  </Badge>
                  <div className="text-xs text-gray-600 mt-2">
                    {testResults.templates === 'success' && testOutputs.templates.results
                      ? `Found ${testOutputs.templates.results.length} templates`
                      : typeof testOutputs.templates === 'string'
                      ? testOutputs.templates
                      : 'Error occurred'
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Get Categories</span>
                {getStatusIcon(testResults.categories || 'pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Fetch categories from the API
              </p>
              <Button onClick={testGetCategories} size="sm" disabled={testResults.categories === 'loading'}>
                Test Categories
              </Button>
              {testOutputs.categories && (
                <div className="mt-4">
                  <Badge className={getStatusColor(testResults.categories || 'pending')}>
                    {testResults.categories}
                  </Badge>
                  <div className="text-xs text-gray-600 mt-2">
                    {testResults.categories === 'success' && testOutputs.categories.results
                      ? `Found ${testOutputs.categories.results.length} categories`
                      : typeof testOutputs.categories === 'string'
                      ? testOutputs.categories
                      : 'Error occurred'
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assess Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assess Prompt</span>
                {getStatusIcon(testResults.assess || 'pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test AI prompt assessment
              </p>
              <Button onClick={testAssessPrompt} size="sm" disabled={testResults.assess === 'loading'}>
                Test Assessment
              </Button>
              {testOutputs.assess && (
                <div className="mt-4">
                  <Badge className={getStatusColor(testResults.assess || 'pending')}>
                    {testResults.assess}
                  </Badge>
                  <div className="text-xs text-gray-600 mt-2">
                    {testResults.assess === 'success'
                      ? 'Assessment completed'
                      : typeof testOutputs.assess === 'string'
                      ? testOutputs.assess
                      : 'Error occurred'
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Optimize Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Optimize Prompt</span>
                {getStatusIcon(testResults.optimize || 'pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test AI prompt optimization
              </p>
              <Button onClick={testOptimizePrompt} size="sm" disabled={testResults.optimize === 'loading'}>
                Test Optimization
              </Button>
              {testOutputs.optimize && (
                <div className="mt-4">
                  <Badge className={getStatusColor(testResults.optimize || 'pending')}>
                    {testResults.optimize}
                  </Badge>
                  <div className="text-xs text-gray-600 mt-2">
                    {testResults.optimize === 'success'
                      ? 'Optimization completed'
                      : typeof testOutputs.optimize === 'string'
                      ? testOutputs.optimize
                      : 'Error occurred'
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Template Recommendations</span>
                {getStatusIcon(testResults.recommendations || 'pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test template recommendation engine
              </p>
              <Button onClick={testRecommendations} size="sm" disabled={testResults.recommendations === 'loading'}>
                Test Recommendations
              </Button>
              {testOutputs.recommendations && (
                <div className="mt-4">
                  <Badge className={getStatusColor(testResults.recommendations || 'pending')}>
                    {testResults.recommendations}
                  </Badge>
                  <div className="text-xs text-gray-600 mt-2">
                    {testResults.recommendations === 'success' && Array.isArray(testOutputs.recommendations)
                      ? `Found ${testOutputs.recommendations.length} recommendations`
                      : typeof testOutputs.recommendations === 'string'
                      ? testOutputs.recommendations
                      : 'Error occurred'
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter(r => r === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter(r => r === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(testResults).filter(r => r === 'loading').length}
                </div>
                <div className="text-sm text-gray-600">Running</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}