import { useState } from "react";
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, X, GripHorizontal } from "lucide-react";

export default function DataTable({ columns, data, onEdit, onDelete, onToggle, toggleField = "isActive", onReorder }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    return Object.values(item).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (onReorder && draggedItemIndex !== null && draggedItemIndex !== targetIndex) {
      onReorder(draggedItemIndex, targetIndex, paginatedData);
    }
    setDraggedItemIndex(null);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--border-color)] flex flex-col">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="admin-input pl-10"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          Showing {paginatedData.length} of {filteredData.length} entries
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[rgba(0,0,0,0.25)]">
            <tr>
              {!!onReorder && <th className="px-5 py-3.5 border-b border-[var(--border-color)] w-10"></th>}
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-5 py-3.5 text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold border-b border-[var(--border-color)]"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-5 py-3.5 text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold text-right border-b border-[var(--border-color)]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row._id || rowIndex}
                  className="hover:bg-[rgba(255,255,255,0.025)] border-b border-[#1e2640] transition-colors"
                  style={{
                    cursor: onReorder ? 'grab' : 'default',
                    opacity: draggedItemIndex === rowIndex ? 0.5 : 1
                  }}
                  draggable={!!onReorder}
                  onDragStart={(e) => handleDragStart(e, rowIndex)}
                  onDragOver={(e) => handleDragOver(e, rowIndex)}
                  onDrop={(e) => handleDrop(e, rowIndex)}
                >
                  {!!onReorder && (
                    <td className="px-5 py-3.5 text-center align-middle text-[var(--text-muted)]">
                      <GripHorizontal size={16} className="cursor-grab opacity-50 hover:opacity-100 mx-auto" />
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-5 py-3.5 text-sm text-[#e2e8f0] align-middle">
                      {col.render ? col.render(row[col.key], row) : (
                        col.key === toggleField && onToggle ? (
                           row[col.key] ? "Yes" : "No"
                        ) : (
                          <div className="max-w-xs truncate" title={row[col.key]}>
                            {row[col.key]}
                          </div>
                        )
                      )}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-5 py-3.5 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded-lg bg-[rgba(124,109,250,0.12)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this item?")) {
                                onDelete(row._id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[rgba(239,68,68,0.1)] hover:bg-[var(--danger)] text-[var(--danger)] hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0) + (onReorder ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-[var(--text-muted)]">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No results found</p>
                    {searchTerm && <p className="text-sm mt-1">Try adjusting your search query</p>}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3.5 border-t border-[var(--border-color)] flex items-center justify-between">
          <div className="text-sm text-[var(--text-muted)]">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm bg-transparent border border-[var(--border-color)] text-[var(--text-muted)] disabled:opacity-50 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                    currentPage === i + 1 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-transparent border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm bg-transparent border border-[var(--border-color)] text-[var(--text-muted)] disabled:opacity-50 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
