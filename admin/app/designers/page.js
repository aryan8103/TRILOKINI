"use client";
import { useState, useEffect } from "react";
import { getDesigners, createDesigner, updateDesigner, deleteDesigner } from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge, EmptyThumb } from "../../components/ui";
import { Plus } from "lucide-react";

export default function DesignersPage() {
  const [designers, setDesigners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesigner, setEditingDesigner] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDesigners();
      setDesigners(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (designer = null) => {
    setEditingDesigner(designer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this designer?")) {
      try {
        await deleteDesigner(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingDesigner) {
        await updateDesigner(editingDesigner._id, data);
      } else {
        await createDesigner(data);
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
      render: (val) => val ? <img src={resolveImage(val)} alt="Designer" className="w-12 h-12 rounded-full object-cover object-top" /> : <EmptyThumb className="w-12 h-12 rounded-full" />
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
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "imageUrl", label: "Designer Image", type: "image", aspectRatio: 4/5 },
    { name: "showInHomePage", label: "Show in Homepage", type: "toggle" },
    { name: "order", label: "Order", type: "number" },
    { name: "isActive", label: "Is Active", type: "toggle" }
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Designers" description="Featured designers on the storefront.">
        <button onClick={() => handleOpenModal()} className="admin-btn-primary"><Plus size={18} /> Add designer</button>
      </PageToolbar>
      
      <DataTable 
        columns={columns} 
        data={designers} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDesigner ? "Edit Designer" : "Add Designer"}
        fields={formFields}
        initialData={editingDesigner}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
