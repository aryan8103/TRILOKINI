"use client";
import { useEffect, useState } from "react";
import { createGiftCard, deleteGiftCard, getGiftCards, updateGiftCard } from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { EmptyThumb, PageToolbar, StatusBadge } from "../../components/ui";
import { Plus } from "lucide-react";

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGiftCard, setEditingGiftCard] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getGiftCards();
      setGiftCards(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGiftCards()
      .then((response) => setGiftCards(response.data || []))
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this gift card?")) return;
    try {
      await deleteGiftCard(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data) => {
    const minAmount = Number(data.minAmount);
    const maxAmount = Number(data.maxAmount);
    if (maxAmount < minAmount) throw new Error("Maximum amount must be greater than or equal to minimum amount.");
    if (data.amounts.some((amount) => amount < minAmount || amount > maxAmount)) {
      throw new Error("Each gift card value must be within the minimum and maximum range.");
    }

    if (editingGiftCard) await updateGiftCard(editingGiftCard._id, data);
    else await createGiftCard(data);
    setIsModalOpen(false);
    setEditingGiftCard(null);
    fetchData();
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Card image",
      render: (value) => value
        ? <img src={resolveImage(value)} alt="" className="h-14 w-10 rounded object-cover" />
        : <EmptyThumb className="h-14 w-10" />,
    },
    { key: "title", label: "Gift card" },
    { key: "amounts", label: "Values", render: (values) => (values || []).map((value) => `₹${Number(value).toLocaleString("en-IN")}`).join(", ") || "—" },
    { key: "minAmount", label: "Min", render: (value) => `₹${Number(value).toLocaleString("en-IN")}` },
    { key: "maxAmount", label: "Max", render: (value) => `₹${Number(value).toLocaleString("en-IN")}` },
    { key: "order", label: "Order" },
    { key: "isActive", label: "Active", render: (value) => <StatusBadge value={value} /> },
  ];

  const fields = [
    { name: "title", label: "Gift card title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "imageUrl", label: "Gift card image", type: "image", required: true, aspectRatio: 244 / 366 },
    { name: "amounts", label: "Selectable values (₹)", type: "numberList", required: true, helpText: "Comma-separated denominations customers can select." },
    { name: "minAmount", label: "Minimum custom value (₹)", type: "number", required: true },
    { name: "maxAmount", label: "Maximum custom value (₹)", type: "number", required: true },
    { name: "order", label: "Display order", type: "number" },
    { name: "isActive", label: "Active", type: "toggle" },
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Gift cards" description="Manage the cards displayed in the storefront gift card listing.">
        <button type="button" onClick={() => { setEditingGiftCard(null); setIsModalOpen(true); }} className="admin-btn-primary">
          <Plus size={18} /> Add gift card
        </button>
      </PageToolbar>

      <DataTable
        columns={columns}
        data={giftCards}
        onEdit={(giftCard) => { setEditingGiftCard(giftCard); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingGiftCard(null); }}
        title={editingGiftCard ? "Edit gift card" : "Add gift card"}
        fields={fields}
        initialData={editingGiftCard ? { ...editingGiftCard, amounts: (editingGiftCard.amounts || []).join(", ") } : { amounts: "", isActive: true, order: 0 }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}