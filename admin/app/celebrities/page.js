"use client";
import { useState, useEffect } from "react";
import { getCelebrities, createCelebrity, updateCelebrity, deleteCelebrity } from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge, EmptyThumb } from "../../components/ui";
import { Plus } from "lucide-react";

export default function CelebritiesPage() {
  const [celebrities, setCelebrities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCelebrity, setEditingCelebrity] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCelebrities();
      setCelebrities(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (celebrity = null) => {
    setEditingCelebrity(celebrity);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this celebrity?")) {
      try {
        await deleteCelebrity(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingCelebrity) {
        await updateCelebrity(editingCelebrity._id, data);
      } else {
        await createCelebrity(data);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Image",
      render: (val) => val ? <img src={resolveImage(val)} alt="Celebrity" className="w-12 h-16 rounded object-cover object-top" /> : <EmptyThumb className="w-12 h-16 rounded" />
    },
    { key: "name", label: "Name" },
    { key: "subtitle", label: "Subtitle" },
    { key: "order", label: "Order" },
    {
      key: "isActive",
      label: "Active",
      render: (val) => <StatusBadge value={val} />
    }
  ];

  const formFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "imageUrl", label: "Image URL", type: "image", required: true, aspectRatio: 2/3 },
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "profileUrl", label: "Profile Link", type: "text" },
    { name: "order", label: "Order", type: "number" },
    { name: "isActive", label: "Is Active", type: "toggle" }
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Celebrities" description="Looks and profiles shown on the homepage.">
        <button onClick={() => handleOpenModal()} className="admin-btn-primary"><Plus size={18} /> Add celebrity</button>
      </PageToolbar>
      
      <DataTable 
        columns={columns} 
        data={celebrities} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCelebrity ? "Edit Celebrity" : "Add Celebrity"}
        fields={formFields}
        initialData={editingCelebrity}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
