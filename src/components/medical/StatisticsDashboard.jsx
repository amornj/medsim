import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  BarChart3, Activity, Clock, Heart, Trophy, Users,
  DollarSign, Stethoscope, TrendingUp, TrendingDown, Target
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

// Colors for charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

// Get player stats from localStorage
function getLocalStats() {
  const stored = localStorage.getItem('medsim_player_stats');
  return stored ? JSON.parse(stored) : {
    totalScenarios: 0,
    totalWins: 0,
    currentStreak: 0,
    bestStreak: 0,
    conditionCounts: {},
    totalSpending: 0
  };
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, trend, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <Card className={`${colorClasses[color]} border`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-xs mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend)}% vs last week
              </div>
            )}
          </div>
          <Icon className="w-8 h-8 opacity-50" />
        </div>
      </CardContent>
    </Card>
  );
}

// Main Statistics Dashboard
export default function StatisticsDashboard({ open, onClose }) {
  const [localStats, setLocalStats] = useState(null);

  // Fetch performance history from API
  const { data: performances = [], isLoading } = useQuery({
    queryKey: ['performances'],
    queryFn: async () => {
      try {
        const result = await base44.entities.ScenarioPerformance.list();
        return result || [];
      } catch {
        return [];
      }
    },
    enabled: open
  });

  // Fetch doctor progressions
  const { data: doctorProgressions = [] } = useQuery({
    queryKey: ['doctorProgressions'],
    queryFn: async () => {
      try {
        const result = await base44.entities.DoctorProgression.list();
        return result || [];
      } catch {
        return [];
      }
    },
    enabled: open
  });

  useEffect(() => {
    if (open) {
      setLocalStats(getLocalStats());
    }
  }, [open]);

  // Calculate aggregated stats
  const totalScenarios = Math.max(performances.length, localStats?.totalScenarios || 0);
  const survivedCount = performances.filter(p => p.outcome === 'patient_survived').length;
  const survivalRate = totalScenarios > 0 ? ((survivedCount / totalScenarios) * 100).toFixed(1) : 0;
  const avgScore = performances.length > 0
    ? (performances.reduce((sum, p) => sum + (p.total_score || 0), 0) / performances.length).toFixed(1)
    : 0;
  const totalDuration = performances.reduce((sum, p) => sum + (p.total_duration || 0), 0);
  const totalHours = (totalDuration / 3600).toFixed(1);

  // Performance over time (last 30)
  const performanceData = performances.slice(-30).map((p, i) => ({
    name: `#${i + 1}`,
    score: p.total_score || 0,
    duration: Math.round((p.total_duration || 0) / 60)
  }));

  // Scenario breakdown by type
  const conditionCounts = performances.reduce((acc, p) => {
    const condition = p.scenario_condition || 'Unknown';
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(conditionCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  }));

  // Equipment analysis from performances
  const equipmentUsage = {};
  performances.forEach(p => {
    if (p.interventions_count) {
      equipmentUsage['Total Equipment'] = (equipmentUsage['Total Equipment'] || 0) + p.interventions_count;
    }
  });

  // Doctor statistics
  const doctorData = doctorProgressions.map(d => ({
    name: d.doctor_name?.split(' ')[1] || d.doctor_id,
    xp: d.experience_points || 0,
    level: d.level || 1,
    scenarios: d.scenarios_completed || 0
  })).sort((a, b) => b.xp - a.xp);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Statistics Dashboard
          </DialogTitle>
          <DialogDescription>
            Track your performance and progress over time
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  title="Total Scenarios"
                  value={totalScenarios}
                  icon={Activity}
                  color="blue"
                />
                <StatCard
                  title="Survival Rate"
                  value={`${survivalRate}%`}
                  icon={Heart}
                  color="green"
                />
                <StatCard
                  title="Average Score"
                  value={avgScore}
                  icon={Trophy}
                  color="yellow"
                />
                <StatCard
                  title="Play Time"
                  value={`${totalHours}h`}
                  icon={Clock}
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  title="Current Streak"
                  value={localStats?.currentStreak || 0}
                  icon={TrendingUp}
                  color="green"
                />
                <StatCard
                  title="Best Streak"
                  value={localStats?.bestStreak || 0}
                  icon={Target}
                  color="yellow"
                />
                <StatCard
                  title="Total Wins"
                  value={survivedCount}
                  icon={Trophy}
                  color="blue"
                />
                <StatCard
                  title="Doctors Used"
                  value={doctorProgressions.length}
                  icon={Users}
                  color="purple"
                />
              </div>

              {/* Quick Performance Chart */}
              {performanceData.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Recent Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="mt-0 space-y-4">
              {performanceData.length > 0 ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Score Trend (Last 30 Scenarios)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Score"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration Trend (minutes)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="duration" fill="#10b981" name="Duration (min)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-slate-50">
                  <CardContent className="pt-6 text-center">
                    <Activity className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">No performance data yet</p>
                    <p className="text-sm text-slate-400">Complete scenarios to see your stats</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Doctors Tab */}
            <TabsContent value="doctors" className="mt-0 space-y-4">
              {doctorData.length > 0 ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Doctor XP Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={doctorData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fontSize: 10 }} />
                          <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="xp" fill="#8b5cf6" name="Experience" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doctorData.map((doctor, i) => (
                      <Card key={i} className="bg-gradient-to-r from-purple-50 to-blue-50">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{doctor.name}</p>
                              <p className="text-sm text-slate-600">Level {doctor.level}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{doctor.xp} XP</Badge>
                              <p className="text-xs text-slate-500 mt-1">{doctor.scenarios} scenarios</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="bg-slate-50">
                  <CardContent className="pt-6 text-center">
                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">No doctor data yet</p>
                    <p className="text-sm text-slate-400">Play scenarios to level up doctors</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Scenarios Tab */}
            <TabsContent value="scenarios" className="mt-0 space-y-4">
              {pieData.length > 0 ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Scenarios by Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {pieData.map((item, i) => (
                      <Card key={i} className="bg-slate-50">
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-slate-500">{item.value} scenarios</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="bg-slate-50">
                  <CardContent className="pt-6 text-center">
                    <Target className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">No scenario data yet</p>
                    <p className="text-sm text-slate-400">Complete scenarios to see breakdown</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
