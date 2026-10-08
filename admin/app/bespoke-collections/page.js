"use client";
import { useEffect, useState } from "react";
import {
  createBespokeCollection,
  deleteBespokeCollection,
  getBespokeCollections,
  updateBespokeCollection,
} from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { EmptyThumb, PageToolbar, StatusBadge } from "../../components/ui";
import { Plus } from "lucide-react";

export default function BespokeCollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getBespokeCollections();
      setCollections(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBespokeCollections()
      .then((response) => setCollections(response.data || []))
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this bespoke collection? Assigned products will be unlinked.")) return;
    try {
      await deleteBespokeCollection(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data) => {
    if (editingCollection) await updateBespokeCollection(editingCollection._id, data);
    else await createBespokeCollection(data);
    setIsModalOpen(false);
    fetchData();
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Cover image",
      render: (value) => value
        ? <img src={resolveImage(value)} alt="" className="h-14 w-12 rounded object-cover" />
        : <EmptyThumb className="h-14 w-12" />,
    },
    { key: "title", label: "Name" },
    { key: "order", label: "Order" },
    { key: "isActive", label: "Active", render: (value) => <StatusBadge value={value} /> },
  ];

  const fields = [
    { name: "title", label: "Collection name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "imageUrl", label: "Collection cover image", type: "image", required: true, aspectRatio: 4 / 5 },
    { name: "order", label: "Display order", type: "number" },
    { name: "isActive", label: "Active", type: "toggle" },
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Bespoke collections" description="Create a collection, then assign bespoke products to it.">
        <button
          type="button"
          onClick={() => { setEditingCollection(null); setIsModalOpen(true); }}
          className="admin-btn-primary"
        >
          <Plus size={18} /> Add collection
        </button>
      </PageToolbar>

      <DataTable columns={columns} data={collections} onEdit={(item) => { setEditingCollection(item); setIsModalOpen(true); }} onDelete={handleDelete} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollection ? "Edit bespoke collection" : "Add bespoke collection"}
        fields={fields}
        initialData={editingCollection}
        onSubmit={handleSubmit}
      />
    </div>
  );
}