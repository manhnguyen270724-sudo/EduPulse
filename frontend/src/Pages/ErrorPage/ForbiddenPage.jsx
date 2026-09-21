import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaExclamationTriangle, FaArrowLeft, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

function ForbiddenPage({ userRole, requiredRoles = [] }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const getRoleName = (r) => {
    switch (r) {
      case 'teacher': return 'Giảng Viên';
      case 'student': return 'Học Viên';
      case 'admin': return 'Quản Trị Viên';
      default: return 'Khách vãng lai';
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'teacher') return `/Teacher/Dashboard/${user.id}/Home`;
    if (user.role === 'student') return `/Student/Dashboard/${user.id}/Courses`;
    if (user.role === 'admin') return `/admin/${user.id}`;
    return '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-body)',
      padding: '24px',
      color: 'var(--text-main)',
      fontFamily: 'inherit'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '8px',
        padding: '40px 32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        textAlign: 'center'
      }}>
        {/* Shield Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          <FaShieldAlt />
        </div>

        {/* Status Badge */}
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          Lỗi 403 · Truy Cập Bị Từ Chối
        </span>

        <h1 style={{
          fontSize: '1.6rem',
          fontWeight: 800,
          margin: '0 0 12px 0',
          color: 'var(--text-main)',
          lineHeight: 1.3
        }}>
          Bạn Không Có Quyền Truy Cập Khu Vực Này
        </h1>

        <div style={{
          backgroundColor: 'var(--bg-surface-secondary)',
          borderLeft: '4px solid #ef4444',
          borderRadius: '0 4px 4px 0',
          padding: '14px 16px',
          textAlign: 'left',
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          margin: '20px 0 28px 0',
          lineHeight: 1.6
        }}>
          <p style={{ margin: '0 0 6px 0' }}>
            • Vai trò hiện tại của bạn: <strong style={{ color: 'var(--text-main)' }}>{getRoleName(userRole)}</strong>
          </p>
          <p style={{ margin: '0' }}>
            • Trang này yêu cầu vai trò: <strong style={{ color: '#ef4444' }}>{requiredRoles.map(getRoleName).join(' hoặc ')}</strong>
          </p>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
          Hệ thống EduPulse tự động phân quyền độc lập theo từng vai trò để bảo vệ dữ liệu học tập và thông tin riêng tư của người dùng. Vui lòng quay về khu vực thuộc quyền hạn của bạn.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user ? (
            <NavLink
              to={getDashboardLink()}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '0.92rem',
                borderRadius: '5px',
                textDecoration: 'none'
              }}
            >
              <FaHome size={15} />
              <span>Quay Về Góc Làm Việc Của Bạn ({getRoleName(user.role)})</span>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '0.92rem',
                borderRadius: '5px',
                textDecoration: 'none'
              }}
            >
              <span>Đăng Nhập Đúng Tài Khoản</span>
            </NavLink>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-ghost"
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 16px',
                fontSize: '0.86rem',
                borderRadius: '5px'
              }}
            >
              <FaArrowLeft size={12} />
              <span>Quay Lại Trang Trước</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                  navigate('/login');
                }}
                className="btn-ghost"
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  fontSize: '0.86rem',
                  borderRadius: '5px',
                  color: '#ef4444'
                }}
              >
                <FaSignOutAlt size={12} />
                <span>Đăng Xuất</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForbiddenPage;
