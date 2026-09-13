"use client";
import { useState, useEffect } from "react";
import {
  getCollectionImages,
  createCollectionImage,
  updateCollectionImage,
  deleteCollectionImage,
  getCollections,
} from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge, EmptyThumb } from "../../components/ui";
import { Plus } from "lucide-react";

const POSITION_OPTIONS = [
  { label: "1 — Wide top (desktop left / mobile full)", value: 1 },
  { label: "2 — Portrait", value: 2 },
  { label: "3 — Portrait", value: 3 },
  { label: "4 — Portrait", value: 4 },
  { label: "5 — Portrait", value: 5 },
  { label: "6 — Wide bottom (desktop right / mobile full)", value: 6 },
];

export default function CollectionImagesPage() {
  const [images, setImages] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [imageRes, collectionRes] = await Promise.all([
        getCollectionImages(),
        getCollections(),
      ]);
      setImages(imageRes.data || []);
      setCollections(collectionRes.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (image = null) => {
    setEditingImage(image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this collection image?")) {
      try {
        await deleteCollectionImage(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        position: Number(data.position),
      };
      if (editingImage) {
        await updateCollectionImage(editingImage._id, payload);
      } else {
        await createCollectionImage(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredImages = selectedCollectionFilter
    ? images.filter((item) => item.collection?._id === selectedCollectionFilter || item.collection === selectedCollectionFilter)
    : images;

  const columns = [
    {
      key: "imageUrl",
      label: "Image",
      render: (val) => val ? <img src={resolveImage(val)} alt="Collection" className="w-20 h-16 rounded object-cover object-top" /> : <EmptyThumb className="w-20 h-16 rounded" />
    },
    {
      key: "collection",
      label: "Collection",
      render: (val) => val?.title || "—"
    },
    { key: "position", label: "Position" },
    {
      key: "isActive",
      label: "Active",
      render: (val) => <StatusBadge value={val} />
    }
  ];

  const formFields = [
    {
      name: "collection",
      label: "Collection",
      type: "select",
      options: collections.map((c) => ({ label: c.title, value: c._id })),
      required: true
    },
    { name: "imageUrl", label: "Image", type: "image", required: true, aspectRatio: 686 / 506 },
    {
      name: "position",
      label: "Position in collection",
      type: "select",
      options: POSITION_OPTIONS.map((opt) => ({ label: opt.label, value: String(opt.value) })),
      required: true
    },
    { name: "href", label: "Link URL", type: "text" },
    { name: "isActive", label: "Is Active", type: "toggle" }
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Collection images" description="Grid images for each collection.">
        <select value={selectedCollectionFilter} onChange={(e) => setSelectedCollectionFilter(e.target.value)} className="admin-input sm:w-52">
          <option value="">All collections</option>
          {collections.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <button onClick={() => handleOpenModal()} className="admin-btn-primary"><Plus size={18} /> Add image</button>
      </PageToolbar>
      
      <DataTable 
        columns={columns} 
        data={filteredImages} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingImage ? "Edit Collection Image" : "Add Collection Image"}
        fields={formFields}
        initialData={editingImage ? {
          ...editingImage,
          collection: editingImage.collection?._id || editingImage.collection,
          position: String(editingImage.position)
        } : null}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
