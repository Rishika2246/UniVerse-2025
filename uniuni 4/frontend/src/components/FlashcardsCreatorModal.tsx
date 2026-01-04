import { useState } from 'react';
import { motion } from 'motion/react';
import {
  X, Zap, Sparkles, CheckCircle, Star,
  TrendingUp, Brain, Download, Share2, ChevronLeft, ChevronRight, ArrowLeft, BookOpen
} from 'lucide-react';

export function FlashcardsCreatorModal({ onClose }: { onClose: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const subjects = [
    { id: 'ds', name: 'Data Structures', chapters: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hashing'] },
    { id: 'web', name: 'Web Development', chapters: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases'] },
    { id: 'db', name: 'Database Systems', chapters: ['SQL Basics', 'Joins', 'Normalization', 'Transactions', 'Indexing'] },
    { id: 'os', name: 'Operating Systems', chapters: ['Processes', 'Threads', 'Memory', 'File Systems', 'Scheduling'] }
  ];

  const handleGenerate = () => {
    if (!selectedSubject || !selectedChapter) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setFlashcardsGenerated(true);
    }, 2500);
  };

  const flashcards = [
    {
      question: "What is a Binary Tree?",
      answer: "A hierarchical data structure where each node has at most two children, referred to as left child and right child. The topmost node is called the root.",
      difficulty: "Easy",
      category: "Data Structures"
    },
    {
      question: "Explain Inorder Traversal",
      answer: "A tree traversal method that visits nodes in Left-Root-Right order. For Binary Search Trees, inorder traversal gives nodes in sorted order.",
      difficulty: "Medium",
      category: "Algorithms"
    },
    {
      question: "What is the time complexity of searching in a balanced Binary Tree?",
      answer: "O(log n) for balanced binary trees because the height of the tree is logarithmic. However, in worst case (skewed tree), it can degrade to O(n).",
      difficulty: "Medium",
      category: "Time Complexity"
    },
    {
      question: "What is a Complete Binary Tree?",
      answer: "A binary tree in which all levels are completely filled except possibly the last level, which is filled from left to right.",
      difficulty: "Easy",
      category: "Data Structures"
    },
    {
      question: "List real-world applications of Binary Trees",
      answer: "1) File system organization 2) Database indexing (B-trees) 3) Expression parsing (syntax trees) 4) Huffman coding for compression 5) Decision trees in ML",
      difficulty: "Hard",
      category: "Applications"
    }
  ];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleMastered = () => {
    const newMastered = new Set(masteredCards);
    if (newMastered.has(currentCard)) {
      newMastered.delete(currentCard);
    } else {
      newMastered.add(currentCard);
    }
    setMasteredCards(newMastered);
  };

  const currentSubject = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-orange-100 via-red-50 to-orange-50 rounded-2xl border border-orange-200 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-orange-200/50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-orange-900" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-orange-900">Flashcard Creator</h2>
              <p className="text-sm text-orange-700">AI-powered spaced repetition learning</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-orange-200/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-orange-900" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel */}
          <div className="w-1/2 border-r border-orange-200 p-6 overflow-y-auto">
            <h3 className="text-orange-900 font-bold mb-4">Select Topic</h3>
            
            {/* Subject Selection */}
            <div className="mb-6">
              <label className="text-orange-900 text-sm mb-2 block font-semibold">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedChapter('');
                }}
                className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl text-orange-900 focus:outline-none focus:border-orange-400"
              >
                <option value="">Choose a subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>

            {/* Chapter Selection */}
            {currentSubject && (
              <div className="mb-6">
                <label className="text-orange-900 text-sm mb-2 block font-semibold">Chapter/Topic</label>
                <div className="grid grid-cols-2 gap-2">
                  {currentSubject.chapters.map((chapter, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedChapter(chapter)}
                      className={`p-3 rounded-xl transition-all text-sm ${
                        selectedChapter === chapter
                          ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white'
                          : 'bg-white text-orange-700 hover:bg-orange-100 border border-orange-200'
                      }`}
                    >
                      {chapter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="space-y-4">
              <div>
                <label className="text-orange-900 text-sm mb-2 block font-semibold">Number of Cards</label>
                <select className="w-full px-4 py-2 bg-white border border-orange-200 rounded-xl text-orange-900 focus:outline-none focus:border-orange-400">
                  <option value="10">10 cards</option>
                  <option value="20">20 cards</option>
                  <option value="30">30 cards</option>
                  <option value="50">50 cards</option>
                </select>
              </div>

              <div>
                <label className="text-orange-900 text-sm mb-2 block font-semibold">Card Type</label>
                <select className="w-full px-4 py-2 bg-white border border-orange-200 rounded-xl text-orange-900 focus:outline-none focus:border-orange-400">
                  <option value="qna">Question & Answer</option>
                  <option value="term">Term & Definition</option>
                  <option value="concept">Concept Explanation</option>
                  <option value="fill">Fill in the Blanks</option>
                </select>
              </div>

              {/* AI Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-900 text-sm">Smart Hints</span>
                  </div>
                  <label className="relative inline-block w-10 h-5">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-orange-200 peer-checked:bg-orange-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-orange-900 text-sm">Track Progress</span>
                  </div>
                  <label className="relative inline-block w-10 h-5">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-orange-200 peer-checked:bg-orange-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !selectedSubject || !selectedChapter}
              className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Flashcards...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Flashcards
                </>
              )}
            </button>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 p-6 overflow-y-auto bg-white/50 flex flex-col">
            {!flashcardsGenerated ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Zap className="w-20 h-20 text-orange-400 mb-4" />
                <h3 className="text-xl text-orange-900 font-bold mb-2">Your Flashcards Will Appear Here</h3>
                <p className="text-orange-700 text-sm">Select a subject and chapter to create flashcards</p>
              </div>
            ) : (
              <>
                {/* Stats Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-900">{flashcards.length}</p>
                      <p className="text-xs text-orange-700">Total Cards</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{masteredCards.size}</p>
                      <p className="text-xs text-orange-700">Mastered</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{flashcards.length - masteredCards.size}</p>
                      <p className="text-xs text-orange-700">Learning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-orange-900" />
                    </button>
                    <button className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-orange-900" />
                    </button>
                  </div>
                </div>

                {/* Flashcard Display */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-full max-w-md">
                    {/* Card Counter */}
                    <div className="text-center mb-4">
                      <span className="text-orange-700 text-sm">
                        Card {currentCard + 1} of {flashcards.length}
                      </span>
                    </div>

                    {/* Card */}
                    <motion.div
                      key={currentCard}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="relative h-80 cursor-pointer mb-6"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 border-orange-300"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)'
                        }}
                      >
                        <Sparkles className="w-12 h-12 text-white/50 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">
                          {flashcards[currentCard].question}
                        </h3>
                        <p className="text-white/80 text-sm">Click to reveal answer</p>
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            flashcards[currentCard].difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                            flashcards[currentCard].difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {flashcards[currentCard].difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Back */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 border-blue-300"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <CheckCircle className="w-12 h-12 text-white/50 mb-4" />
                        <p className="text-white leading-relaxed">
                          {flashcards[currentCard].answer}
                        </p>
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white">
                            {flashcards[currentCard].category}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={handlePrevious}
                        className="p-3 bg-white hover:bg-orange-100 rounded-xl transition-colors border border-orange-200"
                      >
                        <ChevronLeft className="w-6 h-6 text-orange-900" />
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleMastered}
                          className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                            masteredCards.has(currentCard)
                              ? 'bg-green-500 text-white'
                              : 'bg-white hover:bg-orange-100 text-orange-900 border border-orange-200'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${masteredCards.has(currentCard) ? 'fill-white' : ''}`} />
                          {masteredCards.has(currentCard) ? 'Mastered' : 'Mark as Mastered'}
                        </button>
                      </div>

                      <button
                        onClick={handleNext}
                        className="p-3 bg-white hover:bg-orange-100 rounded-xl transition-colors border border-orange-200"
                      >
                        <ChevronRight className="w-6 h-6 text-orange-900" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-orange-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                        style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
