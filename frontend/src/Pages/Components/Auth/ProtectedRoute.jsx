import React from 'react';
import { Navigate, Outlet, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ForbiddenPage from '../../ErrorPage/ForbiddenPage';

/**
 * ProtectedRoute: Kiểm tra phân quyền truy cập nghiêm ngặt theo Role & User ID
 * @param {Array<string>} allowedRoles - Danh sách các role được phép truy cập (vd: ['student'], ['teacher'], ['admin'])
 */
function ProtectedRoute({ allowedRoles = [] }) {
  const { user, role, isLoggedIn, loading } = useAuth();
  const params = useParams();
  const location = useLocation();

  // 1. Chờ xác thực đồng bộ phiên với Server HttpOnly Cookie
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-body)',
        color: 'var(--text-muted)'
      }}>
        <div className="edu-spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
        <p style={{ marginTop: '16px', fontSize: '0.9rem' }}>Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  // 2. Chưa đăng nhập -> Đá ngay về trang Login
  if (!isLoggedIn || !user) {
    const loginTarget = allowedRoles.includes('admin') ? '/adminLogin' : '/login';
    return <Navigate to={loginTarget} state={{ from: location.pathname }} replace />;
  }

  // 3. Đã đăng nhập nhưng SAI ROLE (Ví dụ: student cố vào Teacher Dashboard, hoặc teacher cố vào Admin)
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <ForbiddenPage userRole={role} requiredRoles={allowedRoles} />;
  }

  // 4. Đúng Role nhưng SAI USER ID trên URL (Chống IDOR / thay đổi ID để dòm tài khoản người khác)
  // Nếu URL có param ID và khác ID của user hiện tại, tự động chuyển về đúng ID của họ
  const targetId = params.ID || params.id || params.adminID;
  if (targetId && user.id && String(targetId) !== String(user.id)) {
    // Tái tạo lại đường dẫn với đúng user.id
    const correctedPath = location.pathname.replace(targetId, user.id);
    return <Navigate to={correctedPath} replace />;
  }

  // 5. Quyền hạn hợp lệ -> Render giao diện con
  return <Outlet />;
}

export default ProtectedRoute;
