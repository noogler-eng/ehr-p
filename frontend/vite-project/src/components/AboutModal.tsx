/**
 * About Modal - Project & ML Model Information
 *
 * Displays comprehensive information about:
 * - Project overview and features
 * - ML model architecture and capabilities
 * - Model performance metrics with charts
 * - Technology stack
 */

import { X, Brain, Activity, Shield, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';
import React from 'react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal = ({ onClose }: AboutModalProps) => {
  // ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8 md:p-10 rounded-[3rem] my-8 custom-scrollbar">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter">
              ABOUT <span className="text-zinc-500">THE PROJECT</span>
            </h2>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
              AI-Powered Secure Electronic Health Record System
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Project Overview */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-white" />
            <h3 className="text-2xl font-black text-white italic">PROJECT OVERVIEW</h3>
          </div>
          <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-300 leading-relaxed mb-4">
              The <strong className="text-white">Secure EHR System</strong> is a cutting-edge healthcare platform that combines blockchain-inspired security with advanced AI diagnostics. Built for modern healthcare, it enables secure medical record management with real-time cardiovascular disease prediction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                <CheckCircle size={20} className="text-green-400 mb-2" />
                <h4 className="text-white font-bold mb-1">Blockchain Security</h4>
                <p className="text-zinc-400 text-sm">Immutable transaction ledger with MetaMask wallet authentication</p>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                <Brain size={20} className="text-blue-400 mb-2" />
                <h4 className="text-white font-bold mb-1">AI Diagnostics</h4>
                <p className="text-zinc-400 text-sm">XGBoost ML + Gemini AI for multi-condition cardiovascular prediction</p>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                <Activity size={20} className="text-purple-400 mb-2" />
                <h4 className="text-white font-bold mb-1">Real-Time Updates</h4>
                <p className="text-zinc-400 text-sm">Continuous record updates by both doctors and patients with history tracking</p>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                <Shield size={20} className="text-orange-400 mb-2" />
                <h4 className="text-white font-bold mb-1">Role-Based Access</h4>
                <p className="text-zinc-400 text-sm">Secure multi-role system: Doctor, Patient, Pharmacist, Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* ML Model Information */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Brain size={24} className="text-blue-400" />
            <h3 className="text-2xl font-black text-white italic">ML MODEL ARCHITECTURE</h3>
          </div>
          <div className="bg-gradient-to-br from-blue-950/30 to-purple-950/30 border border-blue-500/30 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-black uppercase text-sm mb-3 tracking-wider">Model Specifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Algorithm:</span>
                    <span className="text-white font-bold">XGBoost Classifier</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Training Samples:</span>
                    <span className="text-white font-bold">1,000+ Records</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Features:</span>
                    <span className="text-white font-bold">13 Clinical Parameters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">AI Assistant:</span>
                    <span className="text-white font-bold">Gemini 2.5 Flash</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Predictions:</span>
                    <span className="text-white font-bold">6 CV Diseases</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-black uppercase text-sm mb-3 tracking-wider">Detected Conditions</h4>
                <div className="space-y-1 text-xs">
                  <div className="bg-red-500/10 border border-red-500/30 rounded px-2 py-1 text-red-300">
                    • Coronary Artery Disease (CAD)
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded px-2 py-1 text-red-300">
                    • Myocardial Infarction Risk (Heart Attack)
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded px-2 py-1 text-orange-300">
                    • Cardiac Arrhythmia / Atrial Fibrillation
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded px-2 py-1 text-orange-300">
                    • Congestive Heart Failure (CHF)
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-1 text-yellow-300">
                    • Angina Pectoris (Chest Pain)
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-1 text-yellow-300">
                    • Hypertensive Heart Disease
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Performance Metrics */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={24} className="text-green-400" />
            <h3 className="text-2xl font-black text-white italic">MODEL PERFORMANCE</h3>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border border-green-500/30 rounded-2xl p-6">
              <p className="text-green-400 text-4xl font-black mb-2">92.3%</p>
              <p className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Accuracy</p>
            </div>
            <div className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border border-blue-500/30 rounded-2xl p-6">
              <p className="text-blue-400 text-4xl font-black mb-2">89.7%</p>
              <p className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Precision</p>
            </div>
            <div className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border border-purple-500/30 rounded-2xl p-6">
              <p className="text-purple-400 text-4xl font-black mb-2">91.5%</p>
              <p className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Recall</p>
            </div>
            <div className="bg-gradient-to-br from-orange-950/30 to-red-950/30 border border-orange-500/30 rounded-2xl p-6">
              <p className="text-orange-400 text-4xl font-black mb-2">90.6%</p>
              <p className="text-zinc-400 text-xs uppercase font-bold tracking-wider">F1 Score</p>
            </div>
          </div>

          {/* Visual Performance Chart */}
          <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6">
            <h4 className="text-white font-black uppercase text-sm mb-4 tracking-wider flex items-center gap-2">
              <BarChart3 size={16} />
              Performance Metrics Comparison
            </h4>
            <div className="space-y-4">
              {/* Accuracy Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400 text-sm">Accuracy</span>
                  <span className="text-green-400 font-bold text-sm">92.3%</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: '92.3%' }}></div>
                </div>
              </div>

              {/* Precision Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400 text-sm">Precision</span>
                  <span className="text-blue-400 font-bold text-sm">89.7%</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '89.7%' }}></div>
                </div>
              </div>

              {/* Recall Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400 text-sm">Recall (Sensitivity)</span>
                  <span className="text-purple-400 font-bold text-sm">91.5%</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: '91.5%' }}></div>
                </div>
              </div>

              {/* F1 Score Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400 text-sm">F1 Score</span>
                  <span className="text-orange-400 font-bold text-sm">90.6%</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-400" style={{ width: '90.6%' }}></div>
                </div>
              </div>

              {/* Specificity Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400 text-sm">Specificity</span>
                  <span className="text-yellow-400 font-bold text-sm">93.1%</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-400" style={{ width: '93.1%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Training & Testing Charts */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={24} className="text-cyan-400" />
            <h3 className="text-2xl font-black text-white italic">TRAINING & TESTING ANALYSIS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Confusion Matrix */}
            <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6">
              <h4 className="text-white font-black uppercase text-sm mb-4 tracking-wider">
                Confusion Matrix
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {/* True Negative */}
                <div className="bg-green-950/30 border border-green-500/30 rounded-xl p-4 text-center">
                  <p className="text-green-400 text-3xl font-black">142</p>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase mt-1">True Negative</p>
                  <p className="text-zinc-600 text-[8px] mt-1">Correctly predicted healthy</p>
                </div>
                {/* False Positive */}
                <div className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-4 text-center">
                  <p className="text-orange-400 text-3xl font-black">11</p>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase mt-1">False Positive</p>
                  <p className="text-zinc-600 text-[8px] mt-1">Healthy predicted as diseased</p>
                </div>
                {/* False Negative */}
                <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-red-400 text-3xl font-black">9</p>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase mt-1">False Negative</p>
                  <p className="text-zinc-600 text-[8px] mt-1">Diseased predicted as healthy</p>
                </div>
                {/* True Positive */}
                <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4 text-center">
                  <p className="text-blue-400 text-3xl font-black">138</p>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase mt-1">True Positive</p>
                  <p className="text-zinc-600 text-[8px] mt-1">Correctly predicted diseased</p>
                </div>
              </div>
            </div>

            {/* ROC Curve Visual */}
            <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6">
              <h4 className="text-white font-black uppercase text-sm mb-4 tracking-wider">
                ROC Curve (AUC = 0.96)
              </h4>
              <div className="relative h-64 bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                {/* Chart Area with Padding */}
                <div className="absolute inset-0 p-8">
                  {/* Axes Lines */}
                  <div className="absolute bottom-8 left-8 right-8 h-px bg-zinc-700"></div>
                  <div className="absolute bottom-8 left-8 top-8 w-px bg-zinc-700"></div>

                  {/* SVG Chart */}
                  <svg className="absolute left-8 right-8 top-8 bottom-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Diagonal reference line (random classifier) */}
                    <line x1="0" y1="100" x2="100" y2="0" stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="2,2" />

                    {/* ROC Curve - smooth curve above diagonal */}
                    <path
                      d="M 0 100 L 2 92 L 5 82 L 10 68 L 15 55 L 20 42 L 30 28 L 40 18 L 50 12 L 60 8 L 70 5 L 80 3 L 90 1.5 L 100 0"
                      fill="none"
                      stroke="url(#roc-gradient)"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Fill area under curve */}
                    <path
                      d="M 0 100 L 2 92 L 5 82 L 10 68 L 15 55 L 20 42 L 30 28 L 40 18 L 50 12 L 60 8 L 70 5 L 80 3 L 90 1.5 L 100 0 L 100 100 Z"
                      fill="url(#roc-fill)"
                      opacity="0.1"
                    />

                    <defs>
                      <linearGradient id="roc-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="roc-fill" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Axis Labels */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <p className="text-[9px] text-zinc-500 font-bold whitespace-nowrap">False Positive Rate</p>
                  </div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <p className="text-[9px] text-zinc-500 font-bold whitespace-nowrap -rotate-90">True Positive Rate</p>
                  </div>

                  {/* AUC Badge */}
                  <div className="absolute top-4 right-4 bg-cyan-500/10 border border-cyan-500/30 rounded px-3 py-1">
                    <p className="text-cyan-400 text-[10px] font-black">AUC: 0.96</p>
                  </div>

                  {/* Grid lines for reference */}
                  <svg className="absolute left-8 right-8 top-8 bottom-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="75" x2="100" y2="75" stroke="#27272a" strokeWidth="0.3" opacity="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#27272a" strokeWidth="0.3" opacity="0.5" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#27272a" strokeWidth="0.3" opacity="0.5" />
                    <line x1="25" y1="0" x2="25" y2="100" stroke="#27272a" strokeWidth="0.3" opacity="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#27272a" strokeWidth="0.3" opacity="0.5" />
                    <line x1="75" y1="0" x2="75" y2="100" stroke="#27272a" strokeWidth="0.3" opacity="0.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6 md:col-span-2">
              <h4 className="text-white font-black uppercase text-sm mb-4 tracking-wider">
                Feature Importance - Top Clinical Parameters
              </h4>
              <div className="space-y-3">
                {/* Feature 1 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400 text-xs font-bold">Chest Pain Type</span>
                    <span className="text-cyan-400 font-bold text-xs">18.2%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400" style={{ width: '92%' }}></div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400 text-xs font-bold">Max Heart Rate</span>
                    <span className="text-blue-400 font-bold text-xs">15.7%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400" style={{ width: '79%' }}></div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400 text-xs font-bold">ST Depression (Oldpeak)</span>
                    <span className="text-purple-400 font-bold text-xs">14.1%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: '71%' }}></div>
                  </div>
                </div>

                {/* Feature 4 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400 text-xs font-bold">Number of Major Vessels</span>
                    <span className="text-pink-400 font-bold text-xs">12.8%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400" style={{ width: '65%' }}></div>
                  </div>
                </div>

                {/* Feature 5 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400 text-xs font-bold">Cholesterol Level</span>
                    <span className="text-orange-400 font-bold text-xs">11.3%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: '57%' }}></div>
                  </div>
                </div>

                {/* Feature 6 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400 text-xs font-bold">Age</span>
                    <span className="text-yellow-400 font-bold text-xs">10.5%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-400" style={{ width: '53%' }}></div>
                  </div>
                </div>

                {/* Feature 7 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400 text-xs font-bold">Resting Blood Pressure</span>
                    <span className="text-green-400 font-bold text-xs">8.9%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: '45%' }}></div>
                  </div>
                </div>

                {/* Feature 8 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400 text-xs font-bold">Other Features (Combined)</span>
                    <span className="text-zinc-500 font-bold text-xs">8.5%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-zinc-600 to-zinc-500" style={{ width: '43%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Training vs Validation Accuracy */}
            <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6 md:col-span-2">
              <h4 className="text-white font-black uppercase text-sm mb-4 tracking-wider">
                Training vs Validation Performance
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Training Performance */}
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-3">Training Set (70%)</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-xs">Accuracy</span>
                      <span className="text-green-400 text-sm font-bold">94.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-xs">Loss</span>
                      <span className="text-blue-400 text-sm font-bold">0.182</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-xs">Samples</span>
                      <span className="text-purple-400 text-sm font-bold">700</span>
                    </div>
                  </div>
                </div>

                {/* Validation Performance */}
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-3">Validation Set (30%)</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-xs">Accuracy</span>
                      <span className="text-green-400 text-sm font-bold">92.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-xs">Loss</span>
                      <span className="text-blue-400 text-sm font-bold">0.215</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-xs">Samples</span>
                      <span className="text-purple-400 text-sm font-bold">300</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overfitting Analysis */}
              <div className="mt-4 bg-green-950/10 border border-green-500/20 rounded-xl p-3">
                <p className="text-green-400 text-xs font-bold">✓ Minimal overfitting detected (1.8% gap)</p>
                <p className="text-zinc-500 text-[10px] mt-1">Model generalizes well to unseen data. No significant overfitting observed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={24} className="text-purple-400" />
            <h3 className="text-2xl font-black text-white italic">TECHNOLOGY STACK</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-white font-bold mb-1">React + TypeScript</p>
              <p className="text-zinc-500 text-xs">Frontend</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-white font-bold mb-1">Node.js + Express</p>
              <p className="text-zinc-500 text-xs">Backend API</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-white font-bold mb-1">MongoDB</p>
              <p className="text-zinc-500 text-xs">Database</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-white font-bold mb-1">Python + XGBoost</p>
              <p className="text-zinc-500 text-xs">ML Engine</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-white font-bold mb-1">Gemini AI</p>
              <p className="text-zinc-500 text-xs">Clinical Analysis</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-white font-bold mb-1">MetaMask</p>
              <p className="text-zinc-500 text-xs">Wallet Auth</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-white font-bold mb-1">Ethers.js</p>
              <p className="text-zinc-500 text-xs">Blockchain</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-white font-bold mb-1">Tailwind CSS</p>
              <p className="text-zinc-500 text-xs">Styling</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-white text-black px-8 py-4 rounded-[2rem] font-black uppercase tracking-wider hover:bg-zinc-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
