import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Globe, MapPin, TrendingUp } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';


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
  const { t } = useUnifiedTranslation();
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
        // No data yet - set empty state
        setGeoData([]);
        setTotalViews(0);
      }
    } catch (error) {
      logger.error('Error loading geographic data', { component: 'GeographicAnalytics', action: 'fetchGeographicData' }, error as Error);
      // Set empty state on error
      setGeoData([]);
      setTotalViews(0);
    } finally {
      setLoading(false);
    }
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
            {t('opportunities:analytics.geographic_analytics')}
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
            {t('opportunities:analytics.geographic_distribution')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geoData.slice(0, 5).map((country, index) => (
              <div key={country.country_code} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <span>{flagEmoji(country.country_code)}</span>
                      {country.country_name}
                    </span>
                    <span>{country.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${country.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Countries List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {t('opportunities:analytics.top_countries')}
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
                      {country.view_count} {t('opportunities:analytics.views')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-medium text-sm">{country.percentage}%</p>
                    {index === 0 && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        {t('opportunities:analytics.top')}
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
              <p className="text-sm">{t('opportunities:analytics.no_geographic_data')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
