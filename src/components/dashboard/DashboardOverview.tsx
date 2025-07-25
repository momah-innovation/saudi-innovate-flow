import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Award,
  Zap,
  Building
} from "lucide-react";

export const DashboardOverview = () => {
  const stats = [
    {
      title: "Active Challenges",
      value: "12",
      change: "+3 this month",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Submitted Ideas",
      value: "245",
      change: "+18 this week",
      icon: Lightbulb,
      color: "text-innovation",
      bgColor: "bg-innovation/10"
    },
    {
      title: "Active Stakeholders",
      value: "89",
      change: "+5 new",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Innovation Maturity",
      value: "76%",
      change: "+2% improvement",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  const recentChallenges = [
    {
      id: 1,
      title: "Smart Traffic Management System",
      sector: "Transportation",
      status: "Evaluation",
      ideas: 23,
      priority: "High"
    },
    {
      id: 2,
      title: "Digital Housing Services Platform",
      sector: "Housing",
      status: "Pilot",
      ideas: 15,
      priority: "Medium"
    },
    {
      id: 3,
      title: "Sustainable Urban Planning",
      sector: "Urban Design",
      status: "Active",
      ideas: 31,
      priority: "High"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Urban Innovation Hackathon",
      date: "2024-02-15",
      type: "Hackathon",
      participants: 150
    },
    {
      id: 2,
      title: "Smart Cities Workshop",
      date: "2024-02-20",
      type: "Workshop",
      participants: 45
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Recent Challenges
            </CardTitle>
            <CardDescription>
              Latest innovation challenges across sectors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChallenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Building className="h-3 w-3 mr-1" />
                        {challenge.sector}
                      </Badge>
                      <Badge 
                        variant={challenge.priority === "High" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {challenge.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{challenge.ideas} ideas</div>
                    <Badge 
                      variant={
                        challenge.status === "Pilot" ? "default" :
                        challenge.status === "Evaluation" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {challenge.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Innovation Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-innovation" />
              Innovation Pipeline
            </CardTitle>
            <CardDescription>
              Current stage distribution across all initiatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ideation</span>
                  <span>15 challenges</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Evaluation</span>
                  <span>8 challenges</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pilot</span>
                  <span>4 challenges</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scale</span>
                  <span>2 challenges</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Upcoming Events
          </CardTitle>
          <CardDescription>
            Scheduled innovation activities and campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.participants} participants expected
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};