import { useState } from 'react';
import { motion } from 'motion/react';
import {
  X, Target, Sparkles, CheckCircle, XCircle, Clock,
  TrendingUp, Play, RotateCcw, Download, Brain, ArrowLeft
} from 'lucide-react';

export function QuizGeneratorModal({ onClose }: { onClose: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
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
      setQuizGenerated(true);
    }, 2500);
  };

  const questions = [
    {
      question: "What is the time complexity of searching in a balanced Binary Search Tree?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1,
      explanation: "In a balanced BST, the height is log n, so search operations take O(log n) time."
    },
    {
      question: "Which traversal gives nodes of a BST in sorted order?",
      options: ["Preorder", "Inorder", "Postorder", "Level Order"],
      correct: 1,
      explanation: "Inorder traversal (Left-Root-Right) naturally gives BST nodes in ascending sorted order."
    },
    {
      question: "What is a Complete Binary Tree?",
      options: [
        "All nodes have exactly 2 children",
        "All levels filled except last, filled left to right",
        "All leaves at same level",
        "No node has children"
      ],
      correct: 1,
      explanation: "A complete binary tree has all levels completely filled except possibly the last, which is filled from left to right."
    },
    {
      question: "Which data structure is best for implementing a priority queue?",
      options: ["Array", "Linked List", "Heap", "Stack"],
      correct: 2,
      explanation: "Heaps are ideal for priority queues as they support O(log n) insertion and O(1) access to the highest priority element."
    },
    {
      question: "What is the maximum number of nodes in a binary tree of height h?",
      options: ["2^h", "2^h - 1", "2^(h+1) - 1", "2^(h-1)"],
      correct: 2,
      explanation: "A perfect binary tree of height h has 2^(h+1) - 1 nodes total."
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct++;
    });
    return correct;
  };

  const currentSubject = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-100 via-teal-50 to-green-50 rounded-2xl border border-green-200 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-green-200/50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-green-900" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-900">Quiz Generator</h2>
              <p className="text-sm text-green-700">AI-powered adaptive testing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-200/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-green-900" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Setup */}
          {!quizStarted && (
            <div className="w-1/2 border-r border-green-200 p-6 overflow-y-auto">
              <h3 className="text-green-900 font-bold mb-4">Quiz Configuration</h3>
              
              {/* Subject Selection */}
              <div className="mb-6">
                <label className="text-green-900 text-sm mb-2 block font-semibold">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedChapter('');
                  }}
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-green-900 focus:outline-none focus:border-green-400"
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
                  <label className="text-green-900 text-sm mb-2 block font-semibold">Chapter/Topic</label>
                  <div className="grid grid-cols-2 gap-2">
                    {currentSubject.chapters.map((chapter, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedChapter(chapter)}
                        className={`p-3 rounded-xl transition-all text-sm ${
                          selectedChapter === chapter
                            ? 'bg-gradient-to-br from-green-400 to-teal-400 text-white'
                            : 'bg-white text-green-700 hover:bg-green-100 border border-green-200'
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
                  <label className="text-green-900 text-sm mb-2 block font-semibold">Number of Questions</label>
                  <select className="w-full px-4 py-2 bg-white border border-green-200 rounded-xl text-green-900 focus:outline-none focus:border-green-400">
                    <option value="5">5 questions</option>
                    <option value="10">10 questions</option>
                    <option value="15">15 questions</option>
                    <option value="20">20 questions</option>
                  </select>
                </div>

                <div>
                  <label className="text-green-900 text-sm mb-2 block font-semibold">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Easy', 'Medium', 'Hard'].map((level) => (
                      <button
                        key={level}
                        className="py-2 px-4 rounded-lg bg-white text-green-700 hover:bg-green-100 transition-all border border-green-200"
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-green-900 text-sm mb-2 block font-semibold">Time Limit</label>
                  <select className="w-full px-4 py-2 bg-white border border-green-200 rounded-xl text-green-900 focus:outline-none focus:border-green-400">
                    <option value="no">No Time Limit</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                </div>

                {/* AI Features */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-green-500" />
                      <span className="text-green-900 text-sm">Adaptive Difficulty</span>
                    </div>
                    <label className="relative inline-block w-10 h-5">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-full h-full bg-green-200 peer-checked:bg-green-500 rounded-full transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-green-900 text-sm">Instant Feedback</span>
                    </div>
                    <label className="relative inline-block w-10 h-5">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-full h-full bg-green-200 peer-checked:bg-green-500 rounded-full transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-green-900 text-sm">Performance Analytics</span>
                    </div>
                    <label className="relative inline-block w-10 h-5">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-full h-full bg-green-200 peer-checked:bg-green-500 rounded-full transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>
                </div>
              </div>

              {!quizGenerated ? (
                <button
                  onClick={handleGenerate}
                  disabled={generating || !selectedSubject || !selectedChapter}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Quiz
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setQuizStarted(true)}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Quiz
                </button>
              )}
            </div>
          )}

          {/* Right Panel - Quiz/Results */}
          <div className={`${quizStarted ? 'w-full' : 'w-1/2'} p-6 overflow-y-auto bg-white/50`}>
            {!quizGenerated ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Target className="w-20 h-20 text-green-400 mb-4" />
                <h3 className="text-xl text-green-900 font-bold mb-2">Your Quiz Will Appear Here</h3>
                <p className="text-green-700 text-sm">Select subject and chapter to generate your personalized quiz</p>
              </div>
            ) : !quizStarted ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-xl text-green-900 font-bold mb-2">Quiz Ready!</h3>
                <p className="text-green-700 text-sm mb-6">5 questions generated based on your selection</p>
                <div className="bg-white rounded-xl p-6 border border-green-200 w-full max-w-md">
                  <h4 className="text-green-900 font-bold mb-4">Quiz Preview</h4>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">Questions:</span>
                      <span className="text-green-900 font-semibold">5</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">Type:</span>
                      <span className="text-green-900 font-semibold">Multiple Choice</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">Difficulty:</span>
                      <span className="text-yellow-600 font-semibold">Medium</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">Time Limit:</span>
                      <span className="text-green-900 font-semibold">15 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : showResults ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{calculateScore()}/{questions.length}</p>
                      <p className="text-white text-sm">Score</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Quiz Complete!</h3>
                  <p className="text-green-700">
                    You scored {Math.round((calculateScore() / questions.length) * 100)}%
                  </p>
                </div>

                {/* Answer Review */}
                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const isCorrect = selectedAnswers[idx] === q.correct;
                    return (
                      <div key={idx} className="bg-white rounded-xl p-5 border border-green-200">
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-green-900 font-semibold mb-2">{q.question}</p>
                            <p className="text-sm text-green-700 mb-2">
                              Your answer: <span className={isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {q.options[selectedAnswers[idx]]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-700 mb-2">
                                Correct answer: <span className="text-green-600 font-semibold">{q.options[q.correct]}</span>
                              </p>
                            )}
                            <p className="text-sm text-green-800 bg-blue-50 p-3 rounded-lg border border-blue-200">
                              💡 {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Retake Quiz
                  </button>
                  <button className="flex-1 py-3 bg-white hover:bg-green-100 text-green-900 rounded-xl flex items-center justify-center gap-2 border border-green-200">
                    <Download className="w-5 h-5" />
                    Download Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">{currentQuestion + 1}</span>
                    </div>
                    <div>
                      <p className="text-green-900 font-semibold">Question {currentQuestion + 1} of {questions.length}</p>
                      <p className="text-xs text-green-700">Multiple Choice</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">12:34</span>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-xl text-green-900 font-semibold leading-relaxed">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        selectedAnswers[currentQuestion] === idx
                          ? 'bg-gradient-to-r from-green-400 to-teal-400 border-green-300 text-white'
                          : 'bg-white border-green-200 text-green-800 hover:bg-green-50 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          selectedAnswers[currentQuestion] === idx
                            ? 'border-white bg-white/20'
                            : 'border-green-400'
                        }`}>
                          <span className={`font-bold ${selectedAnswers[currentQuestion] === idx ? 'text-white' : 'text-green-700'}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 bg-white hover:bg-green-100 text-green-900 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-green-200"
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentQuestion ? 'bg-green-500 w-6' :
                          selectedAnswers[idx] !== undefined ? 'bg-green-400' :
                          'bg-green-200'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestion] === undefined}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
