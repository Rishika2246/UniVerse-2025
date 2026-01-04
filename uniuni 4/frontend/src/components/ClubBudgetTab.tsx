import { motion } from 'motion/react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Edit, Download, Calendar, Target, Eye } from 'lucide-react';

export function ClubBudgetTab() {
  const budgetData = [
    { club: 'Tech Club', allocated: 350000, used: 252000, percentage: 72, status: 'healthy', trend: '+12%', remaining: 98000 },
    { club: 'Cultural Society', allocated: 280000, used: 182000, percentage: 65, status: 'healthy', trend: '+8%', remaining: 98000 },
    { club: 'Sports Club', allocated: 220000, used: 127600, percentage: 58, status: 'healthy', trend: '+5%', remaining: 92400 },
    { club: 'Music Society', allocated: 180000, used: 81000, percentage: 45, status: 'good', trend: '+3%', remaining: 99000 },
    { club: 'Drama Club', allocated: 120000, used: 45600, percentage: 38, status: 'good', trend: '+2%', remaining: 74400 },
    { club: 'Art Club', allocated: 150000, used: 142500, percentage: 95, status: 'warning', trend: '+15%', remaining: 7500 },
  ];

  const recentTransactions = [
    { id: 1, club: 'Tech Club', event: 'Hackathon 2024', amount: 50000, type: 'allocation', date: '2024-03-15', status: 'approved' },
    { id: 2, club: 'Music Society', event: 'Spring Concert', amount: 75000, type: 'allocation', date: '2024-03-14', status: 'approved' },
    { id: 3, club: 'Sports Club', event: 'Sports Equipment', amount: 35000, type: 'expense', date: '2024-03-13', status: 'completed' },
    { id: 4, club: 'Drama Club', event: 'Theatre Workshop', amount: 15000, type: 'allocation', date: '2024-03-12', status: 'approved' },
    { id: 5, club: 'Art Club', event: 'Art Supplies', amount: 12000, type: 'expense', date: '2024-03-11', status: 'completed' },
  ];

  const quarterlyBudget = [
    { quarter: 'Q1 2024', allocated: 500000, spent: 425000, efficiency: 85 },
    { quarter: 'Q2 2024', allocated: 600000, spent: 480000, efficiency: 80 },
    { quarter: 'Q3 2024', allocated: 550000, spent: 495000, efficiency: 90 },
    { quarter: 'Q4 2024', allocated: 600000, spent: 520000, efficiency: 87 },
  ];

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-cyan-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">₹12.5L</h3>
          <p className="text-sm text-slate-600">Total Budget Allocated</p>
          <p className="text-xs text-green-600 mt-1">+₹2L from last year</p>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">₹8.8L</h3>
          <p className="text-sm text-slate-600">Total Spent</p>
          <p className="text-xs text-green-600 mt-1">70% utilization</p>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-600" />
            <TrendingDown className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">₹3.7L</h3>
          <p className="text-sm text-slate-600">Remaining Budget</p>
          <p className="text-xs text-amber-600 mt-1">30% available</p>
        </div>

        <div className="bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-amber-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">86%</h3>
          <p className="text-sm text-slate-600">Average Efficiency</p>
          <p className="text-xs text-green-600 mt-1">+4% from target</p>
        </div>
      </div>

      {/* Budget Distribution by Club */}
      <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Budget Distribution by Club</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="space-y-4">
          {budgetData.map((club, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-xl border border-cyan-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-800">{club.club}</h4>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        club.status === 'healthy' ? 'bg-green-100 text-green-700' :
                        club.status === 'good' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {club.status}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">{club.trend}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-slate-600 text-xs mb-1">Allocated</p>
                      <p className="font-bold text-slate-800">₹{(club.allocated / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-xs mb-1">Used</p>
                      <p className="font-bold text-cyan-600">₹{(club.used / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-xs mb-1">Remaining</p>
                      <p className="font-bold text-green-600">₹{(club.remaining / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-xs mb-1">Utilization</p>
                      <p className="font-bold text-purple-600">{club.percentage}%</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          club.percentage >= 90 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                          club.percentage >= 70 ? 'bg-gradient-to-r from-cyan-400 to-blue-500' :
                          'bg-gradient-to-r from-green-400 to-emerald-500'
                        }`}
                        style={{ width: `${club.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-cyan-200">
                <button className="flex-1 py-2 bg-white border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="flex-1 py-2 bg-white border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Adjust Budget
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Transactions & Quarterly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-xl border border-cyan-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-800">{transaction.event}</h4>
                    <p className="text-xs text-slate-600">{transaction.club}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'allocation' ? 'text-green-600' : 'text-amber-600'}`}>
                      {transaction.type === 'allocation' ? '+' : '-'}₹{(transaction.amount / 1000).toFixed(1)}K
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {transaction.date}
                  </span>
                  <span className={`font-semibold ${transaction.type === 'allocation' ? 'text-green-600' : 'text-amber-600'}`}>
                    {transaction.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quarterly Budget Performance */}
        <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quarterly Budget Performance</h3>
          <div className="space-y-4">
            {quarterlyBudget.map((quarter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-800">{quarter.quarter}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-600">{quarter.efficiency}%</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Efficiency</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Allocated</p>
                    <p className="font-bold text-slate-800">₹{(quarter.allocated / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Spent</p>
                    <p className="font-bold text-cyan-600">₹{(quarter.spent / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                    style={{ width: `${quarter.efficiency}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-amber-600" />
          Budget Alerts & Recommendations
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-white/80 rounded-xl border border-amber-200">
            <p className="text-sm text-slate-700"><span className="font-bold text-amber-700">⚠️ Art Club:</span> Budget utilization at 95%. Consider budget reallocation or requesting additional funds.</p>
          </div>
          <div className="p-4 bg-white/80 rounded-xl border border-green-200">
            <p className="text-sm text-slate-700"><span className="font-bold text-green-700">✅ Music Society:</span> Budget on track with healthy utilization (45%). Good financial management.</p>
          </div>
          <div className="p-4 bg-white/80 rounded-xl border border-blue-200">
            <p className="text-sm text-slate-700"><span className="font-bold text-blue-700">💡 Recommendation:</span> Overall budget efficiency is excellent at 86%. Consider increasing allocation for high-performing clubs next quarter.</p>
          </div>
        </div>
      </div>
    </div>
  );
}