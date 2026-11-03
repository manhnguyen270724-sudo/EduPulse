import React, { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaStar,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

function CourseCompletionModal({ course, onClose, onSuccess }) {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Form Fields
  const [hasCompletedAllLessons, setHasCompletedAllLessons] = useState(true);
  const [teachingQualitySatisfaction, setTeachingQualitySatisfaction] = useState(5);
  const [attendanceSatisfaction, setAttendanceSatisfaction] = useState(5);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [issuesReported, setIssuesReported] = useState("");

  // Kiểm tra xem học viên đã từng gửi xác nhận cho khóa này chưa
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/course/${course._id}/completion-feedback/status`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.data?.hasSubmitted) {
            setAlreadySubmitted(true);
            const fb = data.data.feedback;
            setHasCompletedAllLessons(fb.hasCompletedAllLessons);
            setTeachingQualitySatisfaction(fb.teachingQualitySatisfaction || 5);
            setAttendanceSatisfaction(fb.attendanceSatisfaction || 5);
            setFeedbackContent(fb.feedbackContent || "");
            setIssuesReported(fb.issuesReported || "");
          }
        }
      } catch (err) {
        console.error("Check feedback status error:", err);
      } finally {
        setLoadingStatus(false);
      }
    };
    if (course?._id) checkStatus();
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      // 1. Gửi form xác nhận kết thúc khóa học
      const resFeedback = await fetch(
        `/api/course/${course._id}/completion-feedback`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hasCompletedAllLessons,
            teachingQualitySatisfaction,
            attendanceSatisfaction,
            feedbackContent,
            issuesReported,
          }),
        }
      );

      const dataFeedback = await resFeedback.json();
      if (!resFeedback.ok) {
        throw new Error(dataFeedback.message || "Gửi form xác nhận thất bại");
      }

      // 2. Gửi thêm review & rating công khai cho khóa học
      if (feedbackContent.trim()) {
        await fetch(`/api/course/${course._id}/reviews`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: teachingQualitySatisfaction,
            comment: feedbackContent,
          }),
        });
      }

      toast.success(
        "Cảm ơn bạn! Bạn đã hoàn thành form xác nhận kết thúc khóa học."
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <FaTimes />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-xl">
            <FaGraduationCap />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Xác Nhận Kết Thúc Khóa Học
            </h2>
            <p className="text-xs text-slate-400">
              Khóa: <span className="text-sky-300 font-semibold">{course.coursename}</span>
            </p>
          </div>
        </div>

        {loadingStatus ? (
          <div className="text-center py-8 text-slate-400">
            <FaSpinner className="animate-spin inline mr-2" /> Đang kiểm tra...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {alreadySubmitted && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                <span>Bạn đã gửi form xác nhận kết thúc cho khóa học này (Có thể cập nhật lại).</span>
              </div>
            )}

            {/* Cam kết hoàn thành chương trình */}
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCompletedAllLessons}
                  onChange={(e) => setHasCompletedAllLessons(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-sky-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-slate-200 font-medium leading-relaxed">
                  Tôi xác nhận giảng viên đã hoàn thành đủ số buổi giảng dạy và chương trình học theo đúng cam kết của khóa học này.
                </span>
              </label>
            </div>

            {/* Đánh giá chất lượng giảng dạy */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                1. Mức độ hài lòng về chất lượng giảng dạy (1 - 5 sao):
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTeachingQualitySatisfaction(star)}
                    className="p-1 text-2xl transition hover:scale-110"
                  >
                    <FaStar
                      className={
                        star <= teachingQualitySatisfaction
                          ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          : "text-slate-700"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-300 ml-2">
                  {teachingQualitySatisfaction} / 5 Sao
                </span>
              </div>
            </div>

            {/* Đánh giá thời lượng & buổi học */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                2. Mức độ hài lòng về thời lượng và điểm danh:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setAttendanceSatisfaction(star)}
                    className="p-1 text-xl transition hover:scale-110"
                  >
                    <FaStar
                      className={
                        star <= attendanceSatisfaction
                          ? "text-sky-400"
                          : "text-slate-700"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-sky-300 ml-2">
                  {attendanceSatisfaction} / 5
                </span>
              </div>
            </div>

            {/* Nhận xét chi tiết */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                3. Đóng góp ý kiến hoặc cảm nhận của bạn về khóa học:
              </label>
              <textarea
                rows={3}
                placeholder="Thầy/Cô dạy rất dễ hiểu, nhiệt tình giải đáp thắc mắc..."
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Báo cáo nếu có sự cố */}
            <div>
              <label className="block text-xs font-semibold text-rose-300 mb-1 flex items-center gap-1">
                <FaExclamationTriangle size={11} />
                <span>Báo cáo sự cố (nếu thầy cô nghỉ không bù hoặc dạy thiếu):</span>
              </label>
              <input
                type="text"
                placeholder="Để trống nếu không có sự cố..."
                value={issuesReported}
                onChange={(e) => setIssuesReported(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Nút gửi */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 disabled:opacity-50"
              >
                {submitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCheckCircle />
                )}
                <span>
                  {alreadySubmitted
                    ? "Cập Nhật Xác Nhận Kết Thúc"
                    : "Gửi Form Xác Nhận Hoàn Thành"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CourseCompletionModal;
