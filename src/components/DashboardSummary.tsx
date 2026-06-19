"use client";

import React from 'react';
import { useEmails } from '@/hooks/useEmailClassification';
import { useEmailStore } from '@/store/useEmailStore';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export const DashboardSummary: React.FC = () => {
  const { data: emails = [], isLoading } = useEmails();
  const getCounts = useEmailStore(state => state.getCounts);
  const counts = getCounts(emails);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-8 text-slate-400 animate-pulse font-mono tracking-widest text-sm">
          SYNCHRONIZING DATA STREAMS...
        </div>
      </div>
    );
  }

  // Calculate advanced stats
  const total = emails.length;
  const manuallyReclassified = emails.filter(e => e.status === 'manually_reclassified').length;
  const accuracy = total > 0 ? ((total - manuallyReclassified) / total) * 100 : 100;

  // Confidence distribution calculations
  let highConf = 0;
  let modConf = 0;
  let lowConf = 0;

  emails.forEach(e => {
    if (e.confidence >= 0.90) {
      highConf++;
    } else if (e.confidence >= 0.65) {
      modConf++;
    } else {
      lowConf++;
    }
  });

  const confidenceData = [
    { name: 'High (≥90%)', count: highConf, fill: '#10B981' },
    { name: 'Moderate (65-89%)', count: modConf, fill: '#F59E0B' },
    { name: 'Low (<65%)', count: lowConf, fill: '#EF4444' }
  ];

  // Category distribution calculations
  const categoryData = Object.entries(counts.byCategory)
    .filter(([_, count]) => count > 0)
    .map(([cat, count]) => ({
      name: cat.replace('_', ' '),
      value: count
    }));

  const COLORS = ['#0D9488', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#10B981', '#64748B'];

  // Custom tooltips for recharts to match dark theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-caldim-panel border border-caldim-border p-3 rounded shadow-lg font-mono text-xs">
          <p className="text-slate-300 capitalize">{`${payload[0].name} : `}
            <span className="text-caldim-accent font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-slate-100 mb-2 tracking-wide uppercase">System Analytics Overview</h2>
        <p className="text-slate-400 text-sm">Real-time throughput, accuracy ratings, and confidence intervals from the Caldim Digital Postmaster.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 font-mono">Total Processed</h3>
          <p className="text-4xl font-black text-slate-200 group-hover:scale-105 transition-transform origin-left font-mono">{counts.total}</p>
        </div>
        
        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 font-mono">Auto-Routed</h3>
          <p className="text-4xl font-black text-emerald-400 group-hover:scale-105 transition-transform origin-left font-mono">{counts.autoRouted}</p>
        </div>
        
        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 font-mono">Pending Review</h3>
          <p className="text-4xl font-black text-red-400 group-hover:scale-105 transition-transform origin-left font-mono">{counts.manualReview}</p>
        </div>

        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border relative overflow-hidden shadow-lg group bg-gradient-to-br from-caldim-panel to-caldim-primary/5">
          <div className="absolute top-0 left-0 w-1 h-full bg-caldim-primary shadow-[0_0_8px_rgba(13,148,136,0.8)]"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 font-mono">AI Accuracy Rate</h3>
          <p className="text-4xl font-black text-caldim-accent group-hover:scale-105 transition-transform origin-left font-mono">
            {accuracy.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Pie Chart */}
        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border shadow-lg flex flex-col h-96">
          <h3 className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-4 font-mono">Category Distribution</h3>
          {categoryData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
              NO CLASSIFIED DATA FOR DISTRIBUTION ANALYSIS
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#94A3B8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Confidence Score Bar Chart */}
        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border shadow-lg flex flex-col h-96">
          <h3 className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-4 font-mono">Confidence Level Distribution</h3>
          {total === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
              NO STREAM DATA TO PLOT CONFIDENCE LEVELS
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={confidenceData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {confidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      
      {/* Category List view */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Throughput by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(counts.byCategory).map(([cat, count]) => (
            <div key={cat} className="bg-caldim-panel p-4 rounded-lg border border-caldim-border flex justify-between items-center group hover:border-caldim-primary/50 transition-all shadow hover:shadow-lg">
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider truncate mr-2 group-hover:text-caldim-accent transition-colors font-mono">{cat.replace('_', ' ')}</span>
              <span className="text-2xl font-black text-slate-200 font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
