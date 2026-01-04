import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, X, Lightbulb, Image, Hash, DollarSign, Users, TrendingUp,
  Calendar, Target, Award, Brain, Palette, Copy, Download, RefreshCw,
  CheckCircle, AlertTriangle, Star, MessageSquare, BarChart3, Zap,
  UserPlus, Activity, Clock, Edit2, Send, ThumbsUp, ThumbsDown, Wand2,
  PieChart, TrendingDown, Gift, Shield, Eye, FileText, Settings, Check
} from 'lucide-react';

interface AIClubSupportProps {
  onClose: () => void;
  clubName: string;
  clubDomain: 'tech' | 'cultural' | 'social' | 'sports';
}

export function AIClubSupport({ onClose, clubName, clubDomain }: AIClubSupportProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(1);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState<number | null>(null);

  // All data states
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [generatedPoster, setGeneratedPoster] = useState<any>(null);
  const [generatedCaptions, setGeneratedCaptions] = useState<any[]>([]);
  const [budgetOptimization, setBudgetOptimization] = useState<any>(null);
  const [speakerSuggestions, setSpeakerSuggestions] = useState<any[]>([]);
  const [collaborationSuggestions, setCollaborationSuggestions] = useState<any[]>([]);
  const [eventPrediction, setEventPrediction] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [memberMatches, setMemberMatches] = useState<any[]>([]);
  const [postEventInsights, setPostEventInsights] = useState<any>(null);

  // Event Idea Generator
  const generateEventIdeas = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const ideas = [
        {
          id: 1,
          title: clubDomain === 'tech' ? 'AI/ML Workshop Series' : clubDomain === 'cultural' ? 'Cultural Fusion Night' : clubDomain === 'sports' ? 'Inter-College Tournament' : 'Community Impact Day',
          objective: clubDomain === 'tech' ? 'Introduce students to practical AI applications' : 'Celebrate diverse cultures through art and music',
          format: clubDomain === 'tech' ? 'Workshop' : clubDomain === 'cultural' ? 'Performance' : 'Competition',
          difficulty: 'Medium',
          participationPotential: 'High',
          budget: clubDomain === 'tech' ? '₹45,000' : '₹35,000',
          duration: '2 days',
          expectedAttendees: clubDomain === 'tech' ? 150 : 200,
          flags: ['High participation potential', 'Low budget, high impact'],
          whyThisWorks: 'Based on past event success (similar workshop had 87% attendance) and current student interest trends',
          suggestedDate: 'Feb 15-16, 2025',
          avoidClashes: 'No exam overlap detected'
        },
        {
          id: 2,
          title: clubDomain === 'tech' ? 'Hackathon Sprint' : clubDomain === 'cultural' ? 'Open Mic Poetry' : clubDomain === 'sports' ? 'Fitness Challenge' : 'Social Awareness Campaign',
          objective: clubDomain === 'tech' ? 'Build innovative solutions in 24 hours' : 'Platform for creative expression',
          format: clubDomain === 'tech' ? 'Hackathon' : clubDomain === 'cultural' ? 'Open Stage' : 'Challenge',
          difficulty: 'High',
          participationPotential: 'Medium',
          budget: clubDomain === 'tech' ? '₹60,000' : '₹20,000',
          duration: clubDomain === 'tech' ? '24 hours' : '4 hours',
          expectedAttendees: clubDomain === 'tech' ? 80 : 120,
          flags: ['Requires industry mentors', 'High engagement'],
          whyThisWorks: 'Aligns with academic curriculum and student skill development goals',
          suggestedDate: 'Mar 8-9, 2025',
          avoidClashes: 'Scheduled after mid-semester exams'
        },
        {
          id: 3,
          title: clubDomain === 'tech' ? 'Tech Talk Series' : clubDomain === 'cultural' ? 'Art Exhibition' : clubDomain === 'sports' ? 'Yoga & Wellness Week' : 'Blood Donation Drive',
          objective: clubDomain === 'tech' ? 'Industry insights from experts' : 'Showcase student artwork',
          format: 'Talk/Exhibition',
          difficulty: 'Low',
          participationPotential: 'High',
          budget: clubDomain === 'tech' ? '₹30,000' : '₹15,000',
          duration: '3 hours',
          expectedAttendees: 180,
          flags: ['Easy to organize', 'Low cost, high value'],
          whyThisWorks: 'Perfect timing during academic break, minimal resource requirements',
          suggestedDate: 'Feb 22, 2025',
          avoidClashes: 'No conflicts detected'
        }
      ];
      setGeneratedIdeas(ideas);
      setIsGenerating(false);
    }, 2000);
  };

  // Poster Generator
  const generatePoster = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const poster = {
        eventTitle: `${clubName} Event`,
        layouts: [
          { id: 1, name: 'Modern Minimal', preview: 'Clean typography with geometric shapes' },
          { id: 2, name: 'Bold & Vibrant', preview: 'High-contrast colors with dynamic elements' },
          { id: 3, name: 'Gradient Flow', preview: 'Smooth gradients with flowing design' }
        ],
        colorPalettes: [
          { name: 'Club Brand', colors: ['#00D4FF', '#0099CC', '#0066FF', '#FFFFFF'] },
          { name: 'Energetic', colors: ['#FF6B6B', '#FFA500', '#FFD700', '#FFFFFF'] },
          { name: 'Professional', colors: ['#2C3E50', '#3498DB', '#ECF0F1', '#FFFFFF'] }
        ],
        fonts: [
          { name: 'Montserrat Bold', usage: 'Headlines' },
          { name: 'Roboto', usage: 'Body text' },
          { name: 'Poppins', usage: 'Accents' }
        ],
        adaptiveFormats: [
          { platform: 'Instagram Post', size: '1080x1080', generated: true },
          { platform: 'Instagram Story', size: '1080x1920', generated: true },
          { platform: 'WhatsApp Status', size: '1080x1920', generated: true },
          { platform: 'Website Banner', size: '1920x600', generated: true }
        ]
      };
      setGeneratedPoster(poster);
      setIsGenerating(false);
    }, 2000);
  };

  // Caption Generator
  const generateCaptions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const captions = [
        {
          id: 1,
          tone: 'Professional',
          short: `Join us for the upcoming ${clubName} event! 150+ students expected. Register now! 🚀`,
          long: `We're excited to announce our next big event by ${clubName}! This will bring together students from across campus for an incredible experience. With 150+ expected participants, this is going to be amazing. Mark your calendars!`,
          hashtags: ['#' + clubName.replace(/\s/g, ''), '#CampusLife', '#StudentEvents', '#Innovation2025', '#JoinUs'],
          cta: 'Register at the link in bio! Limited seats available.',
          performance: 'Best performing caption',
          engagement: '94% predicted engagement'
        },
        {
          id: 2,
          tone: 'Fun',
          short: `🎉 ${clubName} event is here! Get ready for an amazing time! Who's in? 🙋‍♂️`,
          long: `Guess what's coming? Our next ${clubName} event! 🎊 We're bringing you an unforgettable experience that will blow your mind. 150+ students are already excited. Are you joining the fun?`,
          hashtags: ['#' + clubName.replace(/\s/g, ''), '#CollegeVibes', '#EventTime', '#FunTimes', '#LetsDoThis'],
          cta: 'Swipe up to register! First 50 get exclusive merch! 🎁',
          performance: 'High social shares',
          engagement: '87% predicted engagement'
        },
        {
          id: 3,
          tone: 'Energetic',
          short: `⚡ ${clubName} Event ⚡ 150+ students. ONE event. Infinite possibilities! 🔥`,
          long: `BREAKING: ${clubName} event is happening and it's MASSIVE! 💥 An incredible experience awaits. 150+ students joining. This will change the game. Don't miss out!`,
          hashtags: ['#' + clubName.replace(/\s/g, ''), '#GameChanger', '#Event2025', '#CampusRocks', '#BePartOfIt'],
          cta: 'Link in bio - Register before seats run out! ⏰',
          performance: 'High click-through rate',
          engagement: '91% predicted engagement'
        }
      ];
      setGeneratedCaptions(captions);
      setIsGenerating(false);
    }, 2000);
  };

  // Budget Optimizer
  const optimizeBudget = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const baseBudget = 40000;
      const optimization = {
        originalBudget: '₹40,000',
        optimizedBudget: 34000,
        savings: '15%',
        riskLevel: 'Low',
        breakdown: [
          { category: 'Venue', original: 14000, optimized: 11000, savings: 3000, note: 'Use campus auditorium instead of external venue' },
          { category: 'Equipment', original: 10000, optimized: 8000, savings: 2000, note: 'Borrow from existing club inventory' },
          { category: 'Marketing', original: 8000, optimized: 5000, savings: 3000, note: 'Focus on social media instead of print materials' },
          { category: 'Refreshments', original: 6000, optimized: 5000, savings: 1000, note: 'Bulk ordering from campus cafeteria' },
          { category: 'Prizes/Misc', original: 2000, optimized: 5000, savings: -3000, note: 'Increased for better participant experience' }
        ],
        costSavingSuggestions: [
          '💡 Partner with local businesses for sponsorships (potential ₹10,000)',
          '💡 Use student volunteers instead of paid staff (save ₹5,000)',
          '💡 Digital certificates instead of printed (save ₹2,000)',
          '💡 Reuse decorations from previous events (save ₹3,000)'
        ],
        sponsorshipNeeds: 'Recommended',
        totalSavings: 6000
      };
      setBudgetOptimization(optimization);
      setIsGenerating(false);
    }, 2000);
  };

  // Speaker Suggestions
  const suggestSpeakers = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const speakers = [
        {
          id: 1,
          name: 'Dr. Amit Patel',
          type: 'Alumni',
          expertise: clubDomain === 'tech' ? 'AI/ML Engineer at Google' : clubDomain === 'cultural' ? 'Cultural Ambassador' : clubDomain === 'sports' ? 'Olympic Trainer' : 'Social Entrepreneur',
          relevance: 95,
          availability: 'High',
          expectedImpact: 'Very High',
          pastRating: 4.8,
          profile: 'Class of 2018, Published researcher, 5+ talks delivered',
          suggestedFormat: 'Keynote + Q&A',
          contactInfo: 'Available through Alumni Network',
          estimatedFee: 'Pro-bono (Alumni)'
        },
        {
          id: 2,
          name: 'Prof. Sarah Johnson',
          type: 'Faculty',
          expertise: clubDomain === 'tech' ? 'Computer Science Dept' : clubDomain === 'cultural' ? 'Arts & Culture' : clubDomain === 'sports' ? 'Sports Science' : 'Social Sciences',
          relevance: 88,
          availability: 'Medium',
          expectedImpact: 'High',
          pastRating: 4.6,
          profile: '15 years teaching experience, Published author',
          suggestedFormat: 'Workshop facilitation',
          contactInfo: 'Internal - Department',
          estimatedFee: 'Free (Faculty)'
        },
        {
          id: 3,
          name: 'Ravi Kumar',
          type: 'Industry Expert',
          expertise: clubDomain === 'tech' ? 'Startup Founder - TechVentures' : clubDomain === 'cultural' ? 'Event Management Pro' : clubDomain === 'sports' ? 'Professional Athlete' : 'NGO Director',
          relevance: 82,
          availability: 'Low',
          expectedImpact: 'Very High',
          pastRating: 4.7,
          profile: '10+ years industry experience, TED speaker',
          suggestedFormat: 'Panel discussion',
          contactInfo: 'Contact via LinkedIn',
          estimatedFee: '₹15,000'
        }
      ];
      setSpeakerSuggestions(speakers);
      setIsGenerating(false);
    }, 2000);
  };

  // Collaboration Recommender
  const suggestCollaborations = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const collaborations = [
        {
          id: 1,
          club: clubDomain === 'tech' ? 'Innovation Lab' : clubDomain === 'cultural' ? 'Photography Club' : clubDomain === 'sports' ? 'Wellness Club' : 'Environment Club',
          skillOverlap: 75,
          successScore: 88,
          pastCollaborations: 2,
          audienceSimilarity: 'High',
          suggestedEvent: clubDomain === 'tech' ? 'Tech & Design Meetup' : clubDomain === 'cultural' ? 'Art & Photography Exhibition' : clubDomain === 'sports' ? 'Health & Fitness Fair' : 'Community Service Drive',
          benefits: [
            'Shared audience reach (+200 students)',
            'Cost splitting (save 30%)',
            'Combined expertise = better quality',
            'Cross-promotion opportunities'
          ],
          timeline: 'Can start planning in 2 weeks',
          recommendation: 'Highly Recommended'
        },
        {
          id: 2,
          club: clubDomain === 'tech' ? 'Robotics Club' : clubDomain === 'cultural' ? 'Dance Society' : clubDomain === 'sports' ? 'Adventure Club' : 'Literary Society',
          skillOverlap: 60,
          successScore: 72,
          pastCollaborations: 1,
          audienceSimilarity: 'Medium',
          suggestedEvent: clubDomain === 'tech' ? 'IoT Workshop' : clubDomain === 'cultural' ? 'Cultural Fest Collaboration' : clubDomain === 'sports' ? 'Adventure Sports Challenge' : 'Social Awareness Campaign',
          benefits: [
            'Diverse skill sets',
            'Expanded network',
            'Resource sharing',
            'New audience segments'
          ],
          timeline: 'Can start planning in 1 month',
          recommendation: 'Recommended'
        }
      ];
      setCollaborationSuggestions(collaborations);
      setIsGenerating(false);
    }, 2000);
  };

  // Event Success Prediction
  const predictEventSuccess = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const prediction = {
        expectedTurnout: 150,
        confidenceLevel: 85,
        engagementLevel: 'High',
        resourceSufficiency: 'Adequate',
        flags: [
          { type: 'success', message: 'No timing conflicts detected with major exams' },
          { type: 'warning', message: 'Exam period starts 2 weeks after event - good timing' },
          { type: 'success', message: 'Budget is realistic and achievable' },
          { type: 'success', message: 'Venue availability confirmed' }
        ],
        suggestions: [
          '✅ Current timeline is optimal - good attendance expected',
          '⚠️ Consider adding backup venue option for weather concerns',
          '✅ Marketing timeline is sufficient (3 weeks before event)',
          '✅ Budget allocation is balanced across categories'
        ],
        similarPastEvents: [
          { name: clubDomain === 'tech' ? 'Tech Workshop 2024' : 'Annual Club Event 2024', attendance: 142, rating: 4.5, outcome: 'Successful' },
          { name: clubDomain === 'tech' ? 'Innovation Day 2024' : 'Mega Fest 2024', attendance: 168, rating: 4.7, outcome: 'Very Successful' }
        ],
        overallScore: 87,
        verdict: 'Excellent chance of success! Event is well-planned with strong fundamentals.'
      };
      setEventPrediction(prediction);
      setIsGenerating(false);
    }, 2000);
  };

  // Timeline Generator
  const generateTimeline = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const timelines = [
        {
          id: 1,
          phase: 'Planning Phase',
          weeks: '8-6 weeks before',
          tasks: [
            { task: 'Form organizing committee & assign roles', status: 'completed', date: '2 weeks ago' },
            { task: 'Define event objectives & target outcomes', status: 'completed', date: '10 days ago' },
            { task: 'Create detailed budget breakdown', status: 'completed', date: '8 days ago' },
            { task: 'Get initial approval from coordinator', status: 'pending', date: 'Today' }
          ],
          color: 'from-green-400 to-emerald-500'
        },
        {
          id: 2,
          phase: 'Promotion Phase',
          weeks: '5-3 weeks before',
          tasks: [
            { task: 'Design event posters & social media graphics', status: 'upcoming', date: 'In 3 days' },
            { task: 'Launch comprehensive social media campaign', status: 'upcoming', date: 'In 5 days' },
            { task: 'Send email announcements to all students', status: 'upcoming', date: 'In 7 days' },
            { task: 'Put up physical posters across campus', status: 'upcoming', date: 'In 10 days' },
            { task: 'Partner outreach for collaborations', status: 'upcoming', date: 'In 12 days' }
          ],
          color: 'from-cyan-400 to-blue-500'
        },
        {
          id: 3,
          phase: 'Execution Phase',
          weeks: '2 weeks before - Event Day',
          tasks: [
            { task: 'Confirm speaker/guest availability', status: 'upcoming', date: 'In 14 days' },
            { task: 'Finalize venue arrangements & permits', status: 'upcoming', date: 'In 16 days' },
            { task: 'Conduct volunteer training session', status: 'upcoming', date: 'In 18 days' },
            { task: 'Final equipment & tech check', status: 'upcoming', date: 'In 20 days' },
            { task: 'Rehearsal & dry run', status: 'upcoming', date: 'In 22 days' },
            { task: '🎉 Event Day Execution! 🎉', status: 'upcoming', date: 'In 24 days' }
          ],
          color: 'from-purple-400 to-pink-500'
        },
        {
          id: 4,
          phase: 'Post-Event Phase',
          weeks: '1-2 weeks after',
          tasks: [
            { task: 'Collect participant feedback via survey', status: 'upcoming', date: '1 day after' },
            { task: 'Generate comprehensive event report', status: 'upcoming', date: '3 days after' },
            { task: 'Share event photos & highlights on social media', status: 'upcoming', date: '5 days after' },
            { task: 'Submit final budget & expense report', status: 'upcoming', date: '1 week after' },
            { task: 'Team debrief & lessons learned session', status: 'upcoming', date: '2 weeks after' }
          ],
          color: 'from-amber-400 to-orange-500'
        }
      ];
      setTimeline(timelines);
      setIsGenerating(false);
    }, 2000);
  };

  // Member Match System
  const generateMemberMatches = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const matches = [
        {
          id: 1,
          name: 'Rahul Verma',
          year: '3rd Year',
          skills: clubDomain === 'tech' ? ['Python', 'Machine Learning', 'Web Development'] : clubDomain === 'cultural' ? ['Guitar', 'Vocals', 'Event Planning'] : clubDomain === 'sports' ? ['Athletics', 'Team Captain', 'Coaching'] : ['Leadership', 'Communication', 'Project Management'],
          matchScore: 92,
          fit: 'Ideal for core team',
          pastActivities: ['Workshop participant', 'Volunteer x2', 'Event organizer'],
          recommendation: 'Highly Recommended',
          dropoutRisk: 'Low',
          strengths: ['Consistent participation', 'Leadership potential', 'Technical skills']
        },
        {
          id: 2,
          name: 'Priya Sharma',
          year: '2nd Year',
          skills: clubDomain === 'tech' ? ['UI/UX Design', 'Frontend Dev', 'Graphics'] : clubDomain === 'cultural' ? ['Dance', 'Choreography', 'Social Media'] : clubDomain === 'sports' ? ['Fitness Training', 'Nutrition', 'Yoga'] : ['Content Creation', 'Marketing', 'Design'],
          matchScore: 85,
          fit: 'Good for volunteering',
          pastActivities: ['Event attendee x3', 'Active on social media', 'Creative contributor'],
          recommendation: 'Recommended',
          dropoutRisk: 'Low',
          strengths: ['Creative skills', 'Social media savvy', 'Reliable']
        },
        {
          id: 3,
          name: 'Amit Kumar',
          year: '1st Year',
          skills: clubDomain === 'tech' ? ['C++', 'Problem Solving', 'Quick Learner'] : clubDomain === 'cultural' ? ['Photography', 'Video Editing', 'Creative'] : clubDomain === 'sports' ? ['Running', 'Team Spirit', 'Motivated'] : ['Research', 'Analysis', 'Enthusiasm'],
          matchScore: 78,
          fit: 'Potential member',
          pastActivities: ['Interested in joining', 'Attended info session', 'Eager learner'],
          recommendation: 'Worth considering',
          dropoutRisk: 'Medium',
          strengths: ['High motivation', 'Learning mindset', 'Fresh perspective']
        }
      ];
      setMemberMatches(matches);
      setIsGenerating(false);
    }, 2000);
  };

  // Post Event Insights
  const generatePostEventInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const insights = {
        eventName: 'Last Major Club Event',
        attendance: { predicted: 150, actual: 168, difference: '+18 (12%)' },
        engagement: { rating: 4.7, feedback: 'Very Positive', participation: '94%' },
        budget: { allocated: '₹45,000', spent: '₹41,500', saved: '₹3,500', efficiency: '92%' },
        whatWorked: [
          '✅ Social media campaign reached 2000+ students - exceeded expectations',
          '✅ Speaker was highly engaging and knowledgeable - 4.9/5 rating',
          '✅ Venue was perfect - excellent acoustics and comfortable seating',
          '✅ Refreshments were well-received - no complaints',
          '✅ Volunteer team was well-coordinated and professional'
        ],
        whatToImprove: [
          '⚠️ Registration process was slightly slow - implement QR code system',
          '⚠️ Mic had technical issues in first 10 minutes - need backup equipment',
          '⚠️ More volunteers needed for crowd management at entry',
          '⚠️ Post-event survey response rate was low (45%) - incentivize participation',
          '⚠️ Parking was insufficient - coordinate with admin earlier'
        ],
        keyLearnings: [
          '📚 Start promotion 4 weeks before, not 3 weeks for better reach',
          '📚 Always have backup equipment for all tech components',
          '📚 Incentivize survey completion with small rewards/certificates',
          '📚 Partner with 2-3 clubs for better reach and resource sharing',
          '📚 Create detailed volunteer briefing document'
        ],
        aiRecommendations: [
          '🤖 Next event: Increase budget by 10% for better equipment redundancy',
          '🤖 Target 200+ attendees based on growing interest and improved reach',
          '🤖 Consider hybrid format for wider reach (in-person + online)',
          '🤖 Start planning 8 weeks in advance for complex events',
          '🤖 Implement automated registration system for faster check-in'
        ],
        metrics: {
          attendanceRate: '112%',
          satisfactionScore: '4.7/5',
          budgetEfficiency: '92%',
          socialReach: '2000+',
          repeatAttendeeIntent: '87%'
        }
      };
      setPostEventInsights(insights);
      setIsGenerating(false);
    }, 2000);
  };

  // Auto-trigger generation when feature is selected
  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
    
    switch(featureId) {
      case 'ideas':
        if (generatedIdeas.length === 0) generateEventIdeas();
        break;
      case 'poster':
        if (!generatedPoster) generatePoster();
        break;
      case 'captions':
        if (generatedCaptions.length === 0) generateCaptions();
        break;
      case 'budget':
        if (!budgetOptimization) optimizeBudget();
        break;
      case 'speakers':
        if (speakerSuggestions.length === 0) suggestSpeakers();
        break;
      case 'collaboration':
        if (collaborationSuggestions.length === 0) suggestCollaborations();
        break;
      case 'prediction':
        if (!eventPrediction) predictEventSuccess();
        break;
      case 'timeline':
        if (timeline.length === 0) generateTimeline();
        break;
      case 'members':
        if (memberMatches.length === 0) generateMemberMatches();
        break;
      case 'insights':
        if (!postEventInsights) generatePostEventInsights();
        break;
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(id);
    setTimeout(() => setCopiedCaption(null), 2000);
  };

  const features = [
    { id: 'ideas', title: 'Event Idea Generator', icon: Lightbulb, color: 'from-yellow-400 to-orange-500', description: 'Context-aware event ideas based on domain and past success' },
    { id: 'poster', title: 'AI Poster Generator', icon: Image, color: 'from-pink-400 to-rose-500', description: 'Design-aware poster generation with brand consistency' },
    { id: 'captions', title: 'Captions & Hashtags', icon: Hash, color: 'from-cyan-400 to-blue-500', description: 'Marketing intelligence for social media campaigns' },
    { id: 'budget', title: 'Budget Optimizer', icon: DollarSign, color: 'from-green-400 to-teal-500', description: 'Real planning intelligence with cost-saving suggestions' },
    { id: 'speakers', title: 'Speaker Suggestions', icon: Users, color: 'from-purple-400 to-indigo-500', description: 'Smart recommendations from alumni, faculty & industry' },
    { id: 'collaboration', title: 'Collaboration Finder', icon: TrendingUp, color: 'from-blue-400 to-cyan-500', description: 'Cross-club collaboration opportunities' },
    { id: 'prediction', title: 'Success Prediction', icon: Target, color: 'from-indigo-400 to-purple-500', description: 'Event success prediction with smart recommendations' },
    { id: 'timeline', title: 'Timeline Generator', icon: Calendar, color: 'from-emerald-400 to-green-500', description: 'Smart planning timeline with auto-adjustments' },
    { id: 'members', title: 'Member Matching', icon: UserPlus, color: 'from-violet-400 to-purple-500', description: 'AI-powered student-to-club matching system' },
    { id: 'insights', title: 'Post-Event Insights', icon: BarChart3, color: 'from-orange-400 to-red-500', description: 'Learning from outcomes and improving future events' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-cyan-200"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-100/80 via-blue-100/80 to-purple-100/80 backdrop-blur-xl border-b border-cyan-200 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/30 to-purple-200/30" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Club Support
                </h2>
                <p className="text-slate-600 mt-1">Strategic assistant for {clubName}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/60 hover:bg-white/80 rounded-xl flex items-center justify-center transition-all border border-cyan-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
          {/* Features Grid */}
          {!activeFeature && (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Choose an AI Feature</h3>
                <p className="text-slate-600">Click any feature to get started with AI-powered club management</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleFeatureClick(feature.id)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Feature Content */}
          {activeFeature && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800">
                  {features.find(f => f.id === activeFeature)?.title}
                </h3>
                <button
                  onClick={() => setActiveFeature(null)}
                  className="px-4 py-2 bg-white/70 hover:bg-white/90 rounded-xl border border-cyan-200 text-slate-700 transition-all flex items-center gap-2"
                >
                  ← Back to Features
                </button>
              </div>

              {isGenerating && (
                <div className="bg-white/70 border border-cyan-200 rounded-2xl p-12 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-slate-600">AI is working its magic...</p>
                </div>
              )}

              {/* EVENT IDEAS */}
              {!isGenerating && activeFeature === 'ideas' && generatedIdeas.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {generatedIdeas.map((idea) => (
                    <div key={idea.id} className="bg-white/70 border border-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-bold text-slate-800 text-lg">{idea.title}</h4>
                        <div className="flex gap-1">
                          {idea.flags.map((flag: string, idx: number) => (
                            <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                              {flag.includes('High') ? '🚀' : '💡'}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <p className="flex items-center gap-2"><Target className="w-4 h-4 text-cyan-500" /> {idea.objective}</p>
                        <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> {idea.suggestedDate}</p>
                        <p className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> {idea.expectedAttendees} expected</p>
                        <p className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> {idea.budget}</p>
                        <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> {idea.duration}</p>
                      </div>

                      <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 mb-4">
                        <p className="text-xs font-semibold text-cyan-700 mb-1">Why This Works:</p>
                        <p className="text-xs text-slate-600">{idea.whyThisWorks}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            generatePoster();
                            generateCaptions();
                            optimizeBudget();
                            suggestSpeakers();
                            predictEventSuccess();
                            generateTimeline();
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                        >
                          Full AI Analysis
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* POSTER GENERATOR */}
              {!isGenerating && activeFeature === 'poster' && generatedPoster && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Layouts */}
                    <div className="bg-white/70 border border-cyan-200 rounded-2xl p-6">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-pink-500" />
                        Layout Options
                      </h4>
                      <div className="space-y-3">
                        {generatedPoster.layouts.map((layout: any) => (
                          <div
                            key={layout.id}
                            onClick={() => setSelectedLayout(layout.id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedLayout === layout.id
                                ? 'border-pink-400 bg-pink-50'
                                : 'border-slate-200 bg-slate-50 hover:border-pink-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-slate-800">{layout.name}</h5>
                              {selectedLayout === layout.id && <Check className="w-5 h-5 text-pink-500" />}
                            </div>
                            <p className="text-xs text-slate-600">{layout.preview}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Color Palettes */}
                    <div className="bg-white/70 border border-cyan-200 rounded-2xl p-6">
                      <h4 className="font-bold text-slate-800 mb-4">Color Palettes</h4>
                      <div className="space-y-3">
                        {generatedPoster.colorPalettes.map((palette: any, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedPalette(idx)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedPalette === idx
                                ? 'border-cyan-400 bg-cyan-50'
                                : 'border-slate-200 bg-slate-50 hover:border-cyan-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold text-slate-800">{palette.name}</h5>
                              {selectedPalette === idx && <Check className="w-5 h-5 text-cyan-500" />}
                            </div>
                            <div className="flex gap-2">
                              {palette.colors.map((color: string, colorIdx: number) => (
                                <div
                                  key={colorIdx}
                                  className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fonts & Formats */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/70 border border-cyan-200 rounded-2xl p-6">
                      <h4 className="font-bold text-slate-800 mb-4">Font Recommendations</h4>
                      <div className="space-y-3">
                        {generatedPoster.fonts.map((font: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-800">{font.name}</p>
                                <p className="text-xs text-slate-600">{font.usage}</p>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Recommended</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/70 border border-cyan-200 rounded-2xl p-6">
                      <h4 className="font-bold text-slate-800 mb-4">Adaptive Formats</h4>
                      <div className="space-y-3">
                        {generatedPoster.adaptiveFormats.map((format: any, idx: number) => (
                          <div key={idx} className="p-3 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-800">{format.platform}</p>
                                <p className="text-xs text-slate-600">{format.size}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-700">Generated</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download All Poster Formats
                  </button>
                </div>
              )}

              {/* CAPTIONS & HASHTAGS */}
              {!isGenerating && activeFeature === 'captions' && generatedCaptions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {generatedCaptions.map((caption) => (
                    <div key={caption.id} className="bg-white/70 border border-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-sm font-semibold">
                          {caption.tone}
                        </span>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-bold text-slate-800">{caption.engagement}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2">Short Caption</p>
                          <p className="text-sm text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-200">{caption.short}</p>
                          <button
                            onClick={() => copyToClipboard(caption.short, caption.id * 10 + 1)}
                            className="mt-2 text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                          >
                            {copiedCaption === caption.id * 10 + 1 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedCaption === caption.id * 10 + 1 ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2">Long Caption</p>
                          <p className="text-sm text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-200">{caption.long}</p>
                          <button
                            onClick={() => copyToClipboard(caption.long, caption.id * 10 + 2)}
                            className="mt-2 text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                          >
                            {copiedCaption === caption.id * 10 + 2 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedCaption === caption.id * 10 + 2 ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2">Hashtags</p>
                          <div className="flex flex-wrap gap-2">
                            {caption.hashtags.map((tag: string, idx: number) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200">
                          <p className="text-xs font-semibold text-slate-600 mb-1">Call to Action</p>
                          <p className="text-sm text-slate-700">{caption.cta}</p>
                        </div>

                        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <p className="text-xs font-semibold text-green-700">{caption.performance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BUDGET OPTIMIZER */}
              {!isGenerating && activeFeature === 'budget' && budgetOptimization && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Summary */}
                    <div className="bg-white/70 border border-cyan-200 rounded-2xl p-6">
                      <h4 className="font-semibold text-slate-800 mb-4">Budget Summary</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Original Budget</p>
                          <p className="text-2xl font-bold text-slate-800">{budgetOptimization.originalBudget}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Optimized Budget</p>
                          <p className="text-2xl font-bold text-green-600">₹{budgetOptimization.optimizedBudget.toLocaleString()}</p>
                        </div>
                        <div className="pt-4 border-t border-cyan-200">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-800">Total Savings</p>
                            <p className="text-xl font-bold text-green-600">₹{budgetOptimization.totalSavings.toLocaleString()}</p>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{budgetOptimization.savings} reduction</p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                          <p className="text-sm font-semibold mb-1">Budget Risk Level</p>
                          <p className="text-lg font-bold text-green-700">{budgetOptimization.riskLevel}</p>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="lg:col-span-2 bg-white/70 border border-cyan-200 rounded-2xl p-6">
                      <h4 className="font-semibold text-slate-800 mb-4">Budget Breakdown</h4>
                      <div className="space-y-3">
                        {budgetOptimization.breakdown.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-slate-800">{item.category}</h5>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-600 line-through">₹{item.original.toLocaleString()}</span>
                                <span className="text-lg font-bold text-green-600">₹{item.optimized.toLocaleString()}</span>
                                {item.savings > 0 && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                                    -₹{item.savings.toLocaleString()}
                                  </span>
                                )}
                                {item.savings < 0 && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg">
                                    +₹{Math.abs(item.savings).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-slate-600">{item.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cost Saving Suggestions */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 p-6">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-cyan-500" />
                      Cost-Saving Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {budgetOptimization.costSavingSuggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="mt-1">{suggestion.slice(0, 2)}</span>
                          <span>{suggestion.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* SPEAKER SUGGESTIONS */}
              {!isGenerating && activeFeature === 'speakers' && speakerSuggestions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {speakerSuggestions.map((speaker) => (
                    <div key={speaker.id} className="bg-white/70 border border-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-semibold mb-1">
                            {speaker.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-slate-800">{speaker.pastRating}</span>
                          </div>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-800 text-lg mb-2">{speaker.name}</h4>
                      <p className="text-sm text-slate-600 mb-4">{speaker.expertise}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Relevance</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-cyan-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${speaker.relevance}%` }} />
                            </div>
                            <span className="font-bold text-slate-800">{speaker.relevance}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Availability</span>
                          <span className={`font-semibold ${
                            speaker.availability === 'High' ? 'text-green-600' : 
                            speaker.availability === 'Medium' ? 'text-amber-600' : 'text-red-600'
                          }`}>{speaker.availability}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Expected Impact</span>
                          <span className="font-semibold text-purple-600">{speaker.expectedImpact}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Profile</p>
                        <p className="text-xs text-slate-600">{speaker.profile}</p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-cyan-500" />
                          <span className="text-slate-600">{speaker.suggestedFormat}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-slate-600">{speaker.estimatedFee}</span>
                        </div>
                      </div>

                      <button className="w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        Contact Speaker
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Continue with other features in next part... */}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}