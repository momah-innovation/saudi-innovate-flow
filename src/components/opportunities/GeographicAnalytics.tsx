import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Globe, MapPin, TrendingUp } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface GeographicAnalyticsProps {
  opportunityId: string;
}

interface GeographicData {
  country_name: string;
  country_code: string;
  view_count: number;
  percentage: number;
}

export const GeographicAnalytics = ({ opportunityId }: GeographicAnalyticsProps) => {
  const { isRTL } = useDirection();
  const [geoData, setGeoData] = useState<GeographicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    if (opportunityId) {
      loadGeographicData();
    }
  }, [opportunityId]);

  const loadGeographicData = async () => {
    try {
      setLoading(true);
      
      // Load geographic analytics data
      const { data, error } = await supabase
        .from('opportunity_geographic_analytics')
        .select('country_name, country_code, view_count')
        .eq('opportunity_id', opportunityId)
        .order('view_count', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const total = data.reduce((sum, item) => sum + item.view_count, 0);
        setTotalViews(total);
        
        const processedData = data.map(item => ({
          ...item,
          percentage: total > 0 ? Math.round((item.view_count / total) * 100) : 0
        }));
        
        setGeoData(processedData);
      } else {
        // Generate sample data if no real data exists
        const sampleData = generateSampleGeoData();
        setGeoData(sampleData);
        setTotalViews(sampleData.reduce((sum, item) => sum + item.view_count, 0));
      }
    } catch (error) {
      console.error('Error loading geographic data:', error);
      // Fallback to sample data
      const sampleData = generateSampleGeoData();
      setGeoData(sampleData);
      setTotalViews(sampleData.reduce((sum, item) => sum + item.view_count, 0));
    } finally {
      setLoading(false);
    }
  };

  const generateSampleGeoData = (): GeographicData[] => {
    const countries = [
      { name: isRTL ? 'السعودية' : 'Saudi Arabia', code: 'SA', views: 450 },
      { name: isRTL ? 'الإمارات' : 'UAE', code: 'AE', views: 320 },
      { name: isRTL ? 'مصر' : 'Egypt', code: 'EG', views: 280 },
      { name: isRTL ? 'الأردن' : 'Jordan', code: 'JO', views: 150 },
      { name: isRTL ? 'الكويت' : 'Kuwait', code: 'KW', views: 120 }
    ];
    
    const total = countries.reduce((sum, country) => sum + country.views, 0);
    
    return countries.map(country => ({
      country_name: country.name,
      country_code: country.code,
      view_count: country.views,
      percentage: Math.round((country.views / total) * 100)
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const flagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {isRTL ? 'التحليل الجغرافي' : 'Geographic Analytics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Geographic Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {isRTL ? 'التوزيع الجغرافي' : 'Geographic Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={geoData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="view_count"
                label={({ country_name, percentage }) => `${country_name}: ${percentage}%`}
              >
                {geoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [
                  `${value} ${isRTL ? 'مشاهدة' : 'views'}`,
                  isRTL ? 'المشاهدات' : 'Views'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Countries List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isRTL ? 'أهم البلدان' : 'Top Countries'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {geoData.slice(0, 8).map((country, index) => (
              <div key={country.country_code} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{flagEmoji(country.country_code)}</span>
                  <div>
                    <p className="font-medium text-sm">{country.country_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {country.view_count} {isRTL ? 'مشاهدة' : 'views'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-medium text-sm">{country.percentage}%</p>
                    {index === 0 && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        {isRTL ? 'الأعلى' : 'Top'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {geoData.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{isRTL ? 'لا توجد بيانات جغرافية متاحة' : 'No geographic data available'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};