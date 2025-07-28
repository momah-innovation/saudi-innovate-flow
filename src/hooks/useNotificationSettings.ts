import { useSettings } from '@/contexts/SettingsContext';

export const useNotificationSettings = () => {
  const { 
    emailNotifications,
    systemNotifications,
    mobileNotifications,
    notifyOnNewSubmission,
    notifyOnStatusChange,
    notifyOnDeadline,
    notifyOnEvaluation,
    reminderDaysBefore,
    reminderFrequency,
    newSubmissionTemplate,
    statusChangeTemplate,
    notificationFetchLimit
  } = useSettings();
  
  return {
    channels: {
      email: emailNotifications,
      system: systemNotifications,
      mobile: mobileNotifications,
    },
    events: {
      newSubmission: notifyOnNewSubmission,
      statusChange: notifyOnStatusChange,
      deadline: notifyOnDeadline,
      evaluation: notifyOnEvaluation,
    },
    reminders: {
      daysBefore: reminderDaysBefore,
      frequency: reminderFrequency,
    },
    templates: {
      newSubmission: newSubmissionTemplate,
      statusChange: statusChangeTemplate,
    },
    limits: {
      fetchLimit: notificationFetchLimit,
    }
  };
};