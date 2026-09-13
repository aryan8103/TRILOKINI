"use client";
import { useState, useEffect } from "react";
import { getWeddingItems, createWeddingItem, updateWeddingItem, deleteWeddingItem } from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge, EmptyThumb } from "../../components/ui";
import { Plus } from "lucide-react";

export default function WeddingPage() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getWeddingItems();
      setItems(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this wedding item?")) {
      try {
        await deleteWeddingItem(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingItem) {
        await updateWeddingItem(editingItem._id, data);
      } else {
        await createWeddingItem(data);
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
      render: (val, row) => val ? <img src={resolveImage(val)} alt="Wedding Item" className={`h-16 rounded object-cover object-top ${row.isWide ? 'w-32' : 'w-16'}`} /> : <EmptyThumb className="w-16 h-16 rounded" />
    },
    { key: "name", label: "Name" },
    { key: "subtitle", label: "Subtitle" },
    { 
      key: "isWide", 
      label: "Wide?", 
      render: (val) => <StatusBadge value={val} /> 
    },
    { key: "order", label: "Order" },
    {
      key: "isActive",
      label: "Active",
      render: (val) => <StatusBadge value={val} />
    }
  ];

  const formFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "imageUrl", label: "Image URL", type: "image", aspectRatio: 2/3, required: true },
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "href", label: "Link URL", type: "text" },
    { name: "order", label: "Order", type: "number" },
    { name: "isWide", label: "Is Wide Image", type: "toggle" },
    { name: "isActive", label: "Is Active", type: "toggle" }
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Wedding studio" description="Wedding looks and studio tiles.">
        <button onClick={() => handleOpenModal()} className="admin-btn-primary"><Plus size={18} /> Add wedding item</button>
      </PageToolbar>
      
      <DataTable 
        columns={columns} 
        data={items} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Wedding Item" : "Add Wedding Item"}
        fields={formFields}
        initialData={editingItem}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
