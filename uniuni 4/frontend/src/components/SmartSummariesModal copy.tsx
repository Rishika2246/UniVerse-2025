import { useState } from 'react';
import { motion } from 'motion/react';
import {
  X, Brain, Sparkles, Upload, FileText, Download, Share2, Zap,
  CheckCircle, TrendingUp, Clock, Target, Copy, ArrowLeft
} from 'lucide-react';

export function SmartSummariesModal({ onClose }: { onClose: () => void }) {
  const [summaryLength, setSummaryLength] = useState('medium');
  const [focusArea, setFocusArea] = useState('balanced');
  const [generating, setGenerating] = useState(false);
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setSummaryGenerated(true);
    }, 2500);
  };

  const summary = {
    title: "Binary Trees & Tree Traversals",
    readTime: "3 min read",
    keyPoints: [
      "Binary trees are hierarchical structures with max 2 children per node",
      "Four main traversal methods: Inorder, Preorder, Postorder, Level-order",
      "Time complexity: O(log n) for balanced trees, O(n) worst case",
      "Used in file systems, databases, and expression parsing"
    ],
    summary: `Binary trees are fundamental data structures in computer science, featuring a hierarchical organization where each node has at most two children. The structure includes key terminology like root (topmost node), leaves (nodes without children), and height (longest path from root to leaf).

Tree traversals provide different ways to visit nodes: Inorder gives sorted order for BSTs, Preorder helps create copies, Postorder enables deletion, and Level-order performs breadth-first exploration.

Performance varies with tree balance - balanced trees achieve O(log n) operations while worst-case scenarios may degrade to O(n). Applications span file systems, database indexing, and expression parsing, making binary trees essential for efficient data organization.`,
    concepts: ["Data Structures", "Algorithms", "Tree Traversal", "Time Complexity"],
    difficulty: "Medium",
    coverage: 85
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 rounded-2xl border border-purple-200 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-purple-200/50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-purple-900" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-900">Smart Summaries</h2>
              <p className="text-sm text-purple-700">AI-powered intelligent text condensation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-purple-200/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-purple-900" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel */}
          <div className="w-1/2 border-r border-purple-200 p-6 overflow-y-auto">
            <h3 className="text-purple-900 font-bold mb-4">Source Material</h3>
            
            {/* Upload Area */}
            <div className="bg-white border-2 border-dashed border-purple-300 rounded-xl p-8 mb-6 hover:border-purple-400 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-center text-purple-900 mb-2">Upload document to summarize</p>
              <p className="text-center text-xs text-purple-600">
                PDF, DOCX, TXT, or paste text directly
              </p>
            </div>

            {/* Or paste text */}
            <div className="mb-6">
              <label className="text-purple-900 text-sm mb-2 block font-semibold">Or paste text here</label>
              <textarea
                className="w-full h-40 px-4 py-3 bg-white border border-purple-200 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                placeholder="Paste your text, lecture notes, or article here..."
              />
            </div>

            {/* Summary Settings */}
            <div className="space-y-4">
              <div>
                <label className="text-purple-900 text-sm mb-2 block font-semibold">Summary Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {['short', 'medium', 'detailed'].map((length) => (
                    <button
                      key={length}
                      onClick={() => setSummaryLength(length)}
                      className={`py-2 px-4 rounded-lg capitalize transition-all ${
                        summaryLength === length
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                          : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  {summaryLength === 'short' && '~100 words - Key points only'}
                  {summaryLength === 'medium' && '~250 words - Balanced overview'}
                  {summaryLength === 'detailed' && '~500 words - Comprehensive summary'}
                </p>
              </div>

              <div>
                <label className="text-purple-900 text-sm mb-2 block font-semibold">Focus Area</label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-purple-900 focus:outline-none focus:border-purple-400"
                >
                  <option value="balanced">Balanced Overview</option>
                  <option value="concepts">Key Concepts Only</option>
                  <option value="practical">Practical Applications</option>
                  <option value="theory">Theoretical Foundation</option>
                  <option value="examples">Examples & Use Cases</option>
                </select>
              </div>

              {/* AI Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-purple-900 text-sm">Extract Key Points</span>
                  </div>
                  <label className="relative inline-block w-10 h-5">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-purple-200 peer-checked:bg-purple-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-purple-900 text-sm">Highlight Important Terms</span>
                  </div>
                  <label className="relative inline-block w-10 h-5">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-purple-200 peer-checked:bg-purple-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-purple-900 text-sm">Difficulty Assessment</span>
                  </div>
                  <label className="relative inline-block w-10 h-5">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-purple-200 peer-checked:bg-purple-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Smart Summary
                </>
              )}
            </button>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 p-6 overflow-y-auto bg-white/50">
            {!summaryGenerated ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Brain className="w-20 h-20 text-purple-400 mb-4" />
                <h3 className="text-xl text-purple-900 font-bold mb-2">Your Summary Will Appear Here</h3>
                <p className="text-purple-700 text-sm">Upload or paste content to generate an intelligent summary</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900 mb-1">{summary.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-purple-700">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {summary.readTime}
                      </span>
                      <span className={`px-2 py-0.5 rounded ${
                        summary.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                        summary.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {summary.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors">
                      <Copy className="w-4 h-4 text-purple-900" />
                    </button>
                    <button className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-purple-900" />
                    </button>
                    <button className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-purple-900" />
                    </button>
                  </div>
                </div>

                {/* Key Points */}
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <h4 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-blue-900 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary Text */}
                <div className="bg-white p-5 rounded-xl border border-purple-200">
                  <h4 className="text-purple-900 font-bold mb-3">Summary</h4>
                  <p className="text-purple-900 text-sm leading-relaxed whitespace-pre-line">
                    {summary.summary}
                  </p>
                </div>

                {/* Concepts */}
                <div className="bg-pink-50 p-5 rounded-xl border border-pink-200">
                  <h4 className="text-pink-900 font-bold mb-3">Related Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {summary.concepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-white hover:bg-pink-100 text-pink-900 text-sm rounded-lg cursor-pointer transition-colors border border-pink-200"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coverage */}
                <div className="bg-white p-5 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-purple-900 font-bold">Content Coverage</h4>
                    <span className="text-purple-600 font-bold">{summary.coverage}%</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${summary.coverage}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-600 mt-2">
                    Summary captures {summary.coverage}% of the original content's key information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
