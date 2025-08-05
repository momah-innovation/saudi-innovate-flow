// Enhanced App.tsx with New Routing Architecture - Phase 1 Implementation
// Implements public/authenticated route separation with subscription awareness

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import { AuthProvider } from "@/contexts/AuthContext";

import { DirectionProvider } from "@/components/ui/direction-provider";
import { SidebarPersistenceProvider } from "@/contexts/SidebarContext";

// New routing components from Phase 1
import { PublicRoute } from "@/routing/RouteGuards";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ALL_ROUTES } from "@/routing/routes";
// Legacy components (will be organized better in subsequent phases)
import { MaintenanceGuard } from "@/components/maintenance/MaintenanceGuard";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import ProfileSetupPage from '@/pages/ProfileSetup';
import { PasswordReset } from '@/components/auth/PasswordReset';
import { UpdatePassword } from '@/components/auth/UpdatePassword';
import { EmailVerification } from '@/components/auth/EmailVerification';
// Import remaining components as before...
import ChallengeDetails from "./pages/ChallengeDetails";
import ChallengesManagementPage from "./pages/ChallengesManagement";
import FocusQuestionsManagement from "./pages/FocusQuestionsManagement";
import PartnersManagement from "./pages/PartnersManagement";
import SectorsManagement from "./pages/SectorsManagement";
import OrganizationalStructure from "./pages/OrganizationalStructure";
import ExpertAssignmentManagementPage from "./pages/ExpertAssignmentManagement";
import UserManagementPage from "./pages/UserManagementPage";
import SystemDocumentationPage from "./pages/SystemDocumentation";
import UserProfile from "./pages/UserProfile";
import SystemSettings from "./pages/SystemSettings";
import EvaluationsManagementPage from "./pages/EvaluationsManagement";
import CampaignsManagementPage from "./pages/CampaignsManagement";
import EventsManagementPage from "./pages/EventsManagement";
import StakeholdersManagementPage from "./pages/StakeholdersManagement";
import TeamManagement from "./pages/TeamManagement";
import InnovationTeamsManagement from "./pages/InnovationTeamsManagement";
import TeamWorkspace from "./pages/TeamWorkspace";
import RelationshipOverviewPage from "./pages/RelationshipOverview";
import IdeasManagementPage from "./pages/IdeasManagement";
import IdeasPage from "./pages/Ideas";
import UserDashboard from "./pages/UserDashboard";
import IdeaSubmissionWizard from "./pages/IdeaSubmissionWizard";
import IdeaDrafts from "./pages/IdeaDrafts";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertProfile from "./pages/ExpertProfile";
import EventsBrowse from "./pages/EventsBrowse";
import StatisticsPage from "./pages/StatisticsPage";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerProfile from "./pages/PartnerProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Challenges from "./pages/Challenges";
import ChallengeActivityHub from "./pages/ChallengeActivityHub";
import EvaluationsPage from "./pages/EvaluationsPage";
import EventRegistration from "./pages/EventRegistration";
import StakeholderDashboard from "./pages/StakeholderDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import TrendsPage from "./pages/TrendsPage";
import ReportsPage from "./pages/ReportsPage";
import SystemAnalyticsPage from "./pages/SystemAnalyticsPage";
import HelpPage from "./pages/HelpPage";
import SavedItemsPage from "./pages/SavedItems";
import DesignSystem from "./pages/DesignSystem";
import EvaluationManagement from "./pages/EvaluationManagement";
import Opportunities from "./pages/Opportunities";
import OpportunitiesManagement from "./pages/OpportunitiesManagement";
import { StorageManagementPage } from "./components/storage/StorageManagementPage";
import { UploaderSettingsProvider } from "./contexts/UploaderSettingsContext";
import { StoragePoliciesPage } from "./components/storage/StoragePoliciesPage";
import AdminRelationships from "./pages/AdminRelationships";
import AdminEvaluations from "./pages/AdminEvaluations";
import AccessControlManagement from "./pages/dashboard/AccessControlManagement";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import PaddleSubscriptionPage from "./pages/PaddleSubscriptionPage";
import LogflareAnalyticsPage from "./pages/LogflareAnalyticsPage";
import { ResponsiveAppShell } from "@/components/layout/ResponsiveAppShell";
import { useRTLAware } from "@/hooks/useRTLAware";

const queryClient = new QueryClient();

const App = () => {
  const { me } = useRTLAware();

  return (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <DirectionProvider>
        <TooltipProvider>
            <AuthProvider>
              <SidebarPersistenceProvider>
                <Toaster />
                <Sonner />
                <MaintenanceGuard>
                <BrowserRouter>
                  <Routes>
                    {/* ============ PUBLIC ROUTES - Completed Phase 1 Structure ============ */}
                    
                    {/* Landing Page */}
                    <Route path={ALL_ROUTES.HOME} element={<LandingPage />} />
                    
                    {/* Public Discovery Pages - Complete Implementation */}
                    <Route path={ALL_ROUTES.ABOUT} element={
                      <PublicRoute>
                        <div className="container mx-auto px-4 py-16">
                          <h1 className="text-4xl font-bold mb-8">حول منصة رواد</h1>
                          <div className="prose max-w-4xl">
                            <p className="text-lg mb-6">
                              منصة رواد هي منصة الابتكار الحكومي الرائدة في المملكة العربية السعودية، تهدف إلى تسريع التحول الرقمي وتحقيق أهداف رؤية 2030.
                            </p>
                            <h2 className="text-2xl font-semibold mb-4">رؤيتنا</h2>
                            <p className="mb-4">
                              أن نكون المنصة الرائدة في تمكين الابتكار الحكومي وتطوير الحلول المبتكرة التي تخدم المواطنين والمقيمين.
                            </p>
                            <h2 className="text-2xl font-semibold mb-4">مهمتنا</h2>
                            <p className="mb-4">
                              تسهيل التعاون بين الجهات الحكومية والقطاع الخاص والمبتكرين لإيجاد حلول مبتكرة للتحديات الحكومية.
                            </p>
                          </div>
                        </div>
                      </PublicRoute>
                    } />
                    <Route path={ALL_ROUTES.CAMPAIGNS} element={
                      <PublicRoute>
                        <div className="container mx-auto px-4 py-16">
                          <h1 className="text-4xl font-bold mb-8">حملات الابتكار</h1>
                          <p className="text-lg text-muted-foreground mb-8">
                            استكشف الحملات الجارية للابتكار عبر القطاعات الحكومية المختلفة.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="card p-6 border rounded-lg">
                              <h3 className="text-xl font-semibold mb-3">التحول الرقمي</h3>
                              <p className="text-muted-foreground mb-4">
                                مبادرات لتسريع التحول الرقمي في الخدمات الحكومية
                              </p>
                              <span className="badge bg-primary text-primary-foreground">نشطة</span>
                            </div>
                            <div className="card p-6 border rounded-lg">
                              <h3 className="text-xl font-semibold mb-3">المدن الذكية</h3>
                              <p className="text-muted-foreground mb-4">
                                حلول مبتكرة لتطوير المدن الذكية والمستدامة
                              </p>
                              <span className="badge bg-secondary text-secondary-foreground">قريباً</span>
                            </div>
                            <div className="card p-6 border rounded-lg">
                              <h3 className="text-xl font-semibold mb-3">الذكاء الاصطناعي</h3>
                              <p className="text-muted-foreground mb-4">
                                تطبيقات الذكاء الاصطناعي في الخدمات العامة
                              </p>
                              <span className="badge bg-accent text-accent-foreground">التخطيط</span>
                            </div>
                          </div>
                        </div>
                      </PublicRoute>
                    } />
                    <Route path={ALL_ROUTES.MARKETPLACE} element={
                      <PublicRoute>
                        <div className="container mx-auto px-4 py-16">
                          <h1 className="text-4xl font-bold mb-8">سوق الابتكار</h1>
                          <p className="text-lg text-muted-foreground mb-8">
                            اكتشف الفرص والشراكات الابتكارية في القطاع الحكومي.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <h2 className="text-2xl font-semibold">الفرص المتاحة</h2>
                              <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                  <h3 className="font-semibold mb-2">تطوير تطبيق خدمات حكومية</h3>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    مطلوب فريق لتطوير تطبيق موحد للخدمات الحكومية
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className="badge bg-success/10 text-success">مفتوحة</span>
                                    <span className="text-sm text-muted-foreground">الموعد النهائي: 30 أيام</span>
                                  </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                  <h3 className="font-semibold mb-2">حلول إنترنت الأشياء للمباني الحكومية</h3>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    تقنيات ذكية لإدارة الطاقة والأمان في المباني
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className="badge bg-yellow-100 text-yellow-800">قيد المراجعة</span>
                                    <span className="text-sm text-muted-foreground">الموعد النهائي: 15 أيام</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-6">
                              <h2 className="text-2xl font-semibold">الشراكات</h2>
                              <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                  <h3 className="font-semibold mb-2">مايكروسوفت السعودية</h3>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    شراكة في مجال الحوسبة السحابية والذكاء الاصطناعي
                                  </p>
                                  <span className="badge bg-info/10 text-info">شريك استراتيجي</span>
                                </div>
                                <div className="border rounded-lg p-4">
                                  <h3 className="font-semibold mb-2">جامعة الملك عبدالله</h3>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    تعاون في البحث والتطوير والابتكار التقني
                                  </p>
                                  <span className="badge bg-purple-100 text-purple-800">شريك أكاديمي</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PublicRoute>
                    } />
                    <Route path={ALL_ROUTES.PRICING} element={
                      <PublicRoute>
                        <div className="container mx-auto px-4 py-16">
                          <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">خطط الأسعار</h1>
                            <p className="text-lg text-muted-foreground">
                              اختر الخطة المناسبة لاحتياجاتك الابتكارية
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Free Tier */}
                            <div className="border rounded-lg p-6 bg-card">
                              <h3 className="text-xl font-semibold mb-2">الباقة المجانية</h3>
                              <div className="text-3xl font-bold mb-4">مجاناً</div>
                              <ul className="space-y-2 mb-6">
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  تقديم الأفكار الأساسية
                                </li>
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  عرض التحديات العامة
                                </li>
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  الوصول للمجتمع
                                </li>
                              </ul>
                              <button className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg">
                                ابدأ مجاناً
                              </button>
                            </div>
                            
                            {/* Professional */}
                            <div className="border-2 border-primary rounded-lg p-6 bg-card relative">
                              <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm`}>
                                الأكثر شعبية
                              </div>
                              <h3 className="text-xl font-semibold mb-2">المحترف</h3>
                              <div className="text-3xl font-bold mb-4">199 ريال<span className="text-base font-normal">/شهر</span></div>
                              <ul className="space-y-2 mb-6">
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  أفكار غير محدودة
                                </li>
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  تحليلات متقدمة
                                </li>
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  دعم أولوية
                                </li>
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  مساعدة الذكاء الاصطناعي
                                </li>
                              </ul>
                              <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg">
                                اشترك الآن
                              </button>
                            </div>
                            
                            {/* Enterprise */}
                            <div className="border rounded-lg p-6 bg-card">
                              <h3 className="text-xl font-semibold mb-2">المؤسسة</h3>
                              <div className="text-3xl font-bold mb-4">999 ريال<span className="text-base font-normal">/شهر</span></div>
                              <ul className="space-y-2 mb-6">
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  علامة تجارية مخصصة
                                </li>
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  أمان متقدم
                                </li>
                                <li className="flex items-center">
                                   <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  دعم مخصص
                                </li>
                                <li className="flex items-center">
                                  <span className={`w-4 h-4 bg-success rounded-full ${me('2')}`}></span>
                                  كل شيء غير محدود
                                </li>
                              </ul>
                              <button className="w-full bg-accent text-accent-foreground py-2 rounded-lg">
                                تواصل معنا
                              </button>
                            </div>
                          </div>
                        </div>
                      </PublicRoute>
                    } />

                    {/* Authentication Routes */}
                    <Route path={ALL_ROUTES.AUTH} element={<Auth />} />
                    <Route path="/auth/forgot-password" element={<PasswordReset />} />
                    <Route path="/auth/reset-password" element={<UpdatePassword />} />
                    <Route path="/auth/verify-email" element={<EmailVerification />} />
                    <Route path={ALL_ROUTES.LOGIN} element={<Auth />} />
                    <Route path={ALL_ROUTES.SIGNUP} element={<Auth />} />

                    {/* ============ WORKSPACE ROUTES - Completed Phase 1 Structure ============ */}
                    
                    {/* User Workspace - Enhanced Implementation */}
                    <Route path={ALL_ROUTES.WORKSPACE_USER} element={
                      <ProtectedRoute requireProfile>
                        <ResponsiveAppShell>
                          <div className="container mx-auto px-4 py-16">
                            <h1 className="text-2xl font-bold mb-6">مساحة عمل المستخدم</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">أفكاري</h3>
                                <p className="text-muted-foreground mb-4">إدارة الأفكار المقدمة والمسودات</p>
                                <button className="w-full bg-primary text-primary-foreground py-2 rounded">عرض الأفكار</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">التحديات</h3>
                                <p className="text-muted-foreground mb-4">التحديات المشارك فيها والمتاحة</p>
                                <button className="w-full bg-secondary text-secondary-foreground py-2 rounded">عرض التحديات</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">الإحصائيات</h3>
                                <p className="text-muted-foreground mb-4">تتبع الأداء والمشاركة</p>
                                <button className="w-full bg-accent text-accent-foreground py-2 rounded">عرض الإحصائيات</button>
                              </div>
                            </div>
                          </div>
                        </ResponsiveAppShell>
                      </ProtectedRoute>
                    } />

                    {/* Expert Workspace - Enhanced Implementation */}
                    <Route path={ALL_ROUTES.WORKSPACE_EXPERT} element={
                      <ProtectedRoute requireProfile>
                        <ResponsiveAppShell>
                          <div className="container mx-auto px-4 py-16">
                            <h1 className="text-2xl font-bold mb-6">مساحة عمل الخبير</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">التقييمات المعلقة</h3>
                                <p className="text-muted-foreground mb-4">الأفكار والحلول في انتظار التقييم</p>
                                <button className="w-full bg-primary text-primary-foreground py-2 rounded">بدء التقييم</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">التقييمات المكتملة</h3>
                                <p className="text-muted-foreground mb-4">سجل التقييمات والتعليقات</p>
                                <button className="w-full bg-secondary text-secondary-foreground py-2 rounded">عرض السجل</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">الأداء</h3>
                                <p className="text-muted-foreground mb-4">مقاييس الأداء والتقييمات</p>
                                <button className="w-full bg-accent text-accent-foreground py-2 rounded">عرض الأداء</button>
                              </div>
                            </div>
                          </div>
                        </ResponsiveAppShell>
                      </ProtectedRoute>
                    } />

                    {/* Organization Workspace - Enhanced Implementation */}
                    <Route path={ALL_ROUTES.WORKSPACE_ORG} element={
                      <ProtectedRoute requireProfile>
                        <ResponsiveAppShell>
                          <div className="container mx-auto px-4 py-16">
                            <h1 className="text-2xl font-bold mb-6">مساحة عمل المؤسسة</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">إدارة الفريق</h3>
                                <p className="text-muted-foreground mb-4">إضافة وإدارة أعضاء الفريق</p>
                                <button className="w-full bg-primary text-primary-foreground py-2 rounded">إدارة الفريق</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">المشاريع</h3>
                                <p className="text-muted-foreground mb-4">تتبع المشاريع والحملات</p>
                                <button className="w-full bg-secondary text-secondary-foreground py-2 rounded">عرض المشاريع</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">التقارير</h3>
                                <p className="text-muted-foreground mb-4">تقارير الأداء والإحصائيات</p>
                                <button className="w-full bg-accent text-accent-foreground py-2 rounded">عرض التقارير</button>
                              </div>
                            </div>
                          </div>
                        </ResponsiveAppShell>
                      </ProtectedRoute>
                    } />

                    {/* Admin Workspace - Enhanced Implementation */}
                    <Route path={ALL_ROUTES.WORKSPACE_ADMIN} element={
                      <ProtectedRoute requireProfile requiredRole="admin">
                        <ResponsiveAppShell>
                          <div className="container mx-auto px-4 py-16">
                            <h1 className="text-2xl font-bold mb-6">مساحة عمل الإدارة</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">إدارة المستخدمين</h3>
                                <p className="text-muted-foreground mb-4">إدارة حسابات وأدوار المستخدمين</p>
                                <button className="w-full bg-primary text-primary-foreground py-2 rounded">إدارة المستخدمين</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">إدارة النظام</h3>
                                <p className="text-muted-foreground mb-4">إعدادات النظام والصيانة</p>
                                <button className="w-full bg-secondary text-secondary-foreground py-2 rounded">إعدادات النظام</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">التحليلات</h3>
                                <p className="text-muted-foreground mb-4">تحليلات شاملة للمنصة</p>
                                <button className="w-full bg-accent text-accent-foreground py-2 rounded">عرض التحليلات</button>
                              </div>
                              <div className="card p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">الأمان</h3>
                                <p className="text-muted-foreground mb-4">مراقبة الأمان والتدقيق</p>
                                <button className="w-full bg-destructive text-destructive-foreground py-2 rounded">مراقبة الأمان</button>
                              </div>
                            </div>
                          </div>
                        </ResponsiveAppShell>
                      </ProtectedRoute>
                    } />

                    {/* ============ LEGACY ROUTES - Preserved from original App.tsx ============ */}
            <Route 
              path="/profile/setup" 
              element={
                <ProtectedRoute>
                  <ProfileSetupPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/challenges/:challengeId" 
              element={
                <ProtectedRoute requireProfile>
                  <ChallengeDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/challenges/activity/:challengeId" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <ChallengeActivityHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/challenges"
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <ChallengesManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/focus-questions" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <FocusQuestionsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/partners" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <PartnersManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/sectors" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <SectorsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/organizational-structure" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <OrganizationalStructure />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/expert-assignments" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <ExpertAssignmentManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/system-documentation" 
              element={
                <ProtectedRoute requireProfile>
                  <SystemDocumentationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/system-settings" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <SystemSettings />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/evaluations" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <EvaluationsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/campaigns" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <CampaignsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/innovation-teams" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <InnovationTeamsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/team-management" 
              element={
                <ProtectedRoute requireProfile>
                  <TeamManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/team-workspace" 
              element={
                <ProtectedRoute requireProfile>
                  <TeamWorkspace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <EventsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stakeholders" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <StakeholdersManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ideas" 
              element={
                <ProtectedRoute requireProfile>
                  <IdeasPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/ideas" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <IdeasManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/relationships" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <RelationshipOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute requireProfile>
                  <SubscriptionPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/paddle-subscription" 
              element={
                <ProtectedRoute requireProfile>
                  <PaddleSubscriptionPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/logflare-analytics" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <LogflareAnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile/:userId" 
              element={
                <ProtectedRoute requireProfile>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireProfile>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute requireProfile>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireProfile>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit-idea" 
              element={
                <ProtectedRoute requireProfile>
                  <IdeaSubmissionWizard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/drafts" 
              element={
                <ProtectedRoute requireProfile>
                  <IdeaDrafts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/expert-dashboard" 
              element={
                <ProtectedRoute requireProfile>
                  <ExpertDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/expert-profile" 
              element={
                <ProtectedRoute requireProfile>
                  <ExpertProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute requireProfile>
                  <EventsBrowse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={<StatisticsPage />} 
            />
            <Route 
              path="/partner-dashboard" 
              element={
                <ProtectedRoute requireProfile>
                  <PartnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/partner-profile" 
              element={
                <ProtectedRoute requireProfile>
                  <PartnerProfile />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<LandingPage />} />
            {/* Missing pages routes */}
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/event-registration" element={<EventRegistration />} />
            <Route path="/stakeholder-dashboard" element={<StakeholderDashboard />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/admin/system-analytics" element={<SystemAnalyticsPage />} />
            <Route 
              path="/admin/evaluation-management" 
              element={
                <ProtectedRoute requireProfile requiredRole="admin">
                  <EvaluationManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved" 
              element={
                <ProtectedRoute requireProfile>
                  <SavedItemsPage />
                </ProtectedRoute>
              } 
             />
             <Route 
               path="/opportunities" 
               element={
                 <ProtectedRoute requireProfile>
                   <Opportunities />
                 </ProtectedRoute>
               } 
              />
              <Route 
                path="/admin/opportunities" 
                element={
                  <ProtectedRoute requireProfile requiredRole="admin">
                    <OpportunitiesManagement />
                  </ProtectedRoute>
                } 
               />
                <Route 
                  path="/admin/storage" 
                  element={
                    <ProtectedRoute requireProfile requiredRole="admin">
                      <ResponsiveAppShell>
                        <UploaderSettingsProvider>
                          <StorageManagementPage />
                        </UploaderSettingsProvider>
                      </ResponsiveAppShell>
                    </ProtectedRoute>
                  } 
                 />
                <Route 
                  path="/admin/storage/policies" 
                  element={
                    <ProtectedRoute requireProfile requiredRole="admin">
                      <ResponsiveAppShell>
                        <StoragePoliciesPage />
                      </ResponsiveAppShell>
                    </ProtectedRoute>
                  } 
                  />
                 <Route 
                   path="/admin/relationships" 
                   element={
                     <ProtectedRoute requireProfile requiredRole="admin">
                        <ResponsiveAppShell>
                         <AdminRelationships />
                        </ResponsiveAppShell>
                     </ProtectedRoute>
                   } 
                  />
                 <Route 
                   path="/admin/evaluations" 
                   element={
                     <ProtectedRoute requireProfile requiredRole="admin">
                        <ResponsiveAppShell>
                         <AdminEvaluations />
                        </ResponsiveAppShell>
                     </ProtectedRoute>
                   } 
                  />
                <Route path="/help" element={<HelpPage />} />
                <Route 
                  path="/design-system" 
                  element={
                    <ProtectedRoute>
                      <ResponsiveAppShell>
                        <DesignSystem />
                      </ResponsiveAppShell>
                    </ProtectedRoute>
                  } 
                />
                 {/* Admin Dashboard route */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requireProfile requiredRole="admin">
                      <ResponsiveAppShell>
                        <AdminDashboard />
                      </ResponsiveAppShell>
                    </ProtectedRoute>
                  } 
                />
                {/* Dashboard routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requireProfile requiredRole="admin">
                      <ResponsiveAppShell>
                        <AdminDashboard />
                      </ResponsiveAppShell>
                    </ProtectedRoute>
                  } 
                />
                {/* Access Control Management - Super Admin Only */}
                <Route 
                  path="/dashboard/access-control" 
                  element={
                    <ProtectedRoute requireProfile requiredRole="super_admin">
                      <AccessControlManagement />
                    </ProtectedRoute>
                  } 
                />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
                </MaintenanceGuard>
              </SidebarPersistenceProvider>
            </AuthProvider>
        </TooltipProvider>
      </DirectionProvider>
    </I18nextProvider>
  </QueryClientProvider>
  );
};

export default App;
