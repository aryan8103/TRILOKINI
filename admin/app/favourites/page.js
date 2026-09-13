"use client";
import { useState, useEffect } from "react";
import { getFavourites, createFavourite, updateFavourite, deleteFavourite } from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge, EmptyThumb } from "../../components/ui";
import { Plus } from "lucide-react";

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFavourite, setEditingFavourite] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getFavourites();
      setFavourites(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (favourite = null) => {
    setEditingFavourite(favourite);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this favourite item?")) {
      try {
        await deleteFavourite(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingFavourite) {
        await updateFavourite(editingFavourite._id, data);
      } else {
        await createFavourite(data);
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
      render: (val) => val ? <img src={resolveImage(val)} alt="Favourite Item" className="w-20 h-16 rounded object-cover object-top" /> : <EmptyThumb className="w-20 h-16 rounded" />
    },
    { key: "position", label: "Position" },
    { key: "href", label: "Link URL" },
    {
      key: "isActive",
      label: "Active",
      render: (val) => <StatusBadge value={val} />
    },
    { key: "order", label: "Order" }
  ];

  const formFields = [
    { name: "imageUrl", label: "Image URL", type: "image", required: true },
    { name: "href", label: "Link URL", type: "text" },
    { 
      name: "position", 
      label: "Position", 
      type: "select", 
      options: [
        { label: "Left Large 1 (16:9)", value: "left_large_1" },
        { label: "Left Small 1 (4:5)", value: "left_small_1" },
        { label: "Left Small 2 (4:5)", value: "left_small_2" },
        { label: "Left Large 2 (16:9)", value: "left_large_2" },
        { label: "Left Small 3 (4:5)", value: "left_small_3" },
        { label: "Left Small 4 (4:5)", value: "left_small_4" },
        { label: "Right Tall (Flexible)", value: "right_tall" },
        { label: "Right Small 1 (4:5)", value: "right_small_1" },
        { label: "Right Small 2 (4:5)", value: "right_small_2" },
        { label: "Right Large 1 (16:9)", value: "right_large_1" },
        { label: "Mobile Banner (1:1)", value: "mobile" }
      ], 
      required: true 
    },
    { name: "order", label: "Order", type: "number" },
    { name: "isActive", label: "Is Active", type: "toggle" }
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Favourites" description="Homepage mosaic tiles and links.">
        <button onClick={() => handleOpenModal()} className="admin-btn-primary"><Plus size={18} /> Add favourite</button>
      </PageToolbar>
      
      <DataTable 
        columns={columns} 
        data={favourites} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFavourite ? "Edit Favourite" : "Add Favourite"}
        fields={formFields}
        initialData={editingFavourite}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
