"use client";
import { useState, useEffect } from "react";
import { getCollections, createCollection, updateCollection, deleteCollection } from "../../api";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge } from "../../components/ui";
import { Plus } from "lucide-react";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCollections();
      setCollections(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (collection = null) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this collection and its images?")) {
      try {
        await deleteCollection(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingCollection) {
        await updateCollection(editingCollection._id, data);
      } else {
        await createCollection(data);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "order", label: "Order" },
    {
      key: "isActive",
      label: "Active",
      render: (val) => <StatusBadge value={val} />
    }
  ];

  const formFields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "order", label: "Order", type: "number" },
    { name: "isActive", label: "Is Active", type: "toggle" }
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Collections" description="Create a collection first, then add images on Collection Images.">
        <button onClick={() => handleOpenModal()} className="admin-btn-primary"><Plus size={18} /> Add collection</button>
      </PageToolbar>
      
      <DataTable 
        columns={columns} 
        data={collections} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollection ? "Edit Collection" : "Add Collection"}
        fields={formFields}
        initialData={editingCollection}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
