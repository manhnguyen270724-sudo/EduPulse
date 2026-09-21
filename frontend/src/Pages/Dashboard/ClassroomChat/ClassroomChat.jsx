import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaVideo,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClock,
  FaInfoCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import './ClassroomChat.css';

function ClassroomChat() {
  const { ID, classroomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [classroom, setClassroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const isTeacher = user?.role === 'teacher';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Lấy thông tin lớp học
  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        const res = await fetch(`/api/classrooms/detail/${classroomId}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const result = await res.json();
          setClassroom(result.data?.classroom);
        } else {
          toast.error('Không thể truy cập lớp học này');
        }
      } catch (err) {
        console.error('Error fetching classroom:', err);
      } finally {
        setLoading(false);
      }
    };
    if (classroomId) fetchClassroomDetails();
  }, [classroomId]);

  // 2. Lấy tin nhắn và polling mỗi 3 giây
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${classroomId}/messages`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const result = await res.json();
        setMessages(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    if (classroomId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [classroomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. Gửi tin nhắn mới
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || sending) return;

    const content = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await fetch(`/api/chat/${classroomId}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (res.ok) {
        const result = await res.json();
        setMessages((prev) => [...prev, result.data]);
        scrollToBottom();
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Không thể gửi tin nhắn');
      }
    } catch (err) {
      toast.error('Lỗi kết nối khi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const is1on1 = classroom?.classType === 'one-on-one';
  const roomLink = classroom?.weeklySchedule?.[0]?.roomLink || 'https://meet.google.com/edu-vietnam-live';

  return (
    <div className="cchat-container">
      {/* Chat Topbar */}
      <div className="cchat-topbar">
        <div className="cchat-topbar-left">
          <button
            className="cchat-btn-back"
            onClick={() =>
              navigate(
                isTeacher
                  ? `/Teacher/Dashboard/${ID}/Classrooms`
                  : `/Student/Dashboard/${ID}/Classes`
              )
            }
            title="Quay lại danh sách"
          >
            <FaArrowLeft />
          </button>

          <div>
            <div className="cchat-title-row">
              <h2 className="cchat-title">{classroom?.className || 'Phòng Chat Lớp Học'}</h2>
              <span className={`cchat-badge ${is1on1 ? 'cchat-badge-1on1' : 'cchat-badge-group'}`}>
                {is1on1 ? '🎯 Lớp 1 Kèm 1' : '👥 Lớp Học Nhóm'}
              </span>
            </div>
            <div className="cchat-subtitle">
              <span>Mã lớp: <strong>{classroom?.classCode}</strong></span>
              <span> • Khóa: {classroom?.course?.subject || classroom?.course?.coursename}</span>
              {classroom?.teacher && (
                <span>
                  {' '}• Giảng viên:{' '}
                  <strong>
                    {classroom.teacher.Lastname} {classroom.teacher.Firstname}
                  </strong>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="cchat-topbar-right">
          {roomLink && (
            <a
              href={roomLink}
              target="_blank"
              rel="noreferrer"
              className="cchat-btn-meet"
              title="Vào Google Meet của lớp"
            >
              <FaVideo />
              <span>Vào Phòng Học</span>
              <FaExternalLinkAlt style={{ fontSize: '0.7rem' }} />
            </a>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="cchat-messages-area">
        {loading ? (
          <div className="cchat-loading">Đang tải tin nhắn lớp học...</div>
        ) : messages.length === 0 ? (
          <div className="cchat-empty">
            <div className="cchat-empty-icon-wrap">
              {is1on1 ? <FaUserGraduate /> : <FaUsers />}
            </div>
            <h3>
              {is1on1
                ? 'Kênh Trao Đổi 1 Kèm 1 Riêng Tư'
                : 'Phòng Chat Của Lớp Học'}
            </h3>
            <p>
              Chưa có tin nhắn nào. Hãy gửi lời chào và trao đổi bài tập hoặc giải đáp thắc mắc ngay!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = String(msg.senderId) === String(user?.id);
            const isMsgTeacher = msg.senderType === 'teacher';

            return (
              <div
                key={msg._id}
                className={`cchat-msg-row ${isMe ? 'msg-me' : 'msg-other'}`}
              >
                {!isMe && (
                  <img
                    src={
                      msg.senderAvatar ||
                      'https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924688/edupulse/teachers/teacher_nguyen_van_an.jpg'
                    }
                    alt={msg.senderName}
                    className="cchat-msg-avatar"
                  />
                )}

                <div className="cchat-bubble-wrap">
                  {!isMe && (
                    <div className="cchat-sender-info">
                      <span className="cchat-sender-name">{msg.senderName}</span>
                      {isMsgTeacher && (
                        <span className="cchat-teacher-tag">
                          <FaChalkboardTeacher /> Giảng Viên
                        </span>
                      )}
                    </div>
                  )}

                  <div className={`cchat-bubble ${isMe ? 'bubble-me' : 'bubble-other'} ${isMsgTeacher && !isMe ? 'bubble-teacher' : ''}`}>
                    <div className="cchat-msg-text">{msg.content}</div>
                    <div className="cchat-msg-time">
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="cchat-input-bar">
        <input
          type="text"
          className="cchat-input"
          placeholder={
            is1on1
              ? 'Nhắn tin trực tiếp với Giảng viên / Học viên (Enter để gửi)...'
              : 'Nhắn tin tới cả lớp (Enter để gửi)...'
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="cchat-btn-send"
          disabled={!inputText.trim() || sending}
        >
          <FaPaperPlane />
          <span>Gửi</span>
        </button>
      </form>
    </div>
  );
}

export default ClassroomChat;
