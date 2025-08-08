import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText, FileSpreadsheet, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export interface ExportFormat {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface ExportActionsProps {
  data: any[];
  filename?: string;
  formats?: ExportFormat[];
  onExport?: (format: string, data: any[]) => void;
  disabled?: boolean;
  className?: string;
}

const defaultFormats: ExportFormat[] = [
  {
    id: 'csv',
    label: 'CSV',
    icon: FileSpreadsheet,
    description: 'Comma-separated values'
  },
  {
    id: 'excel',
    label: 'Excel',
    icon: FileSpreadsheet,
    description: 'Microsoft Excel file'
  },
  {
    id: 'pdf',
    label: 'PDF',
    icon: FileText,
    description: 'Portable Document Format'
  },
  {
    id: 'json',
    label: 'JSON',
    icon: FileText,
    description: 'JavaScript Object Notation'
  }
];

export function ExportActions({
  data,
  filename = 'export',
  formats = defaultFormats,
  onExport,
  disabled = false,
  className
}: ExportActionsProps) {
  const { t } = useTranslation();

  const handleExport = async (format: string) => {
    try {
      if (onExport) {
        await onExport(format, data);
      } else {
        // Default export implementation
        await defaultExport(format, data, filename);
      }
      
      toast.success(t('export.success', 'Export completed successfully'));
    } catch (error) {
      logger.error('Export operation failed', { action: 'export', data: { format, filename, error } });
      toast.error(t('export.error', 'Export failed. Please try again.'));
    }
  };

  const defaultExport = async (format: string, data: any[], filename: string) => {
    switch (format) {
      case 'csv':
        exportToCsv(data, filename);
        break;
      case 'json':
        exportToJson(data, filename);
        break;
      case 'excel':
        // Would need a library like xlsx for Excel export
        toast.info(t('export.excel_not_implemented', 'Excel export not implemented yet'));
        break;
      case 'pdf':
        // Would need a library like jsPDF for PDF export
        toast.info(t('export.pdf_not_implemented', 'PDF export not implemented yet'));
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  };

  const exportToCsv = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value || '');
          return stringValue.includes(',') || stringValue.includes('"') 
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJson = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (formats.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={disabled || data.length === 0}
          className={className}
        >
          <Download className="mr-2 h-4 w-4" />
          {t('actions.export', 'Export')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {t('export.choose_format', 'Choose export format')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.map((format) => {
          const Icon = format.icon;
          return (
            <DropdownMenuItem
              key={format.id}
              onClick={() => handleExport(format.id)}
              className="flex flex-col items-start gap-1"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{format.label}</span>
              </div>
              {format.description && (
                <span className="text-xs text-muted-foreground ml-6">
                  {format.description}
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}