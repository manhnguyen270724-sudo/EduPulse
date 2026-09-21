import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheckDouble, FaClock, FaCommentDots, FaGraduationCap, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

function NotificationBell({ role, userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      // 1. Quét kiểm tra lịch học sắp tới
      fetch('/api/notifications/check-reminders', { method: 'POST' }).catch(() => {});

      // 2. Lấy danh sách thông báo
      const res = await fetch('/api/notifications', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const result = await res.json();
        setNotifications(result.data?.notifications || []);
        setUnreadCount(result.data?.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll mỗi 15s
    return () => clearInterval(interval);
  }, [userId]);

  // Click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, link) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (link) {
        setIsOpen(false);
        navigate(link);
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'class_reminder':
        return <FaClock className="nb-icon-reminder" />;
      case 'chat_message':
        return <FaCommentDots className="nb-icon-chat" />;
      case 'class_enrolled':
        return <FaGraduationCap className="nb-icon-enrolled" />;
      default:
        return <FaBell className="nb-icon-default" />;
    }
  };

  return (
    <div className="nb-container" ref={dropdownRef}>
      <button
        className="nb-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Thông báo"
        aria-label="Thông báo"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="nb-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="nb-dropdown">
          <div className="nb-header">
            <div className="nb-title-wrap">
              <span className="nb-title">Thông Báo</span>
              {unreadCount > 0 && (
                <span className="nb-unread-tag">{unreadCount} mới</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                className="nb-btn-mark-all"
                onClick={handleMarkAllRead}
                title="Đánh dấu tất cả đã đọc"
              >
                <FaCheckDouble />
                <span>Đã đọc tất cả</span>
              </button>
            )}
          </div>

          <div className="nb-list">
            {notifications.length === 0 ? (
              <div className="nb-empty">
                <FaBell className="nb-empty-icon" />
                <p>Bạn không có thông báo nào.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`nb-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => handleMarkAsRead(n._id, n.link)}
                >
                  <div className="nb-item-icon-wrap">{getIcon(n.type)}</div>
                  <div className="nb-item-content">
                    <div className="nb-item-title">{n.title}</div>
                    <div className="nb-item-msg">{n.message}</div>
                    <div className="nb-item-time">
                      {new Date(n.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}{' '}
                      - {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  {!n.isRead && <span className="nb-dot"></span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
