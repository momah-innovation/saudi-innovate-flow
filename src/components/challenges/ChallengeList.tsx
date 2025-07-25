import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Building, 
  Users, 
  Calendar,
  TrendingUp,
  Lightbulb,
  Eye,
  Edit
} from "lucide-react";

export const ChallengeList = () => {
  const challenges = [
    {
      id: 1,
      title: "Smart Traffic Management System",
      description: "Develop an AI-powered traffic management system to reduce congestion and improve traffic flow in major cities.",
      sector: "Transportation",
      department: "Traffic Management",
      status: "Active",
      priority: "High",
      ideas: 23,
      experts: 5,
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      budget: "SR 2.5M",
      stage: "Evaluation"
    },
    {
      id: 2,
      title: "Digital Housing Services Platform",
      description: "Create a comprehensive digital platform for all housing-related services and applications.",
      sector: "Housing",
      department: "Digital Services",
      status: "Active",
      priority: "Medium",
      ideas: 15,
      experts: 3,
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      budget: "SR 1.8M",
      stage: "Pilot"
    },
    {
      id: 3,
      title: "Sustainable Urban Planning Framework",
      description: "Develop a framework for sustainable urban development aligned with Vision 2030 environmental goals.",
      sector: "Urban Design",
      department: "Planning",
      status: "Draft",
      priority: "High",
      ideas: 31,
      experts: 8,
      startDate: "2024-03-01",
      endDate: "2024-12-01",
      budget: "SR 3.2M",
      stage: "Ideation"
    },
    {
      id: 4,
      title: "Smart Building Energy Management",
      description: "Implement IoT-based energy management systems in government buildings to optimize consumption.",
      sector: "Infrastructure",
      department: "Facilities",
      status: "Active",
      priority: "Medium",
      ideas: 18,
      experts: 6,
      startDate: "2024-01-20",
      endDate: "2024-07-20",
      budget: "SR 1.5M",
      stage: "Scale"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success border-success/20";
      case "Draft": return "bg-warning/10 text-warning border-warning/20";
      case "Completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium": return "bg-warning/10 text-warning border-warning/20";
      case "Low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Ideation": return "bg-innovation/10 text-innovation border-innovation/20";
      case "Evaluation": return "bg-accent/10 text-accent border-accent/20";
      case "Pilot": return "bg-warning/10 text-warning border-warning/20";
      case "Scale": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Innovation Challenges</h2>
          <p className="text-muted-foreground">
            Manage and track innovation challenges across all sectors
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Challenge
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search challenges..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="urban-design">Urban Design</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="group hover:shadow-card transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {challenge.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getStatusColor(challenge.status)}>
                  {challenge.status}
                </Badge>
                <Badge className={getPriorityColor(challenge.priority)}>
                  {challenge.priority} Priority
                </Badge>
                <Badge className={getStageColor(challenge.stage)}>
                  {challenge.stage}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Organization Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {challenge.sector} • {challenge.department}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                      <Lightbulb className="h-4 w-4" />
                      Ideas
                    </div>
                    <div className="text-xl font-bold text-innovation">{challenge.ideas}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                      <Users className="h-4 w-4" />
                      Experts
                    </div>
                    <div className="text-xl font-bold text-expert">{challenge.experts}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      Budget
                    </div>
                    <div className="text-sm font-bold text-primary">{challenge.budget}</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};