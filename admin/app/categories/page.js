"use client";
import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge, EmptyThumb } from "../../components/ui";
import { Plus } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try { setCategories((await getCategories()).data || []); } catch (error) { console.error(error); }
  };

  const handleOpenModal = (category = null) => { setEditingCategory(category); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try { await deleteCategory(id); fetchData(); } catch (error) { console.error(error); }
    }
  };

  const handleSubmit = async (data) => {
    if (editingCategory) await updateCategory(editingCategory._id, data);
    else await createCategory(data);
    setIsModalOpen(false);
    fetchData();
  };

  const columns = [
    { key: "imageUrl", label: "Image", render: (val) => val ? <img src={resolveImage(val)} alt="" className="h-12 w-12 rounded-lg object-cover object-top" /> : <EmptyThumb /> },
    { key: "title", label: "Title" },
    { key: "showInHomePage", label: "Homepage", render: (val) => <StatusBadge value={val} /> },
    { key: "bulkShow", label: "Bulk show", render: (val) => <StatusBadge value={val} /> },
    { key: "homePageOrder", label: "Order" },
  ];

  const formFields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "imageUrl", label: "Category image", type: "image", required: true, aspectRatio: 4 / 5 },
    { name: "showInHomePage", label: "Show on homepage", type: "toggle" },
    { name: "bulkShow", label: "Bulk show all items on homepage", type: "toggle" },
    { name: "homePageOrder", label: "Homepage order", type: "number" },
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Categories" description="Organize the storefront catalog.">
        <button onClick={() => handleOpenModal()} className="admin-btn-primary"><Plus size={18} /> Add category</button>
      </PageToolbar>
      <DataTable columns={columns} data={categories} onEdit={handleOpenModal} onDelete={handleDelete} />
      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? "Edit category" : "Add category"} fields={formFields} initialData={editingCategory} onSubmit={handleSubmit} />
    </div>
  );
}
