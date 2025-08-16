/**
 * Opportunity Data Hook
 * Handles loading opportunity-related data including sectors and departments
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

interface Sector {
  id: string;
  name_ar: string;
  name?: string;
}

interface Department {
  id: string;
  name_ar: string;
  name?: string;
}

export const useOpportunityData = () => {
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Load sectors by IDs
  const loadSectorsByIds = useCallback(async (sectorIds: string[]) => {
    if (sectorIds.length === 0) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name_ar, name')
        .in('id', sectorIds);

      if (error) throw error;

      setSectors(data || []);
      debugLog.debug('Loaded sectors', { count: data?.length || 0 });
      return data || [];
    } catch (err) {
      debugLog.error('Failed to load sectors', { sectorIds, error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load departments by IDs
  const loadDepartmentsByIds = useCallback(async (departmentIds: string[]) => {
    if (departmentIds.length === 0) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name_ar, name')
        .in('id', departmentIds);

      if (error) throw error;

      setDepartments(data || []);
      debugLog.debug('Loaded departments', { count: data?.length || 0 });
      return data || [];
    } catch (err) {
      debugLog.error('Failed to load departments', { departmentIds, error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load both sectors and departments for opportunities
  const loadMetadataForOpportunities = useCallback(async (opportunities: any[]) => {
    if (!opportunities || opportunities.length === 0) {
      return { sectors: [], departments: [] };
    }

    const sectorIds = [...new Set(opportunities.map(opp => opp.sector_id).filter(Boolean))];
    const departmentIds = [...new Set(opportunities.map(opp => opp.department_id).filter(Boolean))];

    try {
      const [sectorsData, departmentsData] = await Promise.all([
        sectorIds.length > 0 ? loadSectorsByIds(sectorIds) : Promise.resolve([]),
        departmentIds.length > 0 ? loadDepartmentsByIds(departmentIds) : Promise.resolve([])
      ]);

      return {
        sectors: sectorsData,
        departments: departmentsData
      };
    } catch (err) {
      debugLog.error('Failed to load opportunity metadata', { error: err });
      throw err;
    }
  }, [loadSectorsByIds, loadDepartmentsByIds]);

  return {
    loading,
    sectors,
    departments,
    loadSectorsByIds,
    loadDepartmentsByIds,
    loadMetadataForOpportunities
  };
};