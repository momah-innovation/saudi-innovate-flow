import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

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
    className: "border-blue-200 bg-blue-50 text-blue-900",
    iconClassName: "text-blue-600 animate-spin"
  },
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-900",
    iconClassName: "text-green-600"
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-900",
    iconClassName: "text-red-600"
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-900",
    iconClassName: "text-yellow-600"
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-900",
    iconClassName: "text-blue-600"
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