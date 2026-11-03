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
  const [activeTab, setActiveTab] = useState("revenue"); // revenue | completion | badReviews | users | legacyApprovals | messages

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
    fetchBadReviews();
    fetchUsers();
    fetchLegacy();
  }, [data]);

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

  // Duyệt nghiệm thu khóa học đã hoàn thành -> Mở khóa tiền cho GV rút
  const handleApproveCompletion = async (courseId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn PHÊ DUYỆT HOÀN THÀNH cho khóa học này? Tiền học phí sẽ được mở khóa vào ví để giảng viên rút tiền."
      )
    ) {
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
        }
      );
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Phê duyệt thất bại");
      toast.success("Đã phê duyệt nghiệm thu khóa học thành công!");
      fetchCompletionPending();
      fetchRevenue();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setApprovingCourseId(null);
    }
  };

  // Tạm dừng khóa học & Gửi email cảnh báo
  const handleSuspendCourse = async () => {
    if (!selectedCourseToSuspend) return;
    try {
      const res = await fetch(
        `/api/admin/courses/${selectedCourseToSuspend._id}/suspend-warning`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: suspendReason,
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
    try {
      const res = await fetch(
        `/api/admin/users/${statusModalUser.role}/${statusModalUser._id}/status`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatusChoice,
            reason: statusReason,
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
                          <th>Học Viên</th>
                          <th>Số Tiền Ký Quỹ</th>
                          <th>Đánh Giá Học Viên</th>
                          <th>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingCourses.map((c) => (
                          <tr key={c._id}>
                            <td>
                              <div className="font-bold text-[var(--text-main)]">
                                {c.courseName}
                              </div>
                              <div className="text-xs text-[var(--text-muted)]">
                                ID: {c._id}
                              </div>
                            </td>
                            <td>
                              <div className="font-medium text-[var(--text-main)]">
                                {c.teacherId?.Firstname} {c.teacherId?.Lastname}
                              </div>
                              <div className="text-xs text-[var(--text-muted)]">
                                {c.teacherId?.Email}
                              </div>
                            </td>
                            <td>
                              <div className="font-medium text-[var(--text-main)]">
                                {c.studentId?.Firstname} {c.studentId?.Lastname}
                              </div>
                              <div className="text-xs text-[var(--text-muted)]">
                                {c.studentId?.Email}
                              </div>
                            </td>
                            <td>
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                {(c.price || 0).toLocaleString("vi-VN")}đ
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                <FaStar />
                                <span>{c.studentRating || 5}/5 sao</span>
                              </div>
                              <div className="text-xs text-[var(--text-muted)] italic max-w-xs truncate">
                                "{c.studentFeedback || "Đã học đủ các buổi và hài lòng"}"
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => handleApproveCompletion(c._id)}
                                disabled={approvingCourseId === c._id}
                                className="ap-btn-primary"
                                style={{ padding: "6px 14px", fontSize: "0.78rem" }}
                              >
                                {approvingCourseId === c._id ? (
                                  <FaSpinner className="animate-spin mr-1" />
                                ) : (
                                  <FaCheckCircle className="mr-1" />
                                )}
                                Phê Duyệt Nghiệm Thu
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
                        className="p-4 bg-[var(--bg-surface-secondary)] rounded-xl border border-[var(--card-border)]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-[var(--text-main)]">
                            {msg.name}
                          </div>
                          <span className="text-xs text-[var(--primary)] font-mono">
                            {msg.email}
                          </span>
                        </div>
                        <div className="text-sm text-[var(--text-main)] bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--card-border)]">
                          {msg.message}
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
    </div>
  );
};

export default Admin;
