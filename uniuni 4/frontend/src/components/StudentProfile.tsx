import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Code, Edit, Download, Share2, Star } from 'lucide-react';

export function StudentProfile({ user }: { user: any }) {
  const skills = [
    { name: 'React.js', level: 90, category: 'Frontend' },
    { name: 'Python', level: 85, category: 'Backend' },
    { name: 'Machine Learning', level: 75, category: 'AI/ML' },
    { name: 'Database Design', level: 88, category: 'Backend' },
    { name: 'UI/UX Design', level: 70, category: 'Design' },
    { name: 'Node.js', level: 82, category: 'Backend' },
  ];

  const achievements = [
    { title: 'Dean\'s List', date: 'Fall 2024', icon: Award, color: 'from-yellow-500 to-orange-500' },
    { title: 'Hackathon Winner', date: 'Oct 2024', icon: Code, color: 'from-purple-500 to-pink-500' },
    { title: 'Best Project Award', date: 'Sep 2024', icon: Star, color: 'from-blue-500 to-cyan-500' },
    { title: 'Perfect Attendance', date: 'Aug 2024', icon: Calendar, color: 'from-green-500 to-teal-500' },
  ];

  const projects = [
    {
      title: 'AI Chatbot for Campus',
      desc: 'Built an intelligent chatbot using NLP and ML',
      tech: ['Python', 'TensorFlow', 'Flask'],
      link: '#',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Student Management System',
      desc: 'Full-stack web app with React and Node.js',
      tech: ['React', 'Node.js', 'MongoDB'],
      link: '#',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Campus Navigation App',
      desc: 'AR-based navigation system for campus',
      tech: ['React Native', 'AR.js', 'Firebase'],
      link: '#',
      color: 'from-green-500 to-teal-500'
    },
  ];

  const timeline = [
    { year: '2024', event: 'Started Senior Year', type: 'academic' },
    { year: '2023', event: 'Won Inter-College Hackathon', type: 'achievement' },
    { year: '2023', event: 'Completed Summer Internship at Tech Corp', type: 'experience' },
    { year: '2022', event: 'Joined AI/ML Club', type: 'activity' },
    { year: '2021', event: 'Enrolled in Computer Science', type: 'academic' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
              <Edit className="w-4 h-4 text-gray-800" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
            <p className="text-xl text-gray-300 mb-4">{user.role === 'student' ? 'Computer Science Student' : user.role}</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-green-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4 text-purple-400" />
                <span>{user.id}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Resume
              </button>
              <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Portfolio
              </button>
              <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-white mb-1">9.3</p>
              <p className="text-xs text-gray-400">CGPA</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-white mb-1">92%</p>
              <p className="text-xs text-gray-400">Attendance</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-white mb-1">28</p>
              <p className="text-xs text-gray-400">Badges</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-6">Skills & Expertise</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-semibold">{skill.name}</span>
                  <span className="text-xs text-gray-400 ml-2">({skill.category})</span>
                </div>
                <span className="text-sm font-bold text-purple-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.4 + index * 0.05 }}
                  className={`h-full rounded-full ${
                    skill.level >= 85 ? 'bg-gradient-to-r from-green-500 to-teal-500' :
                    skill.level >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-6">Achievements & Awards</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`relative overflow-hidden bg-gradient-to-br ${achievement.color} p-6 rounded-2xl cursor-pointer`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <achievement.icon className="w-10 h-10 text-white mb-3 relative z-10" />
              <h4 className="text-white font-bold mb-1 relative z-10">{achievement.title}</h4>
              <p className="text-sm text-white/80 relative z-10">{achievement.date}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Featured Projects</h3>
          <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors">
            View All
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 transition-all group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center mb-4`}>
                <Code className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-bold mb-2 group-hover:text-purple-300 transition-colors">{project.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <span key={i} className="px-2 py-1 bg-white/5 text-xs text-gray-300 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <button className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors">
                View Project
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Academic Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-6">Academic Timeline</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500" />
          
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="relative flex items-start gap-6"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                  item.type === 'academic' ? 'bg-blue-500' :
                  item.type === 'achievement' ? 'bg-yellow-500' :
                  item.type === 'experience' ? 'bg-green-500' : 'bg-purple-500'
                }`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-all">
                    <p className="text-sm text-purple-400 font-semibold mb-1">{item.year}</p>
                    <h4 className="text-white font-semibold mb-1">{item.event}</h4>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.type === 'academic' ? 'bg-blue-500/20 text-blue-400' :
                      item.type === 'achievement' ? 'bg-yellow-500/20 text-yellow-400' :
                      item.type === 'experience' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
