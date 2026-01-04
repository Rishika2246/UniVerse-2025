import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Brain, Zap, Target, Lightbulb, Network,
  TrendingUp, Clock, Award, Sparkles, Map, Calendar
} from 'lucide-react';
import { MindMapGenerator } from './MindMapGenerator';
import { NotesGeneratorModal } from './NotesGeneratorModal';
import { SmartSummariesModal } from './SmartSummariesModal';
import { FlashcardsCreatorModal } from './FlashcardsCreatorModal';
import { QuizGeneratorModal } from './QuizGeneratorModal';

import { MindMapHelper } from './MindMapHelper';
import { RevisionPlanner } from './RevisionPlanner';

export function StudySuite() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const studyTools = [
    {
      id: 'revision',
      title: 'Revision Planner',
      description: 'Smart weekly revision generator with auto-adjustment and rest day suggestions',
      icon: Calendar,
      gradient: 'from-purple-400 via-fuchsia-400 to-pink-400',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      stats: { created: 4, lastUsed: 'Just now' }
    },
    {
      id: 'mindmap',
      title: 'Mind Map Helper',
      description: 'Upload syllabus PDFs and generate interactive mind maps with resources',
      icon: Map,
      gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
      bgGradient: 'from-cyan-500/10 to-blue-500/10',
      stats: { created: 8, lastUsed: '30 mins ago' }
    },
    {
      id: 'notes',
      title: 'Notes Generator',
      description: 'AI-powered comprehensive lecture notes from your topics',
      icon: FileText,
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      stats: { created: 45, lastUsed: '2 hours ago' }
    },
    {
      id: 'summaries',
      title: 'Smart Summaries',
      description: 'Condensed, focused summaries for quick revision',
      icon: Brain,
      gradient: 'from-purple-400 via-pink-400 to-rose-400',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      stats: { created: 32, lastUsed: '5 hours ago' }
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Interactive flashcards for active recall practice',
      icon: Zap,
      gradient: 'from-amber-400 via-orange-400 to-red-400',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      stats: { created: 28, lastUsed: '1 day ago' }
    },
    {
      id: 'quiz',
      title: 'Quiz Generator',
      description: 'Custom quizzes to test your knowledge and track progress',
      icon: Target,
      gradient: 'from-emerald-400 via-green-400 to-teal-400',
      bgGradient: 'from-green-500/10 to-teal-500/10',
      stats: { created: 19, lastUsed: '3 hours ago' }
    },
    {
      id: 'concept',
      title: 'Concept Maps',
      description: 'Hierarchical concept mapping for better understanding',
      icon: Lightbulb,
      gradient: 'from-indigo-400 via-violet-400 to-purple-400',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      stats: { created: 15, lastUsed: '1 week ago' }
    },

  ];

  const studyStats = {
    totalStudyTime: '127h 30m',
    toolsUsed: 151,
    avgScore: 87,
    streak: 12
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Study Suite
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          AI-powered study tools to enhance your learning experience
        </p>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Total Study Time</p>
                <p className="text-xl font-bold text-white">{studyStats.totalStudyTime}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Average Score</p>
                <p className="text-xl font-bold text-white">{studyStats.avgScore}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-gray-400">Study Streak</p>
                <p className="text-xl font-bold text-white">{studyStats.streak} days</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Study Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {studyTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={() => setActiveModal(tool.id)}
            className="group cursor-pointer"
          >
            <div className={`relative h-full bg-gradient-to-br ${tool.bgGradient} backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-2xl`}>
              {/* Animated Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Floating Orb */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${tool.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

              {/* Icon */}
              <div className={`relative mb-6 w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <tool.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="relative space-y-3">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-300 leading-relaxed min-h-[3rem]">
                  {tool.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="font-bold text-white">{tool.stats.created}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Last Used</p>
                    <p className="text-sm text-cyan-300">{tool.stats.lastUsed}</p>
                  </div>
                </div>

                {/* Launch Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full mt-4 py-3 bg-gradient-to-r ${tool.gradient} rounded-xl text-white font-semibold shadow-lg opacity-90 group-hover:opacity-100 transition-opacity`}
                >
                  Launch Tool
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'notes' && (
          <NotesGeneratorModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'summaries' && (
          <SmartSummariesModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'flashcards' && (
          <FlashcardsCreatorModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'quiz' && (
          <QuizGeneratorModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'concept' && (
          <MindMapGenerator onClose={() => setActiveModal(null)} />
        )}



        {activeModal === 'mindmap' && (
          <MindMapHelper onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'revision' && (
          <RevisionPlanner onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}