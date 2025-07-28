import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Users, Lightbulb, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isThisMonth, format, subMonths, isSameMonth } from "date-fns";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

interface IdeaAnalyticsProps {
  className?: string;
}

export function IdeaAnalytics({ className }: IdeaAnalyticsProps) {
  // Mock data query - replace with actual API call
  const { data, isLoading, error } = useQuery({
    queryKey: ['idea-analytics'],
    queryFn: async () => {
      // Simulate API call
      return Array.from({ length: 50 }, (_, i) => ({
        id: `idea-${i + 1}`,
        title: `Idea ${i + 1}`,
        description: `Description for idea ${i + 1}`,
        status: ['draft', 'submitted', 'under_review', 'approved', 'implemented', 'rejected'][Math.floor(Math.random() * 6)],
        score: Math.floor(Math.random() * 100),
        maturity_level: ['concept', 'prototype', 'pilot', 'scaling'][Math.floor(Math.random() * 4)],
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        submitter_id: `user-${Math.floor(Math.random() * 10) + 1}`,
        challenge_id: `challenge-${Math.floor(Math.random() * 5) + 1}`,
        focus_question_id: Math.random() > 0.5 ? `fq-${Math.floor(Math.random() * 3) + 1}` : null,
        category: ['technology', 'process', 'service', 'product'][Math.floor(Math.random() * 4)],
        sector: ['health', 'education', 'transport', 'environment', 'economy'][Math.floor(Math.random() * 5)],
        tags: ['innovation', 'digital', 'sustainability', 'efficiency'].slice(0, Math.floor(Math.random() * 4) + 1),
      }));
    },
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;
  if (!data?.length) return <div>No data available</div>;

  const ideas = data;

  // Calculate key metrics
  const totalIdeas = ideas.length;
  const implementedIdeas = ideas.filter(idea => idea.status === 'implemented').length;
  const pendingIdeas = ideas.filter(idea => idea.status === 'under_review').length;
  const averageScore = totalIdeas > 0 ? ideas.reduce((acc, idea) => acc + Number(idea.score), 0) / totalIdeas : 0;
  const implementationRate = totalIdeas > 0 ? (implementedIdeas / totalIdeas) * 100 : 0;

  // Growth calculations
  const currentMonthIdeas = ideas.filter(idea => 
    isThisMonth(new Date(idea.created_at))
  ).length;
  const previousMonthIdeas = ideas.filter(idea => 
    isSameMonth(new Date(idea.created_at), subMonths(new Date(), 1))
  ).length;
  const growthRate = previousMonthIdeas > 0 ? ((currentMonthIdeas - previousMonthIdeas) / previousMonthIdeas) * 100 : 0;

  // Status distribution
  const statusCounts = ideas.reduce((acc, idea) => {
    acc[idea.status] = (acc[idea.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count: Number(count),
    percentage: totalIdeas > 0 ? (Number(count) / totalIdeas) * 100 : 0
  }));

  // Maturity distribution
  const maturityCounts = ideas.reduce((acc, idea) => {
    acc[idea.maturity_level] = (acc[idea.maturity_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maturityDistribution = Object.entries(maturityCounts).map(([maturity, count]) => ({
    maturity,
    count: Number(count),
    percentage: totalIdeas > 0 ? (Number(count) / totalIdeas) * 100 : 0
  }));

  // Score distribution
  const scoreRanges = [
    { range: '0-25', min: 0, max: 25 },
    { range: '26-50', min: 26, max: 50 },
    { range: '51-75', min: 51, max: 75 },
    { range: '76-100', min: 76, max: 100 }
  ];

  const scoreDistribution = scoreRanges.map(range => ({
    range: range.range,
    count: ideas.filter(idea => 
      Number(idea.score) >= range.min && Number(idea.score) <= range.max
    ).length
  }));

  // Monthly trends
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const monthIdeas = ideas.filter(idea => {
      const ideaDate = new Date(idea.created_at);
      return ideaDate.getMonth() === date.getMonth() && 
             ideaDate.getFullYear() === date.getFullYear();
    });
    
    return {
      month: format(date, 'MMM'),
      ideas: monthIdeas.length,
      implemented: monthIdeas.filter(idea => idea.status === 'implemented').length
    };
  });

  // Category distribution
  const categoryData = Object.entries(
    ideas.reduce((acc, idea) => {
      acc[idea.category] = (acc[idea.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({
    category,
    count: Number(count)
  }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Ideas"
          value={totalIdeas}
          trend={{
            value: growthRate,
            label: "this month",
            direction: growthRate >= 0 ? "up" : "down"
          }}
          icon={<Lightbulb className="w-4 h-4" />}
          className="bg-card"
        />
        <MetricCard
          title="Implemented"
          value={implementedIdeas}
          trend={{
            value: implementationRate,
            label: "success rate",
            direction: "up"
          }}
          icon={<CheckCircle className="w-4 h-4" />}
          className="bg-card"
        />
        <MetricCard
          title="Pending Review"
          value={pendingIdeas}
          icon={<Clock className="w-4 h-4" />}
          className="bg-card"
        />
        <MetricCard
          title="Average Score"
          value={Math.round(averageScore)}
          icon={<TrendingUp className="w-4 h-4" />}
          className="bg-card"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Ideas by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => `${status}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Ideas by score ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Ideas submitted and implemented over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ideas" stroke="#8884d8" name="Submitted" />
                <Line type="monotone" dataKey="implemented" stroke="#82ca9d" name="Implemented" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Ideas by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Maturity Level Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Maturity Level Distribution</CardTitle>
          <CardDescription>Ideas by development maturity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {maturityDistribution.map((item, index) => (
              <div key={item.maturity} className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {item.count}
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                  {item.maturity}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.percentage.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}