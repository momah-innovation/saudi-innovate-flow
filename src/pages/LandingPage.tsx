import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Lightbulb, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Lightbulb,
      title: "Innovation Challenges",
      description: "Create and manage government innovation challenges aligned with Vision 2030 goals"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with domain experts and innovation specialists across government sectors"
    },
    {
      icon: Target,
      title: "Strategic Alignment",
      description: "Ensure all initiatives align with Saudi Vision 2030 strategic objectives"
    },
    {
      icon: TrendingUp,
      title: "Impact Analytics",
      description: "Track and measure innovation impact with comprehensive analytics and reporting"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security designed for government innovation management"
    },
    {
      icon: Globe,
      title: "Stakeholder Management",
      description: "Coordinate with partners, organizations, and stakeholders across the ecosystem"
    }
  ];

  const benefits = [
    "Accelerate government digital transformation",
    "Foster cross-sector collaboration",
    "Streamline innovation processes",
    "Align with Vision 2030 objectives",
    "Track measurable outcomes",
    "Build sustainable innovation culture"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-accent py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="h-16 w-16 rounded-xl bg-background/20 flex items-center justify-center mr-4">
              <div className="text-3xl">🏗️</div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-2">
                Ruwād Innovation System
              </h1>
              <p className="text-xl text-primary-foreground/90">
                نظام رواد للابتكار
              </p>
            </div>
          </div>
          
          <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Government Innovation Management Platform
          </p>
          
          <div className="mb-12">
            <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-background/30 text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Aligned with Saudi Vision 2030
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-4"
              onClick={() => navigate('/auth')}
            >
              Access Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-background/30 text-primary-foreground hover:bg-background/10 text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Empowering Government Innovation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive platform designed to accelerate innovation across government sectors, 
              fostering collaboration and driving measurable outcomes aligned with Vision 2030.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Transforming Government Innovation
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the digital transformation journey and be part of building a more innovative, 
                efficient, and citizen-centric government ecosystem.
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/auth')}
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-lg text-muted-foreground">
                    Innovation Dashboard Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Drive Innovation?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join government innovators across Saudi Arabia in building the future. 
              Access the platform and start your innovation journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/auth')}
              >
                Access Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
              <div className="text-lg">🏗️</div>
            </div>
            <span className="text-lg font-semibold">Ruwād Innovation System</span>
          </div>
          <p className="text-muted-foreground">
            Government Innovation Management Platform • Aligned with Saudi Vision 2030
          </p>
        </div>
      </footer>
    </div>
  );
}