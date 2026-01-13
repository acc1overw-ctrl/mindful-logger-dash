import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, FileText, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEntries } from '@/hooks/useEntries';
import { LIFESTYLE_CATEGORIES } from '@/types/entry';

export default function Analytics() {
  const { entries } = useEntries();

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });

    return LIFESTYLE_CATEGORIES
      .map(cat => ({ name: cat, count: counts[cat] || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [entries]);

  const stats = useMemo(() => {
    const thisMonth = entries.filter(e => {
      const date = new Date(e.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const lastMonth = entries.filter(e => {
      const date = new Date(e.date);
      const now = new Date();
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth * 100).toFixed(0) : 100;

    return {
      total: entries.length,
      thisMonth,
      growth: Number(growth),
      avgCategories: entries.length > 0 
        ? (entries.reduce((acc, e) => acc + e.categories.length, 0) / entries.length).toFixed(1)
        : 0,
    };
  }, [entries]);

  const trendInsights = useMemo(() => {
    const categoryFrequency: Record<string, number> = {};
    entries.forEach(entry => {
      entry.categories.forEach(cat => {
        categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
      });
    });

    const topCategories = Object.entries(categoryFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);

    const insights = [
      topCategories.length > 0 
        ? `**${topCategories[0]}** is the dominant lifestyle category, appearing in ${categoryFrequency[topCategories[0]]} entries.`
        : 'Start collecting data to see lifestyle trends.',
      topCategories.length > 1
        ? `Strong correlation between **${topCategories[0]}** and **${topCategories[1]}** preferences among customers.`
        : null,
      entries.length > 5
        ? `Average entry contains **${stats.avgCategories}** lifestyle categories, indicating multi-dimensional customer preferences.`
        : null,
      stats.growth > 0
        ? `Entry volume is trending **up ${stats.growth}%** compared to last month.`
        : stats.growth < 0
        ? `Entry volume has **decreased ${Math.abs(stats.growth)}%** from last month.`
        : null,
    ].filter(Boolean);

    return insights;
  }, [entries, stats]);

  const chartColors = [
    'hsl(239, 84%, 67%)',
    'hsl(239, 84%, 72%)',
    'hsl(239, 84%, 77%)',
    'hsl(239, 60%, 82%)',
    'hsl(220, 30%, 85%)',
    'hsl(220, 20%, 88%)',
  ];

  return (
    <AppLayout>
      <Header 
        title="Analytics" 
        subtitle="AI-powered insights from lifestyle data"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Entries', value: stats.total, icon: FileText, trend: null },
            { label: 'This Month', value: stats.thisMonth, icon: Users, trend: stats.growth },
            { label: 'Avg Categories', value: stats.avgCategories, icon: TrendingUp, trend: null },
            { label: 'AI Insights', value: trendInsights.length, icon: Sparkles, trend: null },
          ].map((stat, index) => (
            <Card key={stat.label} className="shadow-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  {stat.trend !== null && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {stat.trend >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {Math.abs(stat.trend)}%
                    </div>
                  )}
                </div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="text-lg">Top Lifestyle Categories</CardTitle>
              <CardDescription>Distribution of lifestyle preferences across entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100} 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-md)'
                      }}
                      cursor={{ fill: 'hsl(var(--accent))' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Trend Analysis</CardTitle>
                  <CardDescription>AI-generated insights from your data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendInsights.length > 0 ? (
                  trendInsights.map((insight, index) => (
                    <div 
                      key={index} 
                      className="flex gap-3 p-4 rounded-lg bg-secondary/50 animate-fade-in"
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                      <p 
                        className="text-sm text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: insight!.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') 
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p>Not enough data for trend analysis.</p>
                    <p className="text-sm">Add more entries to unlock AI insights.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
