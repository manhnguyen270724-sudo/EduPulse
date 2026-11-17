import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaGraduationCap,
  FaExclamationTriangle,
  FaUsers,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
  FaPlayCircle,
  FaSearch,
  FaEnvelope,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaBan,
  FaUnlock,
  FaUserShield,
  FaSpinner,
  FaExternalLinkAlt,
  FaStar,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaShieldAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import "./Admin.css";

const Admin = () => {
  const { data } = useParams();
  const navigate = useNavigate();
  const { user: authUser, logoutUser } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState("revenue"); // revenue | completion | courseRequests | badReviews | users | legacyApprovals | messages

  // Dark / Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("edupulse-theme", nextTheme);
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    if (logoutUser) {
      await logoutUser();
    }
    navigate("/adminLogin");
  };

  // ── 1. REVENUE STATE ──
  const [revenueData, setRevenueData] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [txnCode, setTxnCode] = useState("");
  const [payoutFeedback, setPayoutFeedback] = useState("");

  // ── 2. COURSE COMPLETION STATE ──
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loadingCompletion, setLoadingCompletion] = useState(false);
  const [approvingCourseId, setApprovingCourseId] = useState(null);
  const [feedbackModalCourse, setFeedbackModalCourse] = useState(null);
  const [courseFeedbacks, setCourseFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  // ── 2b. NEW COURSE REQUESTS (DUYỆT YÊU CẦU MỞ KHÓA HỌC MỚI) ──
  const [courseRequests, setCourseRequests] = useState([]);
  const [loadingCourseRequests, setLoadingCourseRequests] = useState(false);
  const [processingCourseId, setProcessingCourseId] = useState(null);

  const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const formatDay = (d) => daysOfWeek[d] || `Thứ ${d}`;
  const formatTime = (time) => {
    if (time === undefined || time === null) return "--:--";
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // ── 3. BAD REVIEWS & SUSPEND STATE ──
  const [badReviews, setBadReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedCourseToSuspend, setSelectedCourseToSuspend] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");

  // ── 4. USERS MANAGEMENT STATE ──
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [statusModalUser, setStatusModalUser] = useState(null);
  const [newStatusChoice, setNewStatusChoice] = useState("banned");
  const [statusReason, setStatusReason] = useState("");

  // ── 5. LEGACY DOCUMENT APPROVALS & MESSAGES ──
  const [studentData, setStudentData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [adminID, setAdminID] = useState(null);
  const [allmsg, setAllMsg] = useState([]);
  const [msgOpen, setMsgOpen] = useState(false);

  // ==========================================
  // FETCHERS
  // ==========================================

  // Fetch Revenue Overview & Withdrawals
  const fetchRevenue = async () => {
    setLoadingRevenue(true);
    try {
      const [resRev, resWith] = await Promise.all([
        fetch("/api/admin/revenue/overview", { credentials: "include" }),
        fetch("/api/admin/withdrawals/all", { credentials: "include" }),
      ]);
      if (resRev.ok) {
        const d = await resRev.json();
        setRevenueData(d.data);
      }
      if (resWith.ok) {
        const w = await resWith.json();
        setWithdrawals(w.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu tài chính");
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Fetch Pending Course Completions
  const fetchCompletionPending = async () => {
    setLoadingCompletion(true);
    try {
      const res = await fetch("/api/admin/course-completion/pending", {
        credentials: "include",
      });
      if (res.ok) {
        const d = await res.json();
        setPendingCourses(d.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách khóa học chờ nghiệm thu");
    } finally {
      setLoadingCompletion(false);
    }
  };

  // Fetch Course Requests (Khóa học mới do GV tạo chờ duyệt)
  const fetchCourseRequests = async () => {
    setLoadingCourseRequests(true);
    try {
      const res = await fetch("/api/admin/approve/course", {
        credentials: "include",
      });
      if (res.ok) {
        const d = await res.json();
        setCourseRequests(d.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách khóa học chờ phê duyệt");
    } finally {
      setLoadingCourseRequests(false);
    }
  };

  // Fetch Bad Reviews & Alerts
  const fetchBadReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch("/api/admin/reviews/bad-alerts", {
        credentials: "include",
      });
      if (res.ok) {
        const d = await res.json();
        setBadReviews(d.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách đánh giá cảnh báo");
    } finally {
      setLoadingReviews(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(
        `/api/admin/users/all?role=${userRoleFilter}&status=${userStatusFilter}&search=${encodeURIComponent(
          userSearch
        )}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const d = await res.json();
        setUsersList(d.data?.users || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Legacy Approvals & Contact Messages
  const fetchLegacy = async () => {
    try {
      const [resAppr, resMsg] = await Promise.all([
        fetch(`/api/admin/${data}/approve`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("/api/admin/messages/all", { credentials: "include" }),
      ]);
      if (resAppr.ok) {
        const r = await resAppr.json();
        setStudentData(r.data?.studentsforApproval || []);
        setTeacherData(r.data?.teachersforApproval || []);
        setAdminID(r.data?.admin?._id);
      }
      if (resMsg.ok) {
        const m = await resMsg.json();
        setAllMsg(m.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRevenue();
    fetchCompletionPending();
    fetchCourseRequests();
    fetchBadReviews();
    fetchUsers();
    fetchLegacy();
  }, [data]);

  // Refetch when switching to courseRequests tab
  useEffect(() => {
    if (activeTab === "courseRequests") {
      fetchCourseRequests();
    }
  }, [activeTab]);

  // Refetch users on filter changes
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [userRoleFilter, userStatusFilter]);

  // ==========================================
  // HANDLERS
  // ==========================================

  // Duyệt hoặc từ chối giải ngân lệnh rút tiền
  const handleProcessWithdrawal = async (status) => {
    if (!selectedWithdrawal) return;
    try {
      const res = await fetch(
        `/api/admin/withdrawals/${selectedWithdrawal._id}/process`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            transactionCode: txnCode,
            adminFeedback: payoutFeedback,
          }),
        }
      );
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Xử lý thất bại");
      toast.success(
        status === "completed"
          ? "Đã xác nhận giải ngân thành công!"
          : "Đã từ chối lệnh rút tiền!"
      );
      setPayoutModalOpen(false);
      setSelectedWithdrawal(null);
      setTxnCode("");
      setPayoutFeedback("");
      fetchRevenue();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Duyệt nghiệm thu khóa học đã hoàn thành -> Mở khóa tiền cho GV rút hoặc Từ chối
  const handleApproveCompletion = async (courseId, action = "approve") => {
    const adminNote = window.prompt(
      action === "approve"
        ? "Nhập ghi chú phê duyệt nghiệm thu (tùy chọn):"
        : "Nhập lý do từ chối nghiệm thu hoàn thành khóa học (bắt buộc):"
    );
    if (adminNote === null) return;
    if (action === "reject" && !adminNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối nghiệm thu khóa học!");
      return;
    }

    setApprovingCourseId(courseId);
    try {
      const res = await fetch(
        `/api/admin/course-completion/${courseId}/approve`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            adminNote: adminNote.trim() || (action === "approve" ? "Đạt tiêu chuẩn nghiệm thu hoàn thành" : "")
          })
        }
      );
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Xử lý nghiệm thu thất bại");
      toast.success(action === "approve" ? "Đã phê duyệt nghiệm thu khóa học thành công!" : "Đã từ chối nghiệm thu khóa học!");
      fetchCompletionPending();
      fetchRevenue();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setApprovingCourseId(null);
    }
  };

  // Xem chi tiết phản hồi học viên của khóa học
  const handleViewFeedbacks = async (c) => {
    setFeedbackModalCourse(c);
    setLoadingFeedbacks(true);
    try {
      const res = await fetch(`/api/course/${c._id}/completion-stats`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setCourseFeedbacks(data.data?.feedbacks || []);
      } else {
        toast.error("Không thể tải danh sách phản hồi của khóa học");
      }
    } catch (e) {
      toast.error("Lỗi khi tải chi tiết phản hồi học viên");
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  // Xóa tin nhắn hỗ trợ
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin nhắn liên hệ này không?")) return;
    try {
      const res = await fetch(`/api/admin/message/${msgId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Đã xóa tin nhắn thành công!");
        setAllMsg((prev) => prev.filter((m) => m._id !== msgId));
      } else {
        toast.error("Xóa tin nhắn thất bại");
      }
    } catch (e) {
      toast.error("Lỗi kết nối khi xóa tin nhắn");
    }
  };

  // Phản hồi tin nhắn hỗ trợ qua email
  const handleReplyMessage = async (msg) => {
    const replyContent = window.prompt(`Nhập nội dung email phản hồi gửi tới ${msg.email}:`);
    if (!replyContent || !replyContent.trim()) return;

    try {
      const res = await fetch(`/api/admin/message/${msg._id}/reply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replyContent: replyContent.trim(),
          email: msg.email,
          name: msg.name
        })
      });
      if (res.ok) {
        toast.success("Đã gửi email phản hồi thành công!");
        setAllMsg((prev) => prev.map((m) => (m._id === msg._id ? { ...m, status: true } : m)));
      } else {
        toast.error("Gửi phản hồi thất bại");
      }
    } catch (e) {
      toast.error("Lỗi kết nối khi gửi phản hồi");
    }
  };

  // Phê duyệt hoặc từ chối tạo khóa học mới của giảng viên
  const handleApproveNewCourse = async (courseId, teacherInfo, isApproved) => {
    setProcessingCourseId(courseId);
    try {
      const res = await fetch(`/api/admin/approve/course/${courseId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Isapproved: isApproved,
          email: teacherInfo?.Email,
          Firstname: teacherInfo?.Firstname,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          isApproved
            ? "Đã phê duyệt khóa học thành công! Khóa học đã mở tuyển sinh."
            : "Đã từ chối khóa học!"
        );
        setCourseRequests((prev) => prev.filter((c) => c._id !== courseId));
      } else {
        toast.error(data.message || "Xử lý thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setProcessingCourseId(null);
    }
  };

  // Tạm dừng khóa học & Gửi email cảnh báo
  const handleSuspendCourse = async () => {
    if (!selectedCourseToSuspend) return;
    if (!suspendReason.trim()) {
      toast.error("Vui lòng nhập lý do cụ thể khi tạm dừng khóa học!");
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/courses/${selectedCourseToSuspend._id}/suspend-warning`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: suspendReason.trim(),
            action: "suspend",
          }),
        }
      );
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Thao tác thất bại");
      toast.success(
        "Đã tạm dừng khóa học và gửi email cảnh báo tới giảng viên!"
      );
      setSuspendModalOpen(false);
      setSelectedCourseToSuspend(null);
      setSuspendReason("");
      fetchBadReviews();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Khôi phục khóa học đang bị tạm dừng
  const handleResumeCourse = async (courseId) => {
    if (
      !window.confirm(
        "Khôi phục khóa học này trở lại trạng thái Hoạt động bình thường?"
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/suspend-warning`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: "Đã khắc phục chất lượng",
            action: "resume",
          }),
        }
      );
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Thao tác thất bại");
      toast.success("Đã khôi phục khóa học thành công!");
      fetchBadReviews();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Ban / Unban / Suspended User
  const handleToggleUserStatus = async () => {
    if (!statusModalUser) return;
    if ((newStatusChoice === 'suspended' || newStatusChoice === 'banned') && !statusReason.trim()) {
      toast.error("Vui lòng nhập lý do cụ thể khi tạm khóa hoặc cấm tài khoản người dùng!");
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/users/${statusModalUser.role}/${statusModalUser._id}/status`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatusChoice,
            reason: statusReason.trim(),
          }),
        }
      );
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Cập nhật thất bại");
      toast.success("Cập nhật trạng thái người dùng thành công!");
      setStatusModalUser(null);
      setStatusReason("");
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Duyệt hồ sơ học viên / giảng viên cũ
  const handleLegacyApprove = async (id, type, approve, email) => {
    try {
      const res = await fetch(`/api/admin/${data}/approve/${type}/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Isapproved: approve,
          email,
        }),
      });
      if (res.ok) {
        toast.success(
          approve ? "Đã duyệt hồ sơ thành công" : "Đã từ chối hồ sơ"
        );
        fetchLegacy();
      }
    } catch (err) {
      toast.error("Xử lý hồ sơ thất bại");
    }
  };

  // Counts for Badges
  const pendingWithdrawalCount =
    revenueData?.summary?.pendingWithdrawalCount || 0;
  const pendingCompletionCount = pendingCourses.length || 0;
  const badReviewCount = badReviews.length || 0;
  const pendingDocCount =
    (studentData?.filter((s) => s.Isapproved === "pending")?.length || 0) +
    (teacherData?.filter((t) => t.Isapproved === "pending")?.length || 0);

  return (
    <div className="ap-shell">
      {/* ─── TOPBAR ─── */}
      <header className="ap-topbar">
        <div className="ap-brand-group">
          <NavLink to="/" className="ap-brand-link" title="Về trang chủ EduPulse">
            <img
              src="https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924695/edupulse/branding/edupulse_logo.jpg"
              alt="EduPulse Logo"
              className="ap-brand-logo"
            />
            <span className="ap-brand-text">EduPulse</span>
          </NavLink>
          <span className="ap-portal-badge">Cổng Quản Trị Hệ Thống</span>
        </div>

        <div className="ap-topbar-right">
          {/* Notifications / Messages Button */}
          <div className="relative">
            <button
              onClick={() => setMsgOpen(!msgOpen)}
              className="ap-notif-btn"
              title="Hộp thư liên hệ người dùng"
            >
              <IoIosNotificationsOutline size={22} />
              {allmsg.length > 0 && (
                <span className="ap-notif-badge">{allmsg.length}</span>
              )}
            </button>

            {/* Dropdown Popup */}
            {msgOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3 mb-3">
                  <h4 className="font-bold text-sm text-[var(--text-main)]">
                    Tin nhắn liên hệ mới
                  </h4>
                  <span className="text-xs text-[var(--text-muted)]">
                    {allmsg.length} tin nhắn
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {allmsg.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] text-center py-4">
                      Không có tin nhắn nào
                    </p>
                  ) : (
                    allmsg.map((msg, idx) => (
                      <div
                        key={idx}
                        className="bg-[var(--bg-surface-secondary)] p-3 rounded-xl border border-[var(--card-border)] text-xs"
                      >
                        <div className="font-semibold text-[var(--primary)]">
                          {msg.name}
                        </div>
                        <div className="text-[var(--text-muted)]">{msg.email}</div>
                        <div className="text-[var(--text-main)] mt-1 italic">
                          "{msg.message}"
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            className="ap-theme-btn"
            onClick={toggleTheme}
            title={
              isDarkMode
                ? "Chuyển sang chế độ Sáng"
                : "Chuyển sang chế độ Tối"
            }
          >
            {isDarkMode ? (
              <FaSun className="text-amber-400" />
            ) : (
              <FaMoon className="text-slate-600" />
            )}
          </button>

          {/* Admin Pill */}
          <div className="ap-admin-pill">
            <div className="ap-admin-pill-badge">
              <FaShieldAlt />
            </div>
            <span className="ap-admin-pill-name">Admin Hệ Thống</span>
          </div>

          {/* Logout Button */}
          <button
            className="ap-btn-logout"
            onClick={handleLogout}
            title="Đăng xuất khỏi Cổng Quản Trị"
          >
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* ─── BODY (SIDEBAR + MAIN) ─── */}
      <div className="ap-body">
        {/* Left Sidebar */}
        <aside className="ap-sidebar">
          {/* Profile Card */}
          <div className="ap-sidebar-profile">
            <div className="ap-sidebar-avatar-frame">
              <div className="ap-sidebar-avatar">
                <FaShieldAlt />
              </div>
            </div>
            <h3 className="ap-sidebar-name">Quản Trị Viên</h3>
            <span className="ap-sidebar-tag">Super Administrator</span>
          </div>

          {/* Navigation Menu */}
          <nav className="ap-sidebar-menu">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`ap-menu-item ${activeTab === "revenue" ? "active" : ""}`}
            >
              <div className="ap-menu-item-content">
                <FaChartLine className="ap-menu-icon" />
                <span>Doanh Thu & Rút Tiền</span>
              </div>
              {pendingWithdrawalCount > 0 && (
                <span className="ap-menu-count-badge">
                  {pendingWithdrawalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("completion")}
              className={`ap-menu-item ${
                activeTab === "completion" ? "active" : ""
              }`}
            >
              <div className="ap-menu-item-content">
                <FaGraduationCap className="ap-menu-icon" />
                <span>Nghiệm Thu Khóa Học</span>
              </div>
              {pendingCompletionCount > 0 && (
                <span className="ap-menu-count-badge">
                  {pendingCompletionCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("courseRequests")}
              className={`ap-menu-item ${
                activeTab === "courseRequests" ? "active" : ""
              }`}
            >
              <div className="ap-menu-item-content">
                <FaBook className="ap-menu-icon" />
                <span>Duyệt Khóa Học Mới</span>
              </div>
              {courseRequests.length > 0 && (
                <span className="ap-menu-count-badge">
                  {courseRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("badReviews")}
              className={`ap-menu-item ${
                activeTab === "badReviews" ? "active" : ""
              }`}
            >
              <div className="ap-menu-item-content">
                <FaExclamationTriangle className="ap-menu-icon" />
                <span>Đánh Giá & Cảnh Báo</span>
              </div>
              {badReviewCount > 0 && (
                <span className="ap-menu-count-badge">{badReviewCount}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`ap-menu-item ${activeTab === "users" ? "active" : ""}`}
            >
              <div className="ap-menu-item-content">
                <FaUsers className="ap-menu-icon" />
                <span>Quản Lý Người Dùng</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("legacyApprovals")}
              className={`ap-menu-item ${
                activeTab === "legacyApprovals" ? "active" : ""
              }`}
            >
              <div className="ap-menu-item-content">
                <FaFileAlt className="ap-menu-icon" />
                <span>Xét Duyệt Hồ Sơ</span>
              </div>
              {pendingDocCount > 0 && (
                <span className="ap-menu-count-badge">{pendingDocCount}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`ap-menu-item ${
                activeTab === "messages" ? "active" : ""
              }`}
            >
              <div className="ap-menu-item-content">
                <FaEnvelope className="ap-menu-icon" />
                <span>Hộp Thư Liên Hệ</span>
              </div>
              {allmsg.length > 0 && (
                <span className="ap-menu-count-badge">{allmsg.length}</span>
              )}
            </button>
          </nav>

          {/* Sidebar Footer: System Status Card */}
          <div className="ap-sidebar-footer">
            <div className="ap-system-card">
              <div className="ap-system-header">
                <span>⚡ Trạng Thái Nền Tảng</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="ap-system-hint">
                Máy chủ: <strong>Hoạt động tốt</strong>
                <br />
                Cơ sở dữ liệu: <strong>MongoDB Atlas</strong>
                <br />
                Phiên bản: <strong>EduPulse v1.0.0</strong>
              </p>
            </div>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="ap-main-viewport">
          {/* =================================================================== */}
          {/* TAB 1: DOANH THU & GIẢI NGÂN RÚT TIỀN */}
          {/* =================================================================== */}
          {activeTab === "revenue" && (
            <div>
              <div className="ap-view-header">
                <div>
                  <h1 className="ap-view-title">Doanh Thu & Tài Chính Nền Tảng</h1>
                  <p className="ap-view-subtitle">
                    Theo dõi đối soát học phí, phí sàn 15% và xét duyệt lệnh rút
                    tiền của giảng viên
                  </p>
                </div>
                <button
                  onClick={fetchRevenue}
                  className="ap-btn-secondary"
                  disabled={loadingRevenue}
                >
                  {loadingRevenue ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaExchangeAlt />
                  )}
                  <span>Làm Mới</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="ap-stats-grid">
                <div className="ap-stat-card">
                  <div
                    className="ap-stat-icon-wrapper"
                    style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}
                  >
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <div className="ap-stat-value">
                      {(revenueData?.summary?.platformRevenue || 0).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </div>
                    <div className="ap-stat-label">Doanh Thu Sàn (15%)</div>
                  </div>
                </div>

                <div className="ap-stat-card">
                  <div
                    className="ap-stat-icon-wrapper"
                    style={{ background: "rgba(2, 132, 199, 0.12)", color: "#0284c7" }}
                  >
                    <FaChartLine />
                  </div>
                  <div>
                    <div className="ap-stat-value">
                      {(revenueData?.summary?.totalTuitionVolume || 0).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </div>
                    <div className="ap-stat-label">Tổng Học Phí Thu Vào</div>
                  </div>
                </div>

                <div className="ap-stat-card">
                  <div
                    className="ap-stat-icon-wrapper"
                    style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}
                  >
                    <FaExchangeAlt />
                  </div>
                  <div>
                    <div className="ap-stat-value">
                      {(revenueData?.summary?.pendingWithdrawalAmount || 0).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </div>
                    <div className="ap-stat-label">Chờ Giải Ngân Rút Tiền</div>
                  </div>
                </div>

                <div className="ap-stat-card">
                  <div
                    className="ap-stat-icon-wrapper"
                    style={{ background: "rgba(99, 102, 241, 0.12)", color: "#6366f1" }}
                  >
                    <FaFileAlt />
                  </div>
                  <div>
                    <div className="ap-stat-value">
                      {revenueData?.summary?.pendingWithdrawalCount || 0} lệnh
                    </div>
                    <div className="ap-stat-label">Lệnh Rút Đang Chờ Duyệt</div>
                  </div>
                </div>
              </div>

              {/* Withdrawals Table */}
              <div className="ap-content-card">
                <div className="ap-card-header">
                  <h3 className="ap-card-title">
                    <FaExchangeAlt className="text-amber-500" />
                    Danh Sách Yêu Cầu Rút Tiền Của Giảng Viên
                  </h3>
                </div>

                {withdrawals.length === 0 ? (
                  <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                    Hiện chưa có lệnh rút tiền nào cần xử lý.
                  </div>
                ) : (
                  <div className="ap-table-container">
                    <table className="ap-table">
                      <thead>
                        <tr>
                          <th>Giảng Viên</th>
                          <th>Số Tiền Yêu Cầu</th>
                          <th>Tài Khoản Thụ Hưởng</th>
                          <th>Ngày Yêu Cầu</th>
                          <th>Trạng Thái</th>
                          <th>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawals.map((w) => (
                          <tr key={w._id}>
                            <td>
                              <div className="font-bold text-[var(--text-main)]">
                                {w.teacherId?.Firstname} {w.teacherId?.Lastname}
                              </div>
                              <div className="text-xs text-[var(--text-muted)]">
                                {w.teacherId?.Email}
                              </div>
                            </td>
                            <td>
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                {w.amount?.toLocaleString("vi-VN")}đ
                              </span>
                            </td>
                            <td>
                              <div className="font-semibold text-xs text-[var(--text-main)]">
                                {w.bankInfo?.bankName} - {w.bankInfo?.accountNumber}
                              </div>
                              <div className="text-[11px] text-[var(--text-muted)] uppercase">
                                {w.bankInfo?.accountHolderName}
                              </div>
                            </td>
                            <td className="text-xs text-[var(--text-muted)]">
                              {new Date(w.createdAt).toLocaleString("vi-VN")}
                            </td>
                            <td>
                              {w.status === "pending" && (
                                <span className="ap-badge ap-badge-warning">
                                  Chờ duyệt
                                </span>
                              )}
                              {w.status === "completed" && (
                                <span className="ap-badge ap-badge-success">
                                  Đã giải ngân
                                </span>
                              )}
                              {w.status === "rejected" && (
                                <span className="ap-badge ap-badge-error">
                                  Đã từ chối
                                </span>
                              )}
                            </td>
                            <td>
                              {w.status === "pending" ? (
                                <button
                                  onClick={() => {
                                    setSelectedWithdrawal(w);
                                    setPayoutModalOpen(true);
                                  }}
                                  className="ap-btn-primary"
                                  style={{ padding: "6px 14px", fontSize: "0.78rem" }}
                                >
                                  Xử Lý Giải Ngân
                                </button>
                              ) : (
                                <span className="text-xs text-[var(--text-muted)] italic">
                                  Mã: {w.transactionCode || "N/A"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: NGHIỆM THU KHÓA HỌC HOÀN THÀNH */}
          {/* =================================================================== */}
          {activeTab === "completion" && (
            <div>
              <div className="ap-view-header">
                <div>
                  <h1 className="ap-view-title">Nghiệm Thu Khóa Học Hoàn Thành</h1>
                  <p className="ap-view-subtitle">
                    Kiểm tra xác nhận hoàn thành từ học sinh và phê duyệt mở khóa
                    học phí cho giảng viên
                  </p>
                </div>
                <button
                  onClick={fetchCompletionPending}
                  className="ap-btn-secondary"
                  disabled={loadingCompletion}
                >
                  {loadingCompletion ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaExchangeAlt />
                  )}
                  <span>Làm Mới</span>
                </button>
              </div>

              <div className="ap-content-card">
                <div className="ap-card-header">
                  <h3 className="ap-card-title">
                    <FaGraduationCap className="text-sky-500" />
                    Khóa Học Đã Dạy Xong - Chờ Admin Phê Duyệt Giải Ngân
                  </h3>
                </div>

                {pendingCourses.length === 0 ? (
                  <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                    Hiện không có khóa học nào đang chờ nghiệm thu.
                  </div>
                ) : (
                  <div className="ap-table-container">
                    <table className="ap-table">
                      <thead>
                        <tr>
                          <th>Khóa Học</th>
                          <th>Giảng Viên</th>
                          <th>Tỷ Lệ Hoàn Thành</th>
                          <th>Số Tiền Ký Quỹ</th>
                          <th>Đánh Giá & Nhận Xét</th>
                          <th>Thao Tác Xử Lý</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingCourses.map((c) => {
                          const rate = c.stats?.completionRate ?? (c.completionRate ?? 100);
                          const total = c.stats?.totalEnrolled ?? (c.enrolledStudent?.length ?? 1);
                          const confirmed = c.stats?.confirmedFeedbackCount ?? (c.confirmedCount ?? total);
                          const isEligible = c.stats?.canApprove ?? (rate >= (total < 3 ? 100 : 80));

                          return (
                            <tr key={c._id}>
                              <td>
                                <div className="font-bold text-[var(--text-main)]">
                                  {c.courseName || c.coursename || c.subject}
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">
                                  ID: {c._id}
                                </div>
                              </td>
                              <td>
                                <div className="font-medium text-[var(--text-main)]">
                                  {c.teacherId?.Firstname || c.enrolledteacher?.Firstname} {c.teacherId?.Lastname || c.enrolledteacher?.Lastname}
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">
                                  {c.teacherId?.Email || c.enrolledteacher?.Email}
                                </div>
                              </td>
                              <td>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold text-xs ${isEligible ? 'text-emerald-500' : 'text-amber-500'}`}>
                                      {rate}% ({confirmed}/{total} HV)
                                    </span>
                                  </div>
                                  <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                      style={{ width: `${Math.min(100, rate)}%` }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleViewFeedbacks(c)}
                                    className="text-[11px] text-sky-400 hover:underline block pt-0.5"
                                  >
                                    Xem phản hồi học viên
                                  </button>
                                </div>
                              </td>
                              <td>
                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                  {(c.price || c.fees || 0).toLocaleString("vi-VN")}đ
                                </span>
                              </td>
                              <td>
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                  <FaStar />
                                  <span>{c.studentRating || c.ratingStats?.averageRating || 5}/5 sao</span>
                                </div>
                                <div className="text-xs text-[var(--text-muted)] italic max-w-xs truncate">
                                  "{c.studentFeedback || "Đã học đủ các buổi và hài lòng"}"
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApproveCompletion(c._id, "approve")}
                                    disabled={approvingCourseId === c._id}
                                    className="ap-btn-primary"
                                    style={{ padding: "6px 12px", fontSize: "0.78rem" }}
                                    title="Phê duyệt nghiệm thu và mở khóa rút tiền"
                                  >
                                    {approvingCourseId === c._id ? (
                                      <FaSpinner className="animate-spin mr-1" />
                                    ) : (
                                      <FaCheckCircle className="mr-1" />
                                    )}
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => handleApproveCompletion(c._id, "reject")}
                                    disabled={approvingCourseId === c._id}
                                    className="ap-btn-secondary text-rose-500 hover:bg-rose-500/10"
                                    style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                                    title="Từ chối nghiệm thu hoàn thành"
                                  >
                                    <FaTimesCircle className="mr-1" />
                                    Từ Chối
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2B: DUYỆT KHÓA HỌC MỚI (NEW COURSE REQUESTS) */}
          {/* =================================================================== */}
          {activeTab === "courseRequests" && (
            <div>
              <div className="ap-view-header">
                <div>
                  <h1 className="ap-view-title">Yêu Cầu Phê Duyệt Khóa Học Mới</h1>
                  <p className="ap-view-subtitle">
                    Xem xét lịch trình, nội dung và phê duyệt các khóa học do giảng viên tạo trước khi mở tuyển sinh công khai
                  </p>
                </div>
                <button
                  onClick={fetchCourseRequests}
                  className="ap-btn-secondary"
                  disabled={loadingCourseRequests}
                >
                  {loadingCourseRequests ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaExchangeAlt />
                  )}
                  <span>Làm Mới</span>
                </button>
              </div>

              <div className="ap-content-card">
                <div className="ap-card-header">
                  <h3 className="ap-card-title">
                    <FaBook className="text-sky-500" />
                    Khóa Học Đang Chờ Phê Duyệt ({courseRequests.length})
                  </h3>
                </div>

                {loadingCourseRequests ? (
                  <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                    <FaSpinner className="animate-spin inline mr-2 text-primary" /> Đang tải danh sách khóa học...
                  </div>
                ) : courseRequests.length === 0 ? (
                  <div className="text-center py-14 text-[var(--text-muted)] text-sm">
                    <FaCheckCircle className="text-4xl text-emerald-500 mx-auto mb-3" />
                    <p className="font-semibold text-base text-[var(--text-main)]">Không có yêu cầu mở khóa học nào đang chờ</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Tất cả các khóa học do giảng viên gửi lên đã được xem xét và xử lý.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courseRequests.map((req) => (
                      <div
                        key={req._id}
                        className="p-5 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--card-border)] flex flex-col justify-between"
                        style={{ boxShadow: "var(--card-shadow)" }}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-bold text-base text-[var(--text-main)]">
                              {req.subject || req.coursename}
                            </h3>
                            <span className="ap-badge ap-badge-warning">Chờ duyệt</span>
                          </div>

                          <p className="text-xs text-[var(--text-muted)] line-clamp-3 mb-4 leading-relaxed">
                            {req.description}
                          </p>

                          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--card-border)] mb-4 text-xs space-y-2.5">
                            <div className="flex items-center gap-2">
                              <FaChalkboardTeacher className="text-sky-500" />
                              <span className="text-[var(--text-muted)]">Giảng viên:</span>
                              <strong className="text-[var(--text-main)]">
                                {req.enrolledteacher?.Firstname} {req.enrolledteacher?.Lastname}
                              </strong>
                            </div>

                            {req.enrolledteacher?.Email && (
                              <div className="text-[11px] text-[var(--text-muted)] pl-6">
                                {req.enrolledteacher.Email}
                              </div>
                            )}

                            {req.educationLevel && (
                              <div className="text-[11px] text-[var(--text-muted)]">
                                Phân loại: <strong className="text-[var(--text-main)]">{req.educationLevel}</strong> {req.grade ? `· Lớp ${req.grade}` : ''}
                              </div>
                            )}

                            <div className="space-y-1 pt-2 border-t border-[var(--card-border)]">
                              <div className="flex items-center gap-1 font-semibold text-[var(--text-muted)]">
                                <FaCalendarAlt /> Lịch học trong tuần:
                              </div>
                              {req.schedule && req.schedule.length > 0 ? (
                                req.schedule.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-[11px] text-[var(--text-main)] pl-4">
                                    <span>{formatDay(item.day)}</span>
                                    <span className="font-mono text-sky-500 font-semibold">
                                      {formatTime(item.starttime)} - {formatTime(item.endtime)}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-[11px] text-[var(--text-muted)] pl-4 italic">Chưa cài đặt lịch học</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-[var(--card-border)]">
                          <button
                            onClick={() => handleApproveNewCourse(req._id, req.enrolledteacher, true)}
                            disabled={processingCourseId === req._id}
                            className="ap-btn-primary flex-1 justify-center"
                            style={{ padding: "8px 12px", fontSize: "0.82rem" }}
                          >
                            {processingCourseId === req._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <>
                                <FaCheckCircle /> Phê Duyệt
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleApproveNewCourse(req._id, req.enrolledteacher, false)}
                            disabled={processingCourseId === req._id}
                            className="ap-btn-secondary flex-1 justify-center text-rose-500 hover:bg-rose-500/10"
                            style={{ padding: "8px 12px", fontSize: "0.82rem" }}
                          >
                            {processingCourseId === req._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <>
                                <FaTimesCircle /> Từ Chối
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: ĐÁNH GIÁ TIÊU CỰC & CẢNH BÁO */}
          {/* =================================================================== */}
          {activeTab === "badReviews" && (
            <div>
              <div className="ap-view-header">
                <div>
                  <h1 className="ap-view-title">Đánh Giá Tiêu Cực & Cảnh Báo</h1>
                  <p className="ap-view-subtitle">
                    Giám sát chất lượng giảng dạy, can thiệp khi có phản hồi xấu hoặc
                    tạm dừng khóa học
                  </p>
                </div>
                <button
                  onClick={fetchBadReviews}
                  className="ap-btn-secondary"
                  disabled={loadingReviews}
                >
                  {loadingReviews ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaExchangeAlt />
                  )}
                  <span>Làm Mới</span>
                </button>
              </div>

              <div className="ap-content-card">
                <div className="ap-card-header">
                  <h3 className="ap-card-title">
                    <FaExclamationTriangle className="text-rose-500" />
                    Cảnh Báo Đánh Giá Thấp (Dưới 3 Sao)
                  </h3>
                </div>

                {badReviews.length === 0 ? (
                  <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                    Tuyệt vời! Không có khóa học nào có phản hồi tiêu cực cần xử
                    lý.
                  </div>
                ) : (
                  <div className="ap-table-container">
                    <table className="ap-table">
                      <thead>
                        <tr>
                          <th>Khóa Học</th>
                          <th>Giảng Viên</th>
                          <th>Học Viên Đánh Giá</th>
                          <th>Điểm & Nhận Xét</th>
                          <th>Trạng Thái</th>
                          <th>Thao Tác Xử Lý</th>
                        </tr>
                      </thead>
                      <tbody>
                        {badReviews.map((r) => (
                          <tr key={r._id}>
                            <td>
                              <div className="font-bold text-[var(--text-main)]">
                                {r.courseId?.courseName}
                              </div>
                            </td>
                            <td>
                              <div className="font-semibold text-xs text-[var(--text-main)]">
                                {r.teacherId?.Firstname} {r.teacherId?.Lastname}
                              </div>
                              <div className="text-xs text-[var(--text-muted)]">
                                {r.teacherId?.Email}
                              </div>
                            </td>
                            <td>
                              <div className="font-semibold text-xs text-[var(--text-main)]">
                                {r.studentId?.Firstname} {r.studentId?.Lastname}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-1 text-rose-500 font-bold text-xs mb-1">
                                <FaStar />
                                <span>{r.rating}/5 sao</span>
                              </div>
                              <div className="text-xs text-[var(--text-main)] max-w-sm">
                                "{r.comment || r.feedback}"
                              </div>
                            </td>
                            <td>
                              {r.courseId?.isSuspended ? (
                                <span className="ap-badge ap-badge-error">
                                  Đang Tạm Dừng
                                </span>
                              ) : (
                                <span className="ap-badge ap-badge-warning">
                                  Cần Chú Ý
                                </span>
                              )}
                            </td>
                            <td>
                              {r.courseId?.isSuspended ? (
                                <button
                                  onClick={() => handleResumeCourse(r.courseId?._id)}
                                  className="ap-btn-secondary"
                                  style={{ padding: "6px 12px", fontSize: "0.78rem" }}
                                >
                                  <FaPlayCircle className="text-emerald-500 mr-1" />
                                  Khôi Phục
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedCourseToSuspend(r.courseId);
                                    setSuspendModalOpen(true);
                                  }}
                                  className="ap-btn-primary"
                                  style={{
                                    padding: "6px 12px",
                                    fontSize: "0.78rem",
                                    background: "linear-gradient(135deg, #e11d48, #be123c)",
                                  }}
                                >
                                  <FaPauseCircle className="mr-1" />
                                  Cảnh Báo & Tạm Dừng
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 4: QUẢN LÝ NGƯỜI DÙNG (USERS MANAGEMENT) */}
          {/* =================================================================== */}
          {activeTab === "users" && (
            <div>
              <div className="ap-view-header">
                <div>
                  <h1 className="ap-view-title">Quản Lý Người Dùng Hệ Thống</h1>
                  <p className="ap-view-subtitle">
                    Tra cứu tài khoản giảng viên, học sinh và phân quyền trạng
                    thái (Active, Suspended, Banned)
                  </p>
                </div>
                <button
                  onClick={fetchUsers}
                  className="ap-btn-secondary"
                  disabled={loadingUsers}
                >
                  {loadingUsers ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaExchangeAlt />
                  )}
                  <span>Làm Mới</span>
                </button>
              </div>

              {/* Filters */}
              <div className="ap-filter-bar">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Tên, Email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                  className="ap-search-input"
                />

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="ap-select"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="teacher">Giảng Viên (Teacher)</option>
                  <option value="student">Học Viên (Student)</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="ap-select"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động (Active)</option>
                  <option value="suspended">Tạm khóa (Suspended)</option>
                  <option value="banned">Bị cấm (Banned)</option>
                </select>

                <button onClick={fetchUsers} className="ap-btn-primary">
                  <FaSearch />
                  <span>Tìm</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="ap-content-card">
                {usersList.length === 0 ? (
                  <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                    Không tìm thấy người dùng nào phù hợp.
                  </div>
                ) : (
                  <div className="ap-table-container">
                    <table className="ap-table">
                      <thead>
                        <tr>
                          <th>Người Dùng</th>
                          <th>Vai Trò</th>
                          <th>Trạng Thái</th>
                          <th>Ngày Tham Gia</th>
                          <th>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    u.Avatar ||
                                    "https://res.cloudinary.com/elearning-platform-vn/image/upload/v1789924694/edupulse/students/student_nguyen_van_bao.jpg"
                                  }
                                  alt=""
                                  className="w-9 h-9 rounded-full object-cover border border-[var(--card-border)]"
                                />
                                <div>
                                  <div className="font-bold text-[var(--text-main)]">
                                    {u.Firstname} {u.Lastname}
                                  </div>
                                  <div className="text-xs text-[var(--text-muted)]">
                                    {u.Email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              {u.role === "teacher" ? (
                                <span className="ap-badge ap-badge-info">
                                  <FaChalkboardTeacher /> Giảng Viên
                                </span>
                              ) : (
                                <span className="ap-badge ap-badge-success">
                                  <FaUserGraduate /> Học Viên
                                </span>
                              )}
                            </td>
                            <td>
                              {u.status === "active" || !u.status ? (
                                <span className="ap-badge ap-badge-success">
                                  Hoạt động
                                </span>
                              ) : u.status === "suspended" ? (
                                <span className="ap-badge ap-badge-warning">
                                  Tạm khóa
                                </span>
                              ) : (
                                <span className="ap-badge ap-badge-error">
                                  Bị cấm (Banned)
                                </span>
                              )}
                            </td>
                            <td className="text-xs text-[var(--text-muted)]">
                              {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setStatusModalUser(u);
                                  setNewStatusChoice(
                                    u.status === "banned" ? "active" : "banned"
                                  );
                                }}
                                className="ap-btn-secondary"
                                style={{ padding: "6px 12px", fontSize: "0.78rem" }}
                              >
                                <FaUserShield className="mr-1 text-[var(--primary)]" />
                                Đổi Trạng Thái
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 5: XÉT DUYỆT HỒ SƠ (LEGACY APPROVALS) */}
          {/* =================================================================== */}
          {activeTab === "legacyApprovals" && (
            <div>
              <div className="ap-view-header">
                <div>
                  <h1 className="ap-view-title">Xét Duyệt Hồ Sơ Giảng Viên & Học Viên</h1>
                  <p className="ap-view-subtitle">
                    Kiểm duyệt bằng cấp, giấy tờ tùy thân của giảng viên và học
                    viên mới đăng ký
                  </p>
                </div>
                <button onClick={fetchLegacy} className="ap-btn-secondary">
                  <FaExchangeAlt />
                  <span>Làm Mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Giảng viên chờ duyệt */}
                <div className="ap-content-card">
                  <div className="ap-card-header">
                    <h3 className="ap-card-title">
                      <FaChalkboardTeacher className="text-sky-500" />
                      Giảng Viên Chờ Duyệt Bằng Cấp (
                      {teacherData.filter((t) => t.Isapproved === "pending").length}
                      )
                    </h3>
                  </div>

                  {teacherData.filter((t) => t.Isapproved === "pending").length ===
                  0 ? (
                    <p className="text-xs text-[var(--text-muted)] text-center py-6">
                      Không có hồ sơ giảng viên nào đang chờ.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {teacherData
                        .filter((t) => t.Isapproved === "pending")
                        .map((t) => (
                          <div
                            key={t._id}
                            className="p-4 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--card-border)] flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-[var(--text-main)] text-sm">
                                {t.Firstname} {t.Lastname}
                              </div>
                              <div className="text-xs text-[var(--text-muted)]">
                                {t.Email}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/VarifyDoc/teacher/${adminID}/${t._id}`)
                                }
                                className="ap-btn-secondary"
                                style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                              >
                                Xem Giấy Tờ <FaExternalLinkAlt size={10} />
                              </button>
                              <button
                                onClick={() =>
                                  handleLegacyApprove(t._id, "teacher", true, t.Email)
                                }
                                className="ap-btn-primary"
                                style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                              >
                                Duyệt
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Học viên chờ duyệt */}
                <div className="ap-content-card">
                  <div className="ap-card-header">
                    <h3 className="ap-card-title">
                      <FaUserGraduate className="text-emerald-500" />
                      Học Viên Chờ Duyệt (
                      {studentData.filter((s) => s.Isapproved === "pending").length}
                      )
                    </h3>
                  </div>

                  {studentData.filter((s) => s.Isapproved === "pending").length ===
                  0 ? (
                    <p className="text-xs text-[var(--text-muted)] text-center py-6">
                      Không có hồ sơ học viên nào đang chờ.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {studentData
                        .filter((s) => s.Isapproved === "pending")
                        .map((s) => (
                          <div
                            key={s._id}
                            className="p-4 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--card-border)] flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-[var(--text-main)] text-sm">
                                {s.Firstname} {s.Lastname}
                              </div>
                              <div className="text-xs text-[var(--text-muted)]">
                                {s.Email}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/VarifyDoc/student/${adminID}/${s._id}`)
                                }
                                className="ap-btn-secondary"
                                style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                              >
                                Xem Chi Tiết <FaExternalLinkAlt size={10} />
                              </button>
                              <button
                                onClick={() =>
                                  handleLegacyApprove(s._id, "student", true, s.Email)
                                }
                                className="ap-btn-primary"
                                style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                              >
                                Duyệt
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 6: HỘP THƯ LIÊN HỆ (MESSAGES) */}
          {/* =================================================================== */}
          {activeTab === "messages" && (
            <div>
              <div className="ap-view-header">
                <div>
                  <h1 className="ap-view-title">Hộp Thư Liên Hệ Nền Tảng</h1>
                  <p className="ap-view-subtitle">
                    Các phản hồi, góp ý và yêu cầu hỗ trợ từ người dùng gửi về qua
                    trang Liên Hệ
                  </p>
                </div>
                <button onClick={fetchLegacy} className="ap-btn-secondary">
                  <FaExchangeAlt />
                  <span>Làm Mới</span>
                </button>
              </div>

              <div className="ap-content-card">
                {allmsg.length === 0 ? (
                  <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                    Hiện chưa có tin nhắn liên hệ nào.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allmsg.map((msg, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--card-border)] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[var(--text-main)]">
                              {msg.name}
                            </span>
                            <span className="text-xs text-[var(--primary)] font-mono">
                              {msg.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              msg.status
                                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                            }`}>
                              {msg.status ? '✓ Đã Phản Hồi' : '⏳ Chưa Xử Lý'}
                            </span>
                          </div>
                        </div>

                        <div className="text-sm text-[var(--text-main)] bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--card-border)] leading-relaxed">
                          {msg.message}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-[var(--text-muted)]">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString('vi-VN') : ''}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReplyMessage(msg)}
                              className="ap-btn-primary"
                              style={{ padding: "5px 12px", fontSize: "0.75rem" }}
                              title="Gửi email phản hồi cho người dùng"
                            >
                              <FaEnvelope className="mr-1" />
                              <span>Phản Hồi Email</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="ap-btn-secondary text-rose-500 hover:bg-rose-500/10"
                              style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                              title="Xóa tin nhắn này"
                            >
                              <FaTimesCircle className="mr-1" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: GIẢI NGÂN LỆNH RÚT TIỀN */}
      {/* =================================================================== */}
      {payoutModalOpen && selectedWithdrawal && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal-card">
            <h3 className="ap-modal-title">Xác Nhận Giải Ngân Chuyển Khoản</h3>
            <p className="ap-modal-desc">
              Vui lòng chuyển khoản cho giảng viên theo thông tin thụ hưởng và
              nhập mã giao dịch đối soát.
            </p>

            <div className="bg-[var(--bg-surface-secondary)] p-4 rounded-xl space-y-2 text-xs border border-[var(--card-border)] mb-4">
              <div>
                <span className="text-[var(--text-muted)]">Giảng viên:</span>{" "}
                <strong className="text-[var(--text-main)]">
                  {selectedWithdrawal.teacherId?.Firstname}{" "}
                  {selectedWithdrawal.teacherId?.Lastname}
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Số tiền:</span>{" "}
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                  {selectedWithdrawal.amount?.toLocaleString("vi-VN")}đ
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Ngân hàng:</span>{" "}
                <strong className="text-[var(--text-main)]">
                  {selectedWithdrawal.bankInfo?.bankName}
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Số tài khoản:</span>{" "}
                <strong className="text-amber-500 font-mono text-sm">
                  {selectedWithdrawal.bankInfo?.accountNumber}
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Chủ tài khoản:</span>{" "}
                <strong className="text-[var(--text-main)] uppercase">
                  {selectedWithdrawal.bankInfo?.accountHolderName}
                </strong>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Mã Giao Dịch Chuyển Khoản (TXN Code) *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: FT240987654321..."
                  value={txnCode}
                  onChange={(e) => setTxnCode(e.target.value)}
                  className="ap-search-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Ghi Chú Đối Soát (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Đã chuyển khoản thành công..."
                  value={payoutFeedback}
                  onChange={(e) => setPayoutFeedback(e.target.value)}
                  className="ap-search-input w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPayoutModalOpen(false)}
                className="ap-btn-secondary flex-1 justify-center"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleProcessWithdrawal("rejected")}
                className="ap-btn-secondary flex-1 justify-center text-rose-500"
              >
                Từ chối
              </button>
              <button
                onClick={() => handleProcessWithdrawal("completed")}
                className="ap-btn-primary flex-1 justify-center"
              >
                Xác Nhận Giải Ngân
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: TẠM DỪNG KHÓA HỌC & GỬI CẢNH BÁO */}
      {/* =================================================================== */}
      {suspendModalOpen && selectedCourseToSuspend && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal-card">
            <h3 className="ap-modal-title flex items-center gap-2 text-rose-500">
              <FaExclamationTriangle /> Tạm Dừng Khóa Học & Gửi Mail Cảnh Báo
            </h3>
            <p className="ap-modal-desc">
              Hệ thống sẽ chuyển khóa học sang trạng thái Tạm dừng (Suspended)
              và gửi email yêu cầu giảng viên giải trình chất lượng.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Lý do cảnh báo / tạm dừng (sẽ gửi vào email giảng viên)
              </label>
              <textarea
                rows={4}
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Khóa học nhận nhiều phản hồi tiêu cực về thái độ giảng dạy..."
                className="ap-search-input w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSuspendModalOpen(false)}
                className="ap-btn-secondary flex-1 justify-center"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSuspendCourse}
                className="ap-btn-primary flex-1 justify-center"
                style={{ background: "linear-gradient(135deg, #e11d48, #be123c)" }}
              >
                Gửi Cảnh Báo & Tạm Dừng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: CẬP NHẬT TRẠNG THÁI TÀI KHOẢN (BAN / UNBAN) */}
      {/* =================================================================== */}
      {statusModalUser && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal-card">
            <h3 className="ap-modal-title">Cập Nhật Trạng Thái Tài Khoản</h3>
            <p className="ap-modal-desc">
              Người dùng:{" "}
              <strong>
                {statusModalUser.Firstname} {statusModalUser.Lastname}
              </strong>{" "}
              ({statusModalUser.Email})
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Trạng thái mong muốn
                </label>
                <select
                  value={newStatusChoice}
                  onChange={(e) => setNewStatusChoice(e.target.value)}
                  className="ap-select w-full"
                >
                  <option value="active">Hoạt động bình thường (Active)</option>
                  <option value="suspended">Tạm khóa tài khoản (Suspended)</option>
                  <option value="banned">Cấm vĩnh viễn (Banned)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Lý do xử lý (sẽ gửi thông báo email)
                </label>
                <input
                  type="text"
                  placeholder="Vi phạm quy định của nền tảng..."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  className="ap-search-input w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStatusModalUser(null)}
                className="ap-btn-secondary flex-1 justify-center"
              >
                Hủy
              </button>
              <button
                onClick={handleToggleUserStatus}
                className="ap-btn-primary flex-1 justify-center"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
      {/* =================================================================== */}
      {/* MODAL 4: CHI TIẾT PHẢN HỒI HỌC VIÊN CỦA KHÓA HỌC */}
      {/* =================================================================== */}
      {feedbackModalCourse && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal-card" style={{ maxWidth: 680, maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)] mb-4">
              <div>
                <h3 className="ap-modal-title">Phản Hồi Nghiệm Thu Khóa Học</h3>
                <p className="ap-modal-desc font-semibold text-sky-400">
                  {feedbackModalCourse.courseName || feedbackModalCourse.coursename || feedbackModalCourse.subject}
                </p>
              </div>
              <button
                onClick={() => setFeedbackModalCourse(null)}
                className="text-[var(--text-muted)] hover:text-white p-1"
              >
                <FaTimesCircle size={18} />
              </button>
            </div>

            {loadingFeedbacks ? (
              <div className="py-8 text-center text-sm text-[var(--text-muted)] flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Đang tải danh sách phản hồi...
              </div>
            ) : courseFeedbacks.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                Chưa có học viên nào gửi biểu mẫu xác nhận hoàn thành cho khóa học này.
              </div>
            ) : (
              <div className="space-y-3">
                {courseFeedbacks.map((fb, idx) => (
                  <div key={idx} className="p-3 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--card-border)] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--text-main)]">
                        {fb.studentId?.Firstname} {fb.studentId?.Lastname} ({fb.studentId?.Email})
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${fb.isConfirmedEndCourse ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                        {fb.isConfirmedEndCourse ? '✓ Đã xác nhận kết thúc' : 'Chưa xác nhận'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>Chất lượng giảng dạy: <strong className="text-amber-400">{fb.teachingQualitySatisfaction || 5}/5 ★</strong></div>
                      <div>Mức độ tham gia: <strong className="text-sky-400">{fb.attendanceSatisfaction || 5}/5 ★</strong></div>
                    </div>
                    {fb.feedbackContent && (
                      <div className="p-2 bg-[var(--card-bg)] rounded border border-[var(--card-border)] text-slate-300">
                        <span className="font-semibold text-slate-400">Nhận xét:</span> "{fb.feedbackContent}"
                      </div>
                    )}
                    {fb.issuesReported && (
                      <div className="p-2 bg-rose-500/10 rounded border border-rose-500/20 text-rose-300">
                        <span className="font-semibold">Vấn đề phản ánh:</span> "{fb.issuesReported}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex justify-end">
              <button
                onClick={() => setFeedbackModalCourse(null)}
                className="ap-btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
