'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Zap,
  Brain,
  Play,
  Download,
  Copy,
  Sparkles,
  BarChart3,
  Volume2,
  Video,
  Settings,
  Lightbulb,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { orchestratorService } from '@/lib/api/orchestrator';
import { METHODOLOGIES, type PromptMethodology } from '@/lib/prompt-engineering/methodologies';
import type { AdvancedOptimizationResponse, WowMetrics } from '@/lib/api/orchestrator';

interface OptimizationSettings {
  complexity: 'basic' | 'pro' | 'genius';
  methodology?: PromptMethodology;
  generateAudio: boolean;
  generateVideo: boolean;
  targetModel: 'gpt-4' | 'claude-3' | 'gemini-pro';
  taskType: string;
  useGraphRAG: boolean;
  knowledgeDomains: string[];
}

interface WowMeterDisplayProps {
  wowMetrics: WowMetrics;
  className?: string;
}

const WowMeterDisplay: React.FC<WowMeterDisplayProps> = ({ wowMetrics, className = '' }) => {
  const { overall, breakdown, factors } = wowMetrics;
  const wowAssessment = {
    level: overall >= 9 ? 'mind-blowing' : overall >= 8 ? 'amazing' : overall >= 7 ? 'great' : overall >= 6 ? 'good' : 'meh',
    emoji: overall >= 9 ? '🤯' : overall >= 8 ? '🚀' : overall >= 7 ? '✨' : overall >= 6 ? '👍' : '🤔',
    color: overall >= 9 ? 'text-purple-600' : overall >= 8 ? 'text-blue-600' : overall >= 7 ? 'text-green-600' : overall >= 6 ? 'text-yellow-600' : 'text-gray-600'
  };

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Wow Factor Analysis</h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{wowAssessment.emoji}</span>
          <span className={`text-xl font-bold ${wowAssessment.color}`}>
            {overall.toFixed(1)}/10
          </span>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="mb-6">
        <div className={`text-lg font-medium capitalize ${wowAssessment.color}`}>
          {wowAssessment.level} Results!
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${(overall / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-sm font-medium text-gray-600 capitalize mb-1">
              {key.replace('_', ' ')}
            </div>
            <div className="text-lg font-bold text-gray-800">{value.toFixed(1)}</div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${(value / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Wow Factors */}
      {factors.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3">Key Wow Factors</h4>
          <div className="space-y-2">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${factor.impact === 'exceptional' ? 'bg-purple-100 text-purple-800' :
                      factor.impact === 'high' ? 'bg-blue-100 text-blue-800' :
                      factor.impact === 'medium' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {factor.impact}
                  </span>
                  <span className="text-sm text-gray-700">{factor.description}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {factor.score.toFixed(1)}/10
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdvancedOptimizer() {
  const [prompt, setPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<AdvancedOptimizationResponse | null>(null);
  const [settings, setSettings] = useState<OptimizationSettings>({
    complexity: 'pro',
    generateAudio: true,
    generateVideo: false,
    targetModel: 'gpt-4',
    taskType: 'general',
    useGraphRAG: false,
    knowledgeDomains: []
  });
  const [showSettings, setShowSettings] = useState(false);
  const [quickWowScore, setQuickWowScore] = useState<number | null>(null);

  // Debounced quality assessment
  useEffect(() => {
    if (prompt.length < 20) {
      setQuickWowScore(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const quickWow = await orchestratorService.getQuickWowAssessment({ prompt });
        setQuickWowScore(quickWow.wow_score);
      } catch (error) {
        console.error('Quick assessment failed:', error);
        setQuickWowScore(null);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [prompt]);

  const handleOptimize = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to optimize');
      return;
    }

    setIsOptimizing(true);
    try {
      const optimizationResult = await orchestratorService.optimizePromptAdvanced({
        prompt: prompt.trim(),
        task_type: settings.taskType,
        complexity: settings.complexity,
        methodology: settings.methodology,
        generate_audio: settings.generateAudio,
        generate_video: settings.generateVideo,
        target_model: settings.targetModel,
        use_graph_rag: settings.useGraphRAG,
        knowledge_domains: settings.knowledgeDomains
      });

      setResult(optimizationResult);
      toast.success(`Optimization complete! Wow score: ${optimizationResult.wow_metrics.overall.toFixed(1)}/10`);
    } catch (error) {
      console.error('Optimization failed:', error);
      toast.error('Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  }, [prompt, settings]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const availableMethodologies = useMemo(() =>
    Object.values(METHODOLOGIES).filter(method => {
      if (settings.complexity === 'basic') return method.complexity === 'basic';
      if (settings.complexity === 'pro') return ['basic', 'pro'].includes(method.complexity);
      return true;
    }), [settings.complexity]
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <Zap className="w-12 h-12 text-purple-600" />
            <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            PromptForge Advanced Optimizer
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your prompts with advanced techniques. Get instant optimization,
          performance metrics, and actionable insights.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Your Prompt</span>
              </h2>
              {quickWowScore && (
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Quality score: <span className="font-semibold">{quickWowScore.toFixed(1)}/10</span>
                  </span>
                </div>
              )}
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                {prompt.length} characters • {Math.ceil(prompt.length / 4)} estimated tokens
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleOptimize}
                  disabled={!prompt.trim() || isOptimizing}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isOptimizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Optimize</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Optimization Settings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Complexity Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complexity Level
                  </label>
                  <select
                    value={settings.complexity}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      complexity: e.target.value as 'basic' | 'pro' | 'genius'
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="basic">Basic - Quick improvements</option>
                    <option value="pro">Pro - Advanced techniques</option>
                    <option value="genius">Genius - Cutting-edge methods</option>
                  </select>
                </div>

                {/* Methodology */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Methodology (Auto if not selected)
                  </label>
                  <select
                    value={settings.methodology || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      methodology: e.target.value as PromptMethodology || undefined
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Auto-select best method</option>
                    {availableMethodologies.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name} ({method.qualityMultiplier}x impact)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type
                  </label>
                  <select
                    value={settings.taskType}
                    onChange={(e) => setSettings(prev => ({ ...prev, taskType: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="general">General</option>
                    <option value="creative">Creative Writing</option>
                    <option value="analysis">Analysis & Research</option>
                    <option value="coding">Code Generation</option>
                    <option value="business">Business Communication</option>
                    <option value="education">Educational Content</option>
                  </select>
                </div>

                {/* Target Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Model
                  </label>
                  <select
                    value={settings.targetModel}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      targetModel: e.target.value as 'gpt-4' | 'claude-3' | 'gemini-pro'
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="gpt-4">GPT-4 (Creative, Versatile)</option>
                    <option value="claude-3">Claude-3 (Analytical, Ethical)</option>
                    <option value="gemini-pro">Gemini Pro (Factual, Real-time)</option>
                  </select>
                </div>
              </div>

              {/* Advanced Features */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Advanced Features
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.useGraphRAG}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        useGraphRAG: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Use GraphRAG Knowledge Synthesis</span>
                  </label>

                  {settings.useGraphRAG && (
                    <div className="ml-6 space-y-2">
                      <label className="block text-xs font-medium text-gray-600">
                        Knowledge Domains (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., technology, business, science"
                        value={settings.knowledgeDomains.join(', ')}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          knowledgeDomains: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }))}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Wow Effects */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Wow Effects
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.generateAudio}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        generateAudio: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Volume2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Generate Audio Summary</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.generateVideo}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        generateVideo: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Video className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Generate Video Overview (Coming Soon)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              {/* Optimized Prompt */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span>Optimized Prompt</span>
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCopy(result.optimization.optimizedPrompt, 'Optimized prompt')}
                      className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {result.optimization.optimizedPrompt}
                  </pre>
                </div>

                {/* Optimization Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +{result.optimization.estimatedPerformanceGain}%
                    </div>
                    <div className="text-xs text-gray-600">Performance Gain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.optimization.qualityScore}/10
                    </div>
                    <div className="text-xs text-gray-600">Quality Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      +{result.optimization.metadata.tokensAdded}
                    </div>
                    <div className="text-xs text-gray-600">Tokens Added</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {result.optimization.metadata.timeToOptimize}s
                    </div>
                    <div className="text-xs text-gray-600">Processing Time</div>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              {result.audio && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                      <Volume2 className="w-5 h-5 text-blue-600" />
                      <span>AI-Generated Audio Summary</span>
                    </h3>
                    <div className="text-sm text-gray-600">
                      {Math.floor(result.audio.script.totalDuration / 60)}:
                      {(result.audio.script.totalDuration % 60).toString().padStart(2, '0')} mins
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">{result.audio.script.title}</h4>
                    <p className="text-sm text-blue-800">
                      {result.audio.script.segments.length} segments • {result.audio.script.metadata.wordCount} words
                    </p>
                  </div>

                  {/* Audio Player Placeholder */}
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Audio file would be available here</p>
                    <button className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Play className="w-4 h-4" />
                      <span>Play Audio Summary</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Methodology Info */}
          {settings.methodology && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Method</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-purple-600">
                    {METHODOLOGIES[settings.methodology].name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {METHODOLOGIES[settings.methodology].description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Impact:</span>
                  <span className="font-medium text-green-600">
                    {METHODOLOGIES[settings.methodology].qualityMultiplier}× improvement
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-blue-600">
                    ~{METHODOLOGIES[settings.methodology].timeToOptimize}s
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Wow Metrics */}
          {result && (
            <WowMeterDisplay wowMetrics={result.wow_metrics} />
          )}

          {/* Tips & Recommendations */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span>Pro Tips</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600">•</span>
                <span>Be specific about your desired output format and style</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600">•</span>
                <span>Include context about your audience and use case</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600">•</span>
                <span>Try different complexity levels for varied approaches</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600">•</span>
                <span>Enable audio summaries for better understanding</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}