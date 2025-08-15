import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useState } from "react";
import { FileText, Download, BookOpen, Settings, Code, Shield, Database, HelpCircle, ExternalLink, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SystemDocumentation = () => {
  const { t, language, isRTL } = useUnifiedTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');

  const title = t("systemDocumentation");
  const description = t("accessComprehensiveDocumentation");
  const searchPlaceholder = t("searchDocumentation");

  const documentationSections = [
    {
      id: "user-guide",
      title: t("userGuide"),
      description: t("comprehensiveUserManual"),
      icon: BookOpen,
      documents: [
        { name: t("gettingStarted"), type: "PDF", size: "2.3 MB", updated: "2024-01-15" },
        { name: t("userInterface"), type: "PDF", size: "1.8 MB", updated: "2024-01-12" },
        { name: t("expertManagement"), type: "PDF", size: "3.1 MB", updated: "2024-01-10" }
      ]
    },
    {
      id: "admin-guide",
      title: t("adminGuide"),
      description: t("administratorDocumentation"),
      icon: Settings,
      documents: [
        { name: t("systemConfiguration"), type: "PDF", size: "4.2 MB", updated: "2024-01-18" },
        { name: t("userManagement"), type: "PDF", size: "2.7 MB", updated: "2024-01-16" },
        { name: t("rolePermissions"), type: "PDF", size: "1.9 MB", updated: "2024-01-14" }
      ]
    },
    {
      id: "technical",
      title: t("technicalDocumentation"),
      description: t("systemArchitectureAPIs"),
      icon: Code,
      documents: [
        { name: t("apiReference"), type: "PDF", size: "5.8 MB", updated: "2024-01-20" },
        { name: t("databaseSchema"), type: "PDF", size: "3.4 MB", updated: "2024-01-19" },
        { name: t("deploymentGuide"), type: "PDF", size: "2.1 MB", updated: "2024-01-17" }
      ]
    },
    {
      id: "security",
      title: t("securityDocumentation"),
      description: t("securityPoliciesProcedures"),
      icon: Shield,
      documents: [
        { name: t("securityPolicies"), type: "PDF", size: "1.6 MB", updated: "2024-01-21" },
        { name: t("dataProtection"), type: "PDF", size: "2.9 MB", updated: "2024-01-20" },
        { name: t("accessControl"), type: "PDF", size: "1.4 MB", updated: "2024-01-18" }
      ]
    }
  ];

  const quickLinks = [
    { name: t("systemOverview"), icon: Database, href: "/admin/system-overview" },
    { name: t("userRoles"), icon: Settings, href: "/admin/roles" },
    { name: t("helpCenter"), icon: HelpCircle, href: "/help" },
    { name: t("supportTickets"), icon: FileText, href: "/support" }
  ];

  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('common.actions.export')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="html">HTML</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2">
        <Download className="w-4 h-4" />
        {t("downloadAll")}
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={t("filterByType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTypes")}</SelectItem>
            <SelectItem value="user">{t("userGuide")}</SelectItem>
            <SelectItem value="admin">{t("adminGuide")}</SelectItem>
            <SelectItem value="technical">{t("technicalDocumentation")}</SelectItem>
            <SelectItem value="security">{t("securityDocumentation")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderContent = () => (
    <div className="space-y-6">
      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {t("quickLinks")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Button
                key={link.name}
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                asChild
              >
                <a href={link.href}>
                  <link.icon className="h-6 w-6" />
                  <span className="text-sm">{link.name}</span>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <Tabs defaultValue="user-guide" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {documentationSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              <section.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {documentationSections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <section.icon className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                            <span>{t("updated")}: {doc.updated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{doc.type}</Badge>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* System Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {t("systemInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("version")}:</span>
              <Badge>v2.1.3</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("lastUpdate")}:</span>
              <span>2024-01-21</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("environment")}:</span>
              <Badge variant="outline">{t("production")}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("database")}:</span>
              <span>PostgreSQL 15</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {t("needHelp")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              {t("documentationHelpText")}
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                {t("submitTicket")}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <ExternalLink className="h-4 w-4" />
                {t("contactSupport")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <AppShell>
      <PageLayout 
        title={title}
        description={description}
        secondaryActions={secondaryActions}
        showLayoutSelector={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        {renderContent()}
      </PageLayout>
    </AppShell>
  );
};

export default SystemDocumentation;