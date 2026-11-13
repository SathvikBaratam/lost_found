import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import "./styles/Notifications.css";

// Fetch & dismiss notifications via Express/MongoDB API
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchNotifications = async () => {
      try {
        const data = await apiFetch(
          `/notifications?reporterId=${auth.currentUser.uid}`
        );
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDismiss = async (notificationId) => {
    try {
      await apiFetch(`/notifications/${notificationId}`, {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notifications-container">
      {notifications.map((notif) => (
        <div key={notif.id} className="notification">
          <div className="notification-content">
            <p className="notification-message">{notif.message}</p>
            <p className="notification-detail">Claimed by: {notif.claimedBy}</p>
          </div>
          <button
            onClick={() => handleDismiss(notif.id)}
            className="notification-dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
