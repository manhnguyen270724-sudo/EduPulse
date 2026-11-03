import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUniversity,
  FaTimes,
  FaSpinner,
  FaLock,
  FaHistory,
} from "react-icons/fa";
import toast from "react-hot-toast";

function Withdrawal({ onClose, TA }) {
  const { ID } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [earningsData, setEarningsData] = useState(null);

  // Form Fields
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("Vietcombank");
  const [accName, setAccName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [ifc, setIfc] = useState("");

  // Lấy dữ liệu chi tiết thu nhập và điều kiện rút tiền của từng khóa học
  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/payment/teacher/${ID}/earnings-overview`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setEarningsData(data.data);
          // Mặc định chọn khóa học đầu tiên nếu có
          if (data.data?.coursesBreakdown?.length > 0) {
            setSelectedCourseId(data.data.coursesBreakdown[0]._id);
          }
        }
      } catch (err) {
        console.error("Fetch earnings error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (ID) fetchEarnings();
  }, [ID]);

  const selectedCourse = earningsData?.coursesBreakdown?.find(
    (c) => c._id === selectedCourseId
  );

  const availableBalance = earningsData?.balance || TA || 0;

  // Xử lý gửi yêu cầu rút tiền
  const handleWithdrawal = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (Number(amount) > availableBalance) {
      toast.error("Số dư khả dụng không đủ");
      return;
    }
    if (!bankName || !accName.trim() || !accNumber.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin tài khoản ngân hàng");
      return;
    }

    // Kiểm tra điều kiện ràng buộc nếu chọn khóa học cụ thể
    if (selectedCourse) {
      if (!selectedCourse.adminApproved) {
        toast.error("Khóa học này chưa được Admin phê duyệt hoàn thành!");
        return;
      }
      if (!selectedCourse.isEligibleToWithdraw) {
        toast.error(
          `Học viên chưa đủ điều kiện (mới đạt ${selectedCourse.completionRate}%, yêu cầu ≥ 80%)`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/payment/teacher/${ID}/withdraw`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          courseId: selectedCourseId || null,
          bankName,
          accountNumber: accNumber,
          accountHolderName: accName,
          ifscOrBranch: ifc,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Không thể tạo yêu cầu rút tiền");
      }

      toast.success("Đã gửi yêu cầu rút tiền thành công! Admin sẽ giải ngân trong 24h.");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <FaTimes />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
            <FaWallet />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Rút Tiền Thù Lao Giảng Dạy</h2>
            <p className="text-xs text-slate-400">
              Chính sách bảo lãnh (Escrow) đảm bảo an toàn & minh bạch
            </p>
          </div>
        </div>

        {/* Số dư khả dụng */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/60 p-4 rounded-2xl border border-slate-700/60 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">SỐ DƯ KHẢ DỤNG ĐỂ RÚT</div>
            <div className="text-2xl font-black text-emerald-400">
              {availableBalance.toLocaleString("vi-VN")}đ
            </div>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Có thể giải ngân
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">
            <FaSpinner className="animate-spin inline mr-2" /> Đang kiểm tra điều kiện rút tiền...
          </div>
        ) : (
          <div className="space-y-5">
            {/* ── BƯỚC 1: CHỌN KHÓA HỌC & KIỂM TRA ĐIỀU KIỆN ── */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Chọn Khóa Học Cần Quyết Toán Rút Tiền
              </label>

              {earningsData?.coursesBreakdown?.length === 0 ? (
                <div className="text-xs text-slate-400 p-3 bg-slate-800 rounded-xl">
                  Thầy/Cô chưa có khóa học nào để rút tiền.
                </div>
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {earningsData?.coursesBreakdown?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.coursename} ({c.confirmedCount}/{c.totalStudents} SV xác nhận -{" "}
                      {c.adminApproved ? "Admin đã duyệt" : "Chờ Admin duyệt"})
                    </option>
                  ))}
                </select>
              )}

              {/* Hộp trạng thái điều kiện rút tiền */}
              {selectedCourse && (
                <div
                  className={`mt-3 p-4 rounded-2xl border text-xs space-y-2.5 ${
                    selectedCourse.isEligibleToWithdraw
                      ? "bg-emerald-950/20 border-emerald-800/50 text-emerald-200"
                      : "bg-amber-950/20 border-amber-800/50 text-amber-200"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Điều kiện giải ngân khóa học:</span>
                    {selectedCourse.isEligibleToWithdraw ? (
                      <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                        <FaCheckCircle /> ĐÃ ĐỦ ĐIỀU KIỆN
                      </span>
                    ) : (
                      <span className="text-amber-400 font-extrabold flex items-center gap-1">
                        <FaLock /> CHƯA ĐỦ ĐIỀU KIỆN
                      </span>
                    )}
                  </div>

                  {/* Điều kiện 1: Admin duyệt */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span>1. Admin phê duyệt hoàn thành khóa học:</span>
                    <strong
                      className={
                        selectedCourse.adminApproved ? "text-emerald-400" : "text-amber-400"
                      }
                    >
                      {selectedCourse.adminApproved ? "✓ Đã phê duyệt" : "⏳ Chờ Admin duyệt"}
                    </strong>
                  </div>

                  {/* Điều kiện 2: Học viên nộp form */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span>2. Học viên nộp form xác nhận kết thúc:</span>
                    <strong
                      className={
                        selectedCourse.completionRate >= 80
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      {selectedCourse.confirmedCount}/{selectedCourse.totalStudents} SV (
                      {selectedCourse.completionRate}%)
                      {selectedCourse.completionRate >= 80 ? " ✓ Đạt chuẩn" : " ⏳ Cần ≥ 80%"}
                    </strong>
                  </div>

                  {!selectedCourse.isEligibleToWithdraw && (
                    <div className="text-[10px] text-amber-300 bg-amber-900/30 p-2 rounded-lg border border-amber-800/40">
                      💡 <em>Gợi ý:</em> Thầy/Cô hãy nhắc nhở học viên điền form xác nhận kết thúc
                      khóa học và gửi yêu cầu nghiệm thu lên Admin để được mở khóa rút tiền.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── BƯỚC 2: THÔNG TIN TÀI KHOẢN NGÂN HÀNG & SỐ TIỀN ── */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Thông Tin Nhận Tiền
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Số tiền rút (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="VD: 1000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Ngân hàng thụ hưởng</label>
                  <input
                    type="text"
                    placeholder="VD: Vietcombank, MB Bank, Techcombank..."
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Số tài khoản</label>
                  <input
                    type="text"
                    placeholder="Số tài khoản ngân hàng"
                    value={accNumber}
                    onChange={(e) => setAccNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tên chủ tài khoản</label>
                  <input
                    type="text"
                    placeholder="NGUYEN VAN A"
                    value={accName}
                    onChange={(e) => setAccName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Chi nhánh / Mã IFC (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Chi nhánh Ba Đình, Hà Nội..."
                  value={ifc}
                  onChange={(e) => setIfc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Nút gửi yêu cầu */}
            <div className="pt-2">
              <button
                disabled={
                  submitting ||
                  (selectedCourse && !selectedCourse.isEligibleToWithdraw) ||
                  availableBalance <= 0
                }
                onClick={handleWithdrawal}
                className="w-full py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaUniversity />
                )}
                <span>
                  {selectedCourse && !selectedCourse.isEligibleToWithdraw
                    ? "Chưa Đủ Điều Kiện Nghiệm Thu"
                    : "Gửi Yêu Cầu Rút Tiền"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Withdrawal;