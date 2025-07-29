import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Target, CheckCircle, AlertTriangle, Mail, Building, 
  User, Calendar, Clock
} from 'lucide-react';
import { ProfileCardData } from './profile-card';

interface ProfileDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ProfileCardData | null;
  children?: ReactNode;
}

export function ProfileDetailDialog({
  open,
  onOpenChange,
  data,
  children
}: ProfileDetailDialogProps) {
  if (!data) return null;

  const displayName = data.name || data.name_ar || 'مستخدم غير معروف';
  const displayEmail = data.email || 'غير محدد';
  const avatarFallback = displayName.charAt(0) || 'U';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={data.profile_image_url} />
              <AvatarFallback className="text-lg">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{displayName}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {displayEmail}
              </DialogDescription>
              {data.position && (
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  {data.position}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الدور</label>
                  <div className="mt-1">
                    <Badge variant="outline">{data.role || 'غير محدد'}</Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الحالة</label>
                  <div className="mt-1">
                    <Badge variant={data.status === 'active' ? 'default' : 'secondary'}>
                      {data.status === 'active' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {data.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </div>
              </div>

              {data.department && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    القسم
                  </label>
                  <p className="mt-1 text-sm">{data.department}</p>
                </div>
              )}

              {data.specialization && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">التخصص</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.isArray(data.specialization) ? (
                      data.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {data.specialization}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          {(data.current_workload !== undefined || data.activeAssignments !== undefined) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">مقاييس الأداء</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.current_workload !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      عبء العمل الحالي
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>النسبة المئوية</span>
                        <span className="font-medium">{data.current_workload}%</span>
                      </div>
                      <Progress value={data.current_workload} className="h-3" />
                    </div>
                  </div>
                )}

                {data.activeAssignments !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      المهام النشطة
                    </label>
                    <p className="mt-1 text-2xl font-bold">{data.activeAssignments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {Object.keys(data).some(key => 
            !['id', 'name', 'name_ar', 'email', 'profile_image_url', 'role', 'department', 'position', 'specialization', 'current_workload', 'status', 'activeAssignments'].includes(key)
          ) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data).map(([key, value]) => {
                    if (['id', 'name', 'name_ar', 'email', 'profile_image_url', 'role', 'department', 'position', 'specialization', 'current_workload', 'status', 'activeAssignments'].includes(key)) {
                      return null;
                    }
                    
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-medium">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}