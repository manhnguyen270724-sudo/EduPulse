import React, { lazy, Suspense } from 'react'
import './index.css'
import './animations.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@context/AuthContext'

// =====================================================
// LAZY LOADING — Tách bundle theo từng route
// → Giảm initial load time, chỉ load khi cần
// =====================================================

// Layout chung
import Layout from './Layout'

// Auth & Common (load ngay — dùng nhiều)
const Landing        = lazy(() => import('@pages/Home/Landing/Landing'))
const Login          = lazy(() => import('@pages/Login/Login'))
const Signup         = lazy(() => import('@pages/Signup/Signup'))
const AdminLogin     = lazy(() => import('@pages/Login/AdminLogin'))

// Public Pages
const About          = lazy(() => import('@pages/Home/About/About'))
const Contact        = lazy(() => import('@pages/Home/Contact/Contact'))
const Courses        = lazy(() => import('@pages/Home/Courses/Courses'))
const CourseDetail   = lazy(() => import('@pages/Home/Courses/CourseDetail'))
const TeacherProfile = lazy(() => import('@pages/Home/Courses/TeacherProfile'))
const SearchData     = lazy(() => import('@pages/Home/Search/Search'))

// Auth flows
const VarifyEmail    = lazy(() => import('@pages/Components/VarifyEmail/VarifyEmail'))
const Forgetpassword = lazy(() => import('@pages/ForgetPassword/Forgetpassword'))
const ResetPassword  = lazy(() => import('@pages/ForgetPassword/ResetPassword'))
const ResetTeacher   = lazy(() => import('@pages/ForgetPassword/ResetTeacher'))

// Response pages
const Rejected       = lazy(() => import('@pages/Response/Rejected'))
const Pending        = lazy(() => import('@pages/Response/Pending'))

// Error
const ErrorPage      = lazy(() => import('@pages/ErrorPage/ErrorPage'))

// Document Verification
const StudentDocument = lazy(() => import('@pages/Components/DocumentVerification/StudentDocument'))
const TeacherDocument = lazy(() => import('@pages/Components/DocumentVerification/TeacherDocument'))

// ─── Student Dashboard ───
const StudentLayout         = lazy(() => import('@pages/Dashboard/StudentDashboard/StudentLayout'))
const StudentCourses        = lazy(() => import('@pages/Dashboard/StudentDashboard/StudentCourses'))
const StudentClasses        = lazy(() => import('@pages/Dashboard/StudentDashboard/StudentClasses'))
const SearchTeacher         = lazy(() => import('@pages/Dashboard/StudentDashboard/SearchTeacher'))
const StudentPersonalProfile = lazy(() => import('@pages/Dashboard/StudentDashboard/StudentPersonalProfile'))

// ─── Teacher Dashboard ───
const TeacherLayout          = lazy(() => import('@pages/Dashboard/TeacherDashboard/TeacherLayout'))
const DashboardTeacher       = lazy(() => import('@pages/Dashboard/TeacherDashboard/DashboardTeacher'))
const TeacherClassrooms      = lazy(() => import('@pages/Dashboard/TeacherDashboard/TeacherClassrooms'))
const TeacherClasses         = lazy(() => import('@pages/Dashboard/TeacherDashboard/TeacherClasses'))
const TeacherCourses         = lazy(() => import('@pages/Dashboard/TeacherDashboard/TeacherCourses'))
const TeacherPersonalProfile = lazy(() => import('@pages/Dashboard/TeacherDashboard/TeacherPersonalProfile'))
const ClassroomChat          = lazy(() => import('@pages/Dashboard/ClassroomChat/ClassroomChat'))

// ─── Admin ───
const Admin    = lazy(() => import('@pages/Components/Admin/Admin'))
const Course   = lazy(() => import('@pages/Components/Admin/Course'))
const VarifyDoc = lazy(() => import('@pages/Components/Admin/VarifyDoc'))

// ─── Protected Route Wrapper ───
import ProtectedRoute from '@components/Auth/ProtectedRoute'

// =====================================================
// LOADING FALLBACK — Hiển thị khi đang lazy load
// =====================================================
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'var(--bg-primary, #0f172a)'
  }}>
    <div style={{
      width: 40,
      height: 40,
      border: '3px solid rgba(99,102,241,0.3)',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  </div>
)

// =====================================================
// ROUTER — Phân chia theo vai trò
// =====================================================
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>

      {/* ── PUBLIC ROUTES ── */}
      <Route index element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/Signup' element={<Signup />} />
      <Route path='/adminLogin' element={<AdminLogin />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/courses' element={<Courses />} />
      <Route path='/courses/:courseId' element={<CourseDetail />} />
      <Route path='/teacher/:teacherId' element={<TeacherProfile />} />
      <Route path='/Search/:subject' element={<SearchData />} />
      <Route path='/varifyEmail' element={<VarifyEmail />} />
      <Route path='/rejected/:user/:ID' element={<Rejected />} />
      <Route path='/pending' element={<Pending />} />
      <Route path='/forgetPassword' element={<Forgetpassword />} />
      <Route path='/student/forgetPassword/:token' element={<ResetPassword />} />
      <Route path='/teacher/forgetPassword/:token' element={<ResetTeacher />} />

      {/* ── STUDENT PROTECTED ROUTES ── */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path='/StudentDocument/:Data' element={<StudentDocument />} />
        <Route path='/Student/Dashboard/:ID' element={<StudentLayout />}>
          <Route index element={<StudentCourses />} />
          <Route path='Courses' element={<StudentCourses />} />
          <Route path='Classes' element={<StudentClasses />} />
          <Route path='Classes/:classroomId/chat' element={<ClassroomChat />} />
          <Route path='Search' element={<SearchTeacher />} />
          <Route path='Profile' element={<StudentPersonalProfile />} />
        </Route>
      </Route>

      {/* ── TEACHER PROTECTED ROUTES ── */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path='/TeacherDocument/:Data' element={<TeacherDocument />} />
        <Route path='/Teacher/Dashboard/:ID' element={<TeacherLayout />}>
          <Route index element={<DashboardTeacher />} />
          <Route path='Home' element={<DashboardTeacher />} />
          <Route path='Classrooms' element={<TeacherClassrooms />} />
          <Route path='Classes' element={<TeacherClasses />} />
          <Route path='Classes/:classroomId/chat' element={<ClassroomChat />} />
          <Route path='Courses' element={<TeacherCourses />} />
          <Route path='Profile' element={<TeacherPersonalProfile />} />
        </Route>
      </Route>

      {/* ── ADMIN PROTECTED ROUTES ── */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path='/admin/:data' element={<Admin />} />
        <Route path='/admin/course/:data' element={<Course />} />
        <Route path='/VarifyDoc/:type/:adminID/:ID' element={<VarifyDoc />} />
      </Route>

      {/* ── 404 CATCH ALL ── */}
      <Route path='*' element={<ErrorPage />} />

    </Route>
  )
)

// =====================================================
// APP ENTRY POINT
// =====================================================
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '10px',
          }
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </React.StrictMode>
)