import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  PackagePlus,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  History,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings2,
} from "lucide-react";
import * as XLSX from "xlsx";
import axiosClient from "../../utils/axiosClient";

const StockListPage = () => {
  // STATE CHUYỂN TAB
  const [activeTab, setActiveTab] = useState("stock"); // "stock" | "history"

  // STATES DỮ LIỆU CHUNG
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // STATES CỦA TAB 1: KHO
  const [volumes, setVolumes] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // STATES CỦA TAB 2: LỊCH SỬ
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("ALL"); // ALL | IMPORT | EXPORT | ADJUST

  // Reset trang và từ khóa khi đổi Tab
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
    setTransactionType("ALL");
  }, [activeTab]);

  // Gọi API dùng chung
  const fetchData = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      if (activeTab === "stock") {
        const res = await axiosClient.get(`/volumes`, {
          params: { search: searchTerm, page: pageToFetch, limit },
        });
        setVolumes(res.data?.data || res.data || []);
        updateMeta(res);
      } else {
        const res = await axiosClient.get(`/volumes/transactions`, {
          params: {
            search: searchTerm,
            type: transactionType,
            page: pageToFetch,
            limit,
          },
        });
        setTransactions(res.data?.data || res.data || []);
        updateMeta(res);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMeta = (res) => {
    const meta = res.data?.meta || res.meta;
    if (meta) {
      setTotalPages(meta.totalPages || 1);
      setTotalItems(meta.totalItems || 0);
    } else {
      setTotalPages(1);
    }
  };

  // Debounce tìm kiếm
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchData(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeTab, transactionType]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchData(newPage);
    }
  };

  // ==========================================
  // XỬ LÝ NHẬP EXCEL (CỦA TAB KHO)
  // ==========================================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          alert("File Excel đang trống!");
          setIsImporting(false);
          e.target.value = null;
          return;
        }

        // Kiểm tra cấu trúc file (Dựa vào dòng đầu tiên)
        const firstRow = jsonData[0];
        if (!firstRow["Mã Sách (ID)"] && !firstRow["ID"]) {
          alert(
            "File Excel sai cấu trúc! Vui lòng tải 'File Mẫu' để xem định dạng chuẩn (Cần có cột 'Mã Sách (ID)').",
          );
          setIsImporting(false);
          e.target.value = null;
          return;
        }

        const formattedItems = jsonData
          .map((row) => ({
            volumeId: row["Mã Sách (ID)"] || row["ID"],
            quantity: Number(row["Số Lượng Nhập"] || row["Quantity"]),
            note: row["Ghi Chú"] || row["Note"] || "Nhập Excel",
          }))
          .filter(
            (item) =>
              item.volumeId &&
              item.quantity !== undefined &&
              !isNaN(item.quantity),
          );

        if (formattedItems.length === 0) {
          alert("Không tìm thấy dữ liệu hợp lệ nào để nhập!");
          setIsImporting(false);
          e.target.value = null;
          return;
        }

        const res = await axiosClient.post("/volumes/bulk-import", {
          items: formattedItems,
        });
        alert(res.message || "Nhập kho thành công!");
        fetchData(currentPage);
      } catch (error) {
        console.error("Lỗi nhập Excel:", error);
        alert(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi đọc file hoặc gửi dữ liệu!",
        );
      } finally {
        setIsImporting(false);
        e.target.value = null;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Mã Sách (ID)": "Copy ID ở bảng bên dưới dán vào đây",
        "Số Lượng Nhập": 50,
        "Ghi Chú": "Nhập kho đợt 1",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MauNhapKho");
    XLSX.writeFile(wb, "StoryVault_MauNhapKho.xlsx");
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 font-nunito h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <PackagePlus className="text-amber-500" size={32} /> Quản Lý Kho
          </h1>
          <p className="text-stone-500 font-medium">
            Kiểm kê tồn kho, nhập xuất và theo dõi luồng giao dịch.
          </p>
        </div>

        {activeTab === "stock" && (
          <div className="flex gap-3">
            <button
              onClick={downloadTemplate}
              className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Download size={18} /> Tải File Mẫu
            </button>
            <label
              className={`bg-green-600 hover:bg-green-700 text-white font-black py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer ${isImporting ? "opacity-50 pointer-events-none" : ""}`}
            >
              {isImporting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={20} />
              )}
              {isImporting ? "Đang xử lý..." : "Nhập Kho"}
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isImporting}
              />
            </label>
          </div>
        )}
      </div>

      {/* TABS HEADER */}
      <div className="flex gap-6 border-b border-stone-200 mb-6">
        <button
          onClick={() => setActiveTab("stock")}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "stock"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <PackagePlus size={18} /> Tồn Kho & Nhập
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "history"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <History size={18} /> Lịch Sử Giao Dịch
        </button>
      </div>

      {/* KHU VỰC SEARCH CHUNG */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder={
              activeTab === "stock"
                ? "Tìm mã ID, Tên sách để lấy ID..."
                : "Tìm ID sách, tên sách, ghi chú..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
        {activeTab === "history" && (
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-800 font-bold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
          >
            <option value="ALL">Tất cả giao dịch</option>
            <option value="IMPORT">Nhập Kho (Cộng)</option>
            <option value="EXPORT">Xuất Bán (Trừ)</option>
            <option value="ADJUST">Điều Chỉnh</option>
          </select>
        )}
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 sticky top-0 z-10">
              {activeTab === "stock" ? (
                <tr className="text-stone-500 text-sm border-b border-stone-200">
                  <th className="p-4 font-bold min-w-[200px]">
                    Mã Sách (ID - Copy vào Excel)
                  </th>
                  <th className="p-4 font-bold">Tên Sách</th>
                  <th className="p-4 font-bold text-center">Tồn kho</th>
                  <th className="p-4 font-bold text-center">Trạng thái bán</th>
                </tr>
              ) : (
                <tr className="text-stone-500 text-sm border-b border-stone-200">
                  <th className="p-4 font-bold">Thời Gian</th>
                  <th className="p-4 font-bold">Loại</th>
                  <th className="p-4 font-bold text-center">Số lượng (+/-)</th>
                  <th className="p-4 font-bold min-w-[200px]">Sản Phẩm</th>
                  <th className="p-4 font-bold min-w-[200px]">Ghi chú</th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <Loader2
                      className="animate-spin text-amber-500 mx-auto"
                      size={32}
                    />
                  </td>
                </tr>
              ) : activeTab === "stock" && volumes.length > 0 ? (
                /* RENDER TAB KHO */
                volumes.map((vol) => (
                  <tr
                    key={vol.id}
                    className="border-b border-stone-100 hover:bg-stone-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-xs text-stone-500 truncate w-24"
                          title={vol.id}
                        >
                          {vol.id}
                        </span>
                        <button
                          onClick={() => handleCopy(vol.id)}
                          className="p-1.5 hover:bg-amber-100 hover:text-amber-600 text-stone-400 rounded-md transition-colors border border-stone-200"
                          title="Copy ID"
                        >
                          {copiedId === vol.id ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-stone-800">
                      {vol.title ||
                        `${vol.series?.title} - Tập ${vol.volumeNumber}`}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${vol.stock > 20 ? "bg-green-100 text-green-700" : vol.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                      >
                        {vol.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${vol.isActive ? "bg-stone-800 text-stone-100" : "bg-stone-200 text-stone-500"}`}
                      >
                        {vol.isActive ? "Đang bán" : "Đã ẩn"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : activeTab === "history" && transactions.length > 0 ? (
                /* RENDER TAB LỊCH SỬ GIAO DỊCH */
                transactions.map((trans) => (
                  <tr
                    key={trans.id}
                    className="border-b border-stone-100 hover:bg-stone-50 text-sm"
                  >
                    <td className="p-4 font-medium text-stone-600">
                      {new Date(trans.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-4">
                      {trans.type === "IMPORT" ? (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 font-bold px-2 py-1 rounded text-xs">
                          <ArrowDownToLine size={14} /> NHẬP KHO
                        </span>
                      ) : trans.type === "EXPORT" ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 font-bold px-2 py-1 rounded text-xs">
                          <ArrowUpFromLine size={14} /> XUẤT/BÁN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-100 font-bold px-2 py-1 rounded text-xs">
                          <Settings2 size={14} /> ĐIỀU CHỈNH
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`font-black text-lg ${trans.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {trans.quantity > 0
                          ? `+${trans.quantity}`
                          : trans.quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 shrink-0 bg-stone-200 rounded overflow-hidden border border-stone-300">
                          {trans.volume?.coverImage ? (
                            <img
                              src={trans.volume.coverImage}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 line-clamp-1">
                            {trans.volume?.title || trans.volume?.series?.title}
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono">
                            ID: {trans.volumeId.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="p-4 text-stone-500 italic max-w-xs truncate"
                      title={trans.note}
                    >
                      {trans.note || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-stone-500 font-bold"
                  >
                    Không tìm thấy dữ liệu!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG */}
        {!loading && totalPages > 1 && (
          <div className="bg-white border-t border-stone-200 p-4 flex items-center justify-between mt-auto">
            <span className="text-sm font-bold text-stone-500">
              Trang {currentPage} / {totalPages} (Tổng {totalItems} dòng)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${currentPage === 1 ? "bg-stone-100 text-stone-400 cursor-not-allowed" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum < currentPage - 2 || pageNum > currentPage + 2)
                  return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-black transition-colors ${currentPage === pageNum ? "bg-amber-500 text-stone-900 shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${currentPage === totalPages ? "bg-stone-100 text-stone-400 cursor-not-allowed" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockListPage;
