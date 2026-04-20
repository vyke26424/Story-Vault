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
} from "lucide-react";
import * as XLSX from "xlsx";
import axiosClient from "../../utils/axiosClient";

const StockListPage = () => {
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchVolumes = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/volumes`, {
        params: {
          search: searchTerm,
          page: pageToFetch,
          limit: limit,
        },
      });
      setVolumes(res.data?.data || res.data || []);

      // Cập nhật Meta phân trang
      const meta = res.data?.meta || res.meta;
      if (meta) {
        setTotalPages(meta.totalPages || 1);
        setTotalItems(meta.totalItems || 0);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchVolumes(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchVolumes(newPage);
    }
  };

  // XỬ LÝ NHẬP EXCEL
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Lấy sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Chuyển excel thành JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map dữ liệu từ cột tiếng Việt sang chuẩn API Backend
        const formattedItems = jsonData
          .map((row) => ({
            volumeId: row["Mã Sách (ID)"] || row["ID"],
            quantity: Number(row["Số Lượng Nhập"] || row["Quantity"]),
            note: row["Ghi Chú"] || row["Note"] || "Nhập Excel",
          }))
          .filter(
            (item) => item.volumeId && item.quantity && !isNaN(item.quantity),
          );

        if (formattedItems.length === 0) {
          alert(
            "File Excel không đúng định dạng hoặc không có dữ liệu hợp lệ!",
          );
          setIsImporting(false);
          return;
        }

        // Bắn lên Backend
        const res = await axiosClient.post("/volumes/bulk-import", {
          items: formattedItems,
        });
        alert(res.message || "Nhập kho thành công!");
        fetchVolumes(currentPage); // Load lại số mới ở trang hiện tại
      } catch (error) {
        console.error("Lỗi nhập Excel:", error);
        alert("Có lỗi xảy ra khi đọc file hoặc gửi dữ liệu!");
      } finally {
        setIsImporting(false);
        e.target.value = null; // Reset input file
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Hàm tạo File Mẫu (Template) cho sếp tải về điền vào
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

  // Hàm xử lý copy ID khi click vào ô ID
  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Đổi lại icon sau 2 giây
  };

  return (
    <div className="p-6 font-nunito h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <PackagePlus className="text-amber-500" size={32} /> Kiểm Kê & Nhập
            Kho
          </h1>
          <p className="text-stone-500 font-medium">
            Cập nhật số lượng sách tồn kho hàng loạt bằng Excel.
          </p>
        </div>

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
            {isImporting ? "Đang xử lý..." : "Nhập Kho Bằng Excel"}
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isImporting}
            />
          </label>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm mã ID, Tên sách để lấy ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 sticky top-0 z-10">
              <tr className="text-stone-500 text-sm border-b border-stone-200">
                <th className="p-4 font-bold min-w-[200px]">
                  Mã Sách (ID - Dùng copy vào Excel)
                </th>
                <th className="p-4 font-bold">Tên Sách</th>
                <th className="p-4 font-bold text-center">Tồn kho hiện tại</th>
                <th className="p-4 font-bold text-center">Trạng thái bán</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <Loader2
                      className="animate-spin text-amber-500 mx-auto"
                      size={32}
                    />
                  </td>
                </tr>
              ) : volumes.length > 0 ? (
                volumes.map((vol) => (
                  <tr
                    key={vol.id}
                    className="border-b border-stone-100 hover:bg-stone-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* Rút gọn ID cho đỡ dài, hover chuột vào sẽ thấy full */}
                        <span
                          className="font-mono text-xs text-stone-500 truncate w-24"
                          title={vol.id}
                        >
                          {vol.id}
                        </span>
                        <button
                          onClick={() => handleCopy(vol.id)}
                          className="p-1.5 hover:bg-amber-100 hover:text-amber-600 text-stone-400 rounded-md transition-colors shadow-sm bg-white border border-stone-200"
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
                    <td className="p-4">
                      <p className="font-bold text-stone-800">
                        {vol.title ||
                          `${vol.series?.title} - Tập ${vol.volumeNumber}`}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          vol.stock > 20
                            ? "bg-green-100 text-green-700"
                            : vol.stock > 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
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
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-stone-500 font-bold"
                  >
                    Không tìm thấy sách nào!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COMPONENT PHÂN TRANG */}
        {!loading && totalPages > 1 && (
          <div className="bg-white border-t border-stone-200 p-4 flex items-center justify-between mt-auto">
            <span className="text-sm font-bold text-stone-500">
              Trang {currentPage} / {totalPages} (Tổng {totalItems} sách)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
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
                    className={`w-10 h-10 rounded-lg font-black transition-colors ${
                      currentPage === pageNum
                        ? "bg-amber-500 text-stone-900 shadow-sm"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                  currentPage === totalPages
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
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
