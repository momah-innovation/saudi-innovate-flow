import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SectorManagementSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function SectorManagementSettings({ settings, onSettingChange }: SectorManagementSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [editingSector, setEditingSector] = useState<string | null>(null);
  const [newSectorKey, setNewSectorKey] = useState("");
  const [newSectorName, setNewSectorName] = useState("");
  const [newSectorDescription, setNewSectorDescription] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Get current sectors from settings
  const currentSectors = settings.sectorTypes || [
    'health', 'education', 'transport', 'environment', 'economy', 
    'technology', 'finance', 'defense', 'social', 'interior', 
    'foreign_affairs', 'justice', 'islamic_affairs', 'agriculture', 
    'energy', 'housing', 'labor', 'commerce', 'tourism', 'culture', 
    'sports', 'media', 'municipal_affairs', 'water', 'civil_service', 
    'planning', 'communications', 'public_works'
  ];

  const addNewSector = () => {
    if (!newSectorKey.trim() || !newSectorName.trim()) {
      toast({
        title: t('error'),
        description: isRTL ? "يرجى إدخال جميع الحقول المطلوبة" : "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (currentSectors.includes(newSectorKey.trim())) {
      toast({
        title: t('error'),
        description: isRTL ? "هذا القطاع موجود بالفعل" : "This sector already exists",
        variant: "destructive"
      });
      return;
    }

    const updatedSectors = [...currentSectors, newSectorKey.trim()];
    onSettingChange('sectorTypes', updatedSectors);
    
    // Reset form
    setNewSectorKey("");
    setNewSectorName("");
    setNewSectorDescription("");
    setIsAddingNew(false);
    
    toast({
      title: t('success'),
      description: isRTL ? "تم إضافة القطاع بنجاح" : "Sector added successfully"
    });
  };

  const removeSector = (sectorKey: string) => {
    const updatedSectors = currentSectors.filter(sector => sector !== sectorKey);
    onSettingChange('sectorTypes', updatedSectors);
    
    toast({
      title: t('success'),
      description: isRTL ? "تم حذف القطاع بنجاح" : "Sector removed successfully"
    });
  };

  const getSectorDisplayName = (sectorKey: string) => {
    return t(`sectors.${sectorKey}`) || sectorKey;
  };

  const getSectorDescription = (sectorKey: string) => {
    return t(`sectorDescriptions.${sectorKey}`) || "";
  };

  const getColorForSector = (sectorKey: string) => {
    // Map sector keys to their design system colors
    const colorMap: { [key: string]: string } = {
      health: 'bg-sector-health text-sector-health-foreground',
      education: 'bg-sector-education text-sector-education-foreground',
      transport: 'bg-sector-transport text-sector-transport-foreground',
      environment: 'bg-sector-environment text-sector-environment-foreground',
      economy: 'bg-sector-economy text-sector-economy-foreground',
      technology: 'bg-sector-technology text-sector-technology-foreground',
      finance: 'bg-sector-finance text-sector-finance-foreground',
      defense: 'bg-sector-defense text-sector-defense-foreground',
      social: 'bg-sector-social text-sector-social-foreground',
      interior: 'bg-sector-interior text-sector-interior-foreground',
      foreign_affairs: 'bg-sector-foreign-affairs text-sector-foreign-affairs-foreground',
      justice: 'bg-sector-justice text-sector-justice-foreground',
      islamic_affairs: 'bg-sector-islamic-affairs text-sector-islamic-affairs-foreground',
      agriculture: 'bg-sector-agriculture text-sector-agriculture-foreground',
      energy: 'bg-sector-energy text-sector-energy-foreground',
      housing: 'bg-sector-housing text-sector-housing-foreground',
      labor: 'bg-sector-labor text-sector-labor-foreground',
      commerce: 'bg-sector-commerce text-sector-commerce-foreground',
      tourism: 'bg-sector-tourism text-sector-tourism-foreground',
      culture: 'bg-sector-culture text-sector-culture-foreground',
      sports: 'bg-sector-sports text-sector-sports-foreground',
      media: 'bg-sector-media text-sector-media-foreground',
      municipal_affairs: 'bg-sector-municipal-affairs text-sector-municipal-affairs-foreground',
      water: 'bg-sector-water text-sector-water-foreground',
      civil_service: 'bg-sector-civil-service text-sector-civil-service-foreground',
      planning: 'bg-sector-planning text-sector-planning-foreground',
      communications: 'bg-sector-communications text-sector-communications-foreground',
      public_works: 'bg-sector-public-works text-sector-public-works-foreground'
    };
    
    return colorMap[sectorKey] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Building2 className="w-5 h-5" />
                {isRTL ? 'إدارة القطاعات الحكومية السعودية' : 'Saudi Government Sectors Management'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إدارة قائمة القطاعات والوزارات الحكومية المتاحة في النظام'
                  : 'Manage the list of government sectors and ministries available in the system'
                }
              </CardDescription>
            </div>
            <Badge variant="outline" className={isRTL ? 'ml-4' : 'mr-4'}>
              {currentSectors.length} {isRTL ? 'قطاع' : 'sectors'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSectors.map((sectorKey) => (
              <Card key={sectorKey} className="border-2">
                <CardContent className="p-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-3 h-3 rounded-full ${getColorForSector(sectorKey)}`}></div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h4 className="font-semibold text-sm">{getSectorDisplayName(sectorKey)}</h4>
                        <p className="text-xs text-muted-foreground">{getSectorDescription(sectorKey)}</p>
                        <Badge variant="outline" className="text-xs mt-1">{sectorKey}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSector(sectorKey)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Sector Form */}
          {isAddingNew ? (
            <Card className="border-dashed border-2">
              <CardContent className="p-4 space-y-4">
                <h4 className="font-semibold">
                  {isRTL ? 'إضافة قطاع جديد' : 'Add New Sector'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sectorKey">
                      {isRTL ? 'مفتاح القطاع (بالإنجليزية)' : 'Sector Key (English)'}
                    </Label>
                    <Input
                      id="sectorKey"
                      value={newSectorKey}
                      onChange={(e) => setNewSectorKey(e.target.value)}
                      placeholder={isRTL ? 'مثال: new_ministry' : 'e.g., new_ministry'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sectorName">
                      {isRTL ? 'اسم القطاع' : 'Sector Name'}
                    </Label>
                    <Input
                      id="sectorName"
                      value={newSectorName}
                      onChange={(e) => setNewSectorName(e.target.value)}
                      placeholder={isRTL ? 'مثال: الوزارة الجديدة' : 'e.g., New Ministry'}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sectorDescription">
                    {isRTL ? 'وصف القطاع' : 'Sector Description'}
                  </Label>
                  <Textarea
                    id="sectorDescription"
                    value={newSectorDescription}
                    onChange={(e) => setNewSectorDescription(e.target.value)}
                    placeholder={isRTL ? 'وصف مختصر للقطاع...' : 'Brief description of the sector...'}
                  />
                </div>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button onClick={addNewSector} size="sm">
                    <Check className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'حفظ' : 'Save'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewSectorKey("");
                      setNewSectorName("");
                      setNewSectorDescription("");
                    }}
                  >
                    <X className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsAddingNew(true)}
              className="w-full border-dashed"
            >
              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إضافة قطاع جديد' : 'Add New Sector'}
            </Button>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-2xl font-bold text-sector-health">{currentSectors.filter(s => s.includes('health')).length}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'قطاعات صحية' : 'Health Sectors'}</div>
            </div>
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-2xl font-bold text-sector-education">{currentSectors.filter(s => s.includes('education')).length}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'قطاعات تعليمية' : 'Education Sectors'}</div>
            </div>
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-2xl font-bold text-sector-technology">{currentSectors.filter(s => s.includes('tech') || s.includes('communication')).length}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'قطاعات تقنية' : 'Tech Sectors'}</div>
            </div>
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-2xl font-bold text-primary">{currentSectors.length}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'إجمالي القطاعات' : 'Total Sectors'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}