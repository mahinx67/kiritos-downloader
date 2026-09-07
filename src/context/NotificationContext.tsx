import React, { createContext, useContext, useState, useEffect } from "react";

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: "success" | "download" | "info" | "warning";
  timestamp: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationContextType {
  toasts: ToastItem[];
  browserNotificationsEnabled: boolean;
  permissionStatus: NotificationPermission | "unsupported";
  toggleBrowserNotifications: () => Promise<boolean>;
  notifyTaskComplete: (params: {
    title: string;
    message: string;
    type?: "success" | "download" | "info";
    actionLabel?: string;
    onAction?: () => void;
  }) => void;
  dismissToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = "kiritos_browser_notifications_enabled";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch (e) {
      return false;
    }
  });

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | "unsupported">(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "unsupported";
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const toggleBrowserNotifications = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      notifyTaskComplete({
        title: "Browser Notifications Unsupported",
        message: "Your browser does not support desktop notifications.",
        type: "warning"
      });
      return false;
    }

    if (!browserNotificationsEnabled) {
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        if (permission === "granted") {
          setBrowserNotificationsEnabled(true);
          try {
            localStorage.setItem(STORAGE_KEY, "true");
          } catch (e) {
            // ignore
          }

          notifyTaskComplete({
            title: "🔔 Browser Notifications Enabled",
            message: "You will receive desktop alerts when video enhancement or downloads finish!",
            type: "success"
          });

          // Test native notification
          try {
            new Notification("KIRITOS Notifications Active 🎉", {
              body: "You'll be alerted when video enhancement or download tasks complete.",
              icon: "https://i.ibb.co.com/QjdJGZk0/1c1c25d51409d1601e25b2cd0acd39f0.jpg"
            });
          } catch (err) {
            // ignore
          }

          return true;
        } else {
          notifyTaskComplete({
            title: "Permission Denied",
            message: "Please allow notification permissions in your browser address bar settings.",
            type: "warning"
          });
          return false;
        }
      } catch (e) {
        return false;
      }
    } else {
      setBrowserNotificationsEnabled(false);
      try {
        localStorage.setItem(STORAGE_KEY, "false");
      } catch (e) {
        // ignore
      }
      notifyTaskComplete({
        title: "Notifications Disabled",
        message: "Browser desktop alerts have been turned off.",
        type: "info"
      });
      return false;
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const notifyTaskComplete = ({
    title,
    message,
    type = "success",
    actionLabel,
    onAction
  }: {
    title: string;
    message: string;
    type?: "success" | "download" | "info" | "warning";
    actionLabel?: string;
    onAction?: () => void;
  }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast: ToastItem = {
      id,
      title,
      message,
      type,
      timestamp: Date.now(),
      actionLabel,
      onAction
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Native Browser Notification
    if (browserNotificationsEnabled && typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        const nativeNotif = new Notification(title, {
          body: message,
          icon: "https://i.ibb.co.com/QjdJGZk0/1c1c25d51409d1601e25b2cd0acd39f0.jpg"
        });
        if (onAction) {
          nativeNotif.onclick = () => {
            window.focus();
            onAction();
          };
        }
      } catch (err) {
        console.warn("Native Notification error:", err);
      }
    }

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        browserNotificationsEnabled,
        permissionStatus,
        toggleBrowserNotifications,
        notifyTaskComplete,
        dismissToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
