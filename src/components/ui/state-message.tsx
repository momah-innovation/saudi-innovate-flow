import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useAppTranslation";

type StateType = 'loading' | 'success' | 'error' | 'warning' | 'info';

interface StateMessageProps {
  type: StateType;
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

const stateConfig = {
  loading: {
    icon: Loader2,
    className: "border-info-border bg-info-light text-info",
    iconClassName: "text-info animate-spin"
  },
  success: {
    icon: CheckCircle,
    className: "border-success-border bg-success-light text-success",
    iconClassName: "text-success"
  },
  error: {
    icon: AlertCircle,
    className: "border-destructive bg-destructive/10 text-destructive",
    iconClassName: "text-destructive"
  },
  warning: {
    icon: AlertTriangle,
    className: "border-warning-border bg-warning-light text-warning",
    iconClassName: "text-warning"
  },
  info: {
    icon: Info,
    className: "border-info-border bg-info-light text-info",
    iconClassName: "text-info"
  }
};

export function StateMessage({ type, title, message, action, className }: StateMessageProps) {
  const config = stateConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={`${config.className} ${className || ''}`}>
      <Icon className={`h-4 w-4 ${config.iconClassName}`} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {action && <div className="ml-4">{action}</div>}
      </AlertDescription>
    </Alert>
  );
}

// Predefined common states
export const LoadingState = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return <StateMessage type="loading" message={message || t('loading')} />;
};

export const ErrorState = ({ 
  message, 
  action 
}: { 
  message?: string; 
  action?: ReactNode;
}) => {
  const { t } = useTranslation();
  return <StateMessage type="error" title={t('error')} message={message || t('error')} action={action} />;
};

export const SuccessState = ({ message, action }: { message: string; action?: ReactNode }) => {
  return <StateMessage type="success" message={message} action={action} />;
};