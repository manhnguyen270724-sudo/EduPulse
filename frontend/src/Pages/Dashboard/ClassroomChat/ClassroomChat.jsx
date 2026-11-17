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
  FaExternalLinkAlt,
  FaPaperclip,
  FaFileDownload,
  FaFileAlt,
  FaSpinner,
  FaTimes
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
  const [uploadingFile, setUploadingFile] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isTeacher = user?.role === 'teacher';

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Dung lượng tệp vượt quá giới hạn 20MB");
      return;
    }

    const dangerousExts = [".exe", ".bat", ".cmd", ".sh", ".js", ".msi", ".vbs", ".scr", ".com"];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (dangerousExts.includes(ext)) {
      toast.error("Loại tệp không được phép vì lý do an toàn bảo mật");
      return;
    }

    const formData = new FormData();
    formData.append("attachment", file);

    setUploadingFile(true);
    try {
      const res = await fetch(`/api/chat/${classroomId}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        setPendingAttachments((prev) => [...prev, result.data]);
        toast.success(`Đã đính kèm tệp: ${file.name}`);
      } else {
        const err = await res.json();
        toast.error(err.message || "Tải tệp lên thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi tải tệp lên");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
    if ((!inputText.trim() && pendingAttachments.length === 0) || sending) return;

    const content = inputText.trim() || (pendingAttachments.length > 0 ? `Đã gửi ${pendingAttachments.length} tệp đính kèm` : '');
    const currentAttachments = [...pendingAttachments];
    setInputText('');
    setPendingAttachments([]);
    setSending(true);

    try {
      const res = await fetch(`/api/chat/${classroomId}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          attachments: currentAttachments
        })
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
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="cchat-attachments-list mt-2 space-y-1.5">
                        {msg.attachments.map((att, aIdx) => (
                          <a
                            key={aIdx}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 p-2 bg-black/20 hover:bg-black/40 rounded-lg text-xs font-medium text-sky-300 transition-colors border border-white/10"
                          >
                            <FaFileAlt className="text-amber-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{att.name || "Tệp đính kèm"}</span>
                            <FaFileDownload className="ml-auto text-slate-300 hover:text-white shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}
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

      {/* Pending Attachments Preview */}
      {pendingAttachments.length > 0 && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium">Đính kèm:</span>
          {pendingAttachments.map((att, pIdx) => (
            <div key={pIdx} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-sky-300">
              <FaFileAlt className="text-amber-400" />
              <span className="truncate max-w-[150px]">{att.name}</span>
              <button
                type="button"
                onClick={() => setPendingAttachments(prev => prev.filter((_, i) => i !== pIdx))}
                className="text-slate-400 hover:text-rose-400 ml-1"
                title="Bỏ tệp này"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="cchat-input-bar">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingFile}
          className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 rounded-xl transition-colors disabled:opacity-50"
          title="Đính kèm tài liệu (PDF, Word, Excel, Ảnh... tối đa 20MB)"
        >
          {uploadingFile ? <FaSpinner className="animate-spin text-sky-400" /> : <FaPaperclip />}
        </button>

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
          disabled={(!inputText.trim() && pendingAttachments.length === 0) || sending}
        >
          <FaPaperPlane />
          <span>Gửi</span>
        </button>
      </form>
    </div>
  );
}

export default ClassroomChat;
