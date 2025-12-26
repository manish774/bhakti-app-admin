import {
  useState,
  createContext,
  useContext,
  ReactNode,
  CSSProperties,
} from "react";

// Types
type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

type ShowNotificationFunction = (
  message: string,
  type?: NotificationType
) => void;

// Create Context
const NotificationContext = createContext<ShowNotificationFunction | undefined>(
  undefined
);

// Hook to use notifications
export const useNotification = (): ShowNotificationFunction => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

// Provider Component
interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification: ShowNotificationFunction = (
    message,
    type = "info"
  ) => {
    const id = Date.now();
    const newNotification: Notification = { id, message, type };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}

      <div style={styles.notificationContainer}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="notification"
            style={{ ...styles.notification, ...styles[notif.type] }}
          >
            <span style={styles.notificationText}>{notif.message}</span>
            <button
              onClick={() => removeNotification(notif.id)}
              style={styles.closeBtn}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .notification {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

const styles: Record<string, CSSProperties> = {
  notificationContainer: {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "20rem",
    pointerEvents: "none",
  },
  notification: {
    color: "white",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    pointerEvents: "auto",
  },
  success: {
    backgroundColor: "#d4c4a8",
  },
  error: {
    backgroundColor: "#c47a6a",
  },
  warning: {
    backgroundColor: "#d6a65a",
  },
  info: {
    backgroundColor: "#8fa3a6",
  },
  notificationText: {
    flex: 1,
  },
  closeBtn: {
    marginLeft: "0.75rem",
    color: "white",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
  },
};
