/**
 * EDUPULSE — HỆ THỐNG PHÂN CẤP MÔN HỌC 3 TẦNG
 * Dùng chung ở: Courses.jsx, Landing.jsx, TeacherCourses.jsx, Popup.jsx, CourseDetail.jsx
 *
 * Tầng 1: Cấp học (educationLevel)
 * Tầng 2: Lớp    (grade)
 * Tầng 3: Môn    (subject)
 */

export const EDUCATION_LEVELS = [
  {
    key: 'primary',
    label: 'Tiểu Học',
    shortLabel: 'TH',
    grades: [
      { key: '1', label: 'Lớp 1' },
      { key: '2', label: 'Lớp 2' },
      { key: '3', label: 'Lớp 3' },
      { key: '4', label: 'Lớp 4' },
      { key: '5', label: 'Lớp 5' },
    ]
  },
  {
    key: 'secondary',
    label: 'THCS',
    shortLabel: 'THCS',
    grades: [
      { key: '6', label: 'Lớp 6' },
      { key: '7', label: 'Lớp 7' },
      { key: '8', label: 'Lớp 8' },
      { key: '9', label: 'Lớp 9' },
    ]
  },
  {
    key: 'highschool',
    label: 'THPT',
    shortLabel: 'THPT',
    grades: [
      { key: '10', label: 'Lớp 10' },
      { key: '11', label: 'Lớp 11' },
      { key: '12', label: 'Lớp 12' },
      { key: 'on-thi', label: 'Luyện Thi TN & ĐH' },
    ]
  },
  {
    key: 'language',
    label: 'Ngoại Ngữ & Chứng Chỉ',
    shortLabel: 'NN',
    grades: [] // Không phân lớp
  },
  {
    key: 'university',
    label: 'Đại Học & Chuyên Ngành',
    shortLabel: 'ĐH',
    grades: [] // Không phân lớp
  },
];

export const SUBJECTS_BY_LEVEL = {
  primary: [
    { key: 'toan-tieu-hoc', label: 'Toán' },
    { key: 'tieng-viet', label: 'Tiếng Việt' },
    { key: 'tieng-anh-tieu-hoc', label: 'Tiếng Anh' },
    { key: 'tu-nhien-xa-hoi', label: 'Tự Nhiên & Xã Hội' },
  ],
  secondary: [
    { key: 'toan-thcs', label: 'Toán' },
    { key: 'van-thcs', label: 'Ngữ Văn' },
    { key: 'ly-thcs', label: 'Vật Lý' },
    { key: 'hoa-thcs', label: 'Hóa Học' },
    { key: 'sinh-thcs', label: 'Sinh Học' },
    { key: 'su-thcs', label: 'Lịch Sử' },
    { key: 'dia-thcs', label: 'Địa Lý' },
    { key: 'tieng-anh-thcs', label: 'Tiếng Anh' },
    { key: 'tin-thcs', label: 'Tin Học' },
  ],
  highschool: [
    { key: 'toan-thpt', label: 'Toán' },
    { key: 'van-thpt', label: 'Ngữ Văn' },
    { key: 'ly-thpt', label: 'Vật Lý' },
    { key: 'hoa-thpt', label: 'Hóa Học' },
    { key: 'sinh-thpt', label: 'Sinh Học' },
    { key: 'su-thpt', label: 'Lịch Sử' },
    { key: 'dia-thpt', label: 'Địa Lý' },
    { key: 'tieng-anh-thpt', label: 'Tiếng Anh' },
    { key: 'tin-thpt', label: 'Tin Học' },
    { key: 'gdcd', label: 'GDCD' },
  ],
  language: [
    { key: 'ielts', label: 'IELTS' },
    { key: 'toeic', label: 'TOEIC' },
    { key: 'toefl', label: 'TOEFL' },
    { key: 'tieng-anh-giao-tiep', label: 'Tiếng Anh Giao Tiếp' },
    { key: 'tieng-trung', label: 'Tiếng Trung (HSK)' },
    { key: 'tieng-nhat', label: 'Tiếng Nhật (JLPT)' },
    { key: 'tieng-han', label: 'Tiếng Hàn (TOPIK)' },
    { key: 'tieng-phap', label: 'Tiếng Pháp (DELF)' },
  ],
  university: [
    { key: 'toan-cao-cap', label: 'Toán Cao Cấp' },
    { key: 'xac-suat-thong-ke', label: 'Xác Suất & Thống Kê' },
    { key: 'vat-ly-dai-cuong', label: 'Vật Lý Đại Cương' },
    { key: 'hoa-hoc-dai-cuong', label: 'Hóa Học Đại Cương' },
    { key: 'lap-trinh-web', label: 'Lập Trình Web (Fullstack)' },
    { key: 'khoa-hoc-du-lieu', label: 'Khoa Học Dữ Liệu' },
    { key: 'ai-machine-learning', label: 'AI & Machine Learning' },
    { key: 'tai-chinh-dinh-luong', label: 'Tài Chính Định Lượng' },
    { key: 'kinh-te-luong', label: 'Kinh Tế Lượng' },
    { key: 'cau-truc-du-lieu', label: 'Cấu Trúc Dữ Liệu & Thuật Toán' },
    { key: 'he-dieu-hanh', label: 'Hệ Điều Hành' },
    { key: 'mang-may-tinh', label: 'Mạng Máy Tính' },
    { key: 'co-so-du-lieu', label: 'Cơ Sở Dữ Liệu' },
  ],
};

/**
 * Map từ coursename cũ (key từ DB) → educationLevel + subject mới
 * Dùng để backward compatible với data cũ
 */
export const LEGACY_SUBJECT_MAP = {
  math:      { educationLevel: 'university', subject: 'toan-cao-cap',      label: 'Toán Cao Cấp' },
  physics:   { educationLevel: 'university', subject: 'vat-ly-dai-cuong',  label: 'Vật Lý Đại Cương' },
  chemistry: { educationLevel: 'university', subject: 'hoa-hoc-dai-cuong', label: 'Hóa Học Đại Cương' },
  biology:   { educationLevel: 'university', subject: 'khoa-hoc-du-lieu',  label: 'Sinh Học Di Truyền' },
  computer:  { educationLevel: 'university', subject: 'lap-trinh-web',     label: 'Lập Trình Web & CNTT' },
  ielts:     { educationLevel: 'language',   subject: 'ielts',             label: 'Tiếng Anh & IELTS' },
  'ai-data': { educationLevel: 'university', subject: 'ai-machine-learning', label: 'AI & Khoa Học Dữ Liệu' },
  finance:   { educationLevel: 'university', subject: 'tai-chinh-dinh-luong', label: 'Kinh Tế & Tài Chính' },
};

/** Lấy label hiển thị từ educationLevel key */
export const getLevelLabel = (key) => {
  return EDUCATION_LEVELS.find(l => l.key === key)?.label || key;
};

/** Lấy label hiển thị từ subject key */
export const getSubjectLabel = (levelKey, subjectKey) => {
  const subjects = SUBJECTS_BY_LEVEL[levelKey] || [];
  return subjects.find(s => s.key === subjectKey)?.label || subjectKey;
};

/** Lấy label cho course (hỗ trợ cả data cũ và mới) */
export const getCourseSubjectLabel = (courseData) => {
  if (courseData.subject && courseData.educationLevel) {
    return getSubjectLabel(courseData.educationLevel, courseData.subject) || courseData.subject;
  }
  // Fallback cho data cũ
  const legacy = LEGACY_SUBJECT_MAP[courseData.coursename?.toLowerCase()];
  return legacy?.label || courseData.coursename?.toUpperCase() || '';
};

/** Lấy educationLevel label cho course */
export const getCourseLevelLabel = (courseData) => {
  const levelKey = courseData.educationLevel || LEGACY_SUBJECT_MAP[courseData.coursename?.toLowerCase()]?.educationLevel || 'university';
  return getLevelLabel(levelKey);
};

export const DAYS_VI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};
