"use client";
import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge, EmptyThumb } from "../../components/ui";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try { await deleteProduct(id); fetchData(); } catch (error) { console.error(error); }
    }
  };

  const handleSubmit = async (data) => {
    const payload = { ...data };
    if (typeof payload.sizes === "string" && payload.sizes) {
      payload.sizes = payload.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (typeof payload.bottomSizes === "string" && payload.bottomSizes) {
      payload.bottomSizes = payload.bottomSizes.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (editingProduct) await updateProduct(editingProduct._id, payload);
    else await createProduct(payload);
    setIsModalOpen(false);
    fetchData();
  };

  const filteredProducts = selectedCategoryFilter
    ? products.filter((p) => p.category?._id === selectedCategoryFilter || p.category === selectedCategoryFilter)
    : products;

  const columns = [
    {
      key: "imageUrl",
      label: "Image",
      render: (val) => val ? <img src={resolveImage(val)} alt="" className="h-12 w-12 rounded-lg object-cover object-top" /> : <EmptyThumb />,
    },
    { key: "title", label: "Title", render: (val, row) => <div><p className="font-medium text-white">{val}</p><p className="text-xs" style={{ color: "var(--text-muted)" }}>{row.category?.title}</p></div> },
    { key: "designerName", label: "Designer", render: (val) => val || "—" },
    { key: "currentPrice", label: "Price", render: (val) => `₹${val?.toLocaleString("en-IN")}` },
    { key: "discountPercentage", label: "Discount", render: (val) => val ? `${val}%` : "—" },
    { key: "showInHomePage", label: "Homepage", render: (val) => <StatusBadge value={val} /> },
  ];

  const formFields = [
    { name: "category", label: "Category", type: "select", options: categories.map((c) => ({ label: c.title, value: c._id })), required: true },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "designerName", label: "Designer name", type: "text" },
    { name: "productCode", label: "Product code", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "shippingInfo", label: "Shipping information", type: "textarea" },
    { name: "disclaimer", label: "Disclaimer", type: "textarea" },
    { name: "tags", label: "Tags", type: "tags", placeholder: "trending, new" },
    { name: "variants", label: "Color variants & pricing", type: "variants" },
    { name: "sizes", label: "Sizes", type: "text", placeholder: "XS, S, M, L, XL" },
    { name: "bottomSizes", label: "Bottom sizes", type: "text" },
    { name: "addons", label: "Add-ons", type: "addons" },
    { name: "customTailoringEnabled", label: "Custom tailoring enabled", type: "toggle" },
    { name: "showInHomePage", label: "Show on homepage", type: "toggle" },
    { name: "homePageOrder", label: "Homepage order", type: "number" },
  ];

  return (
    <div className="space-y-6">
      <PageToolbar title="Products" description="Catalog, pricing, sizes and add-ons.">
        <select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)} className="admin-input sm:w-52">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <button onClick={() => handleOpenModal()} className="admin-btn-primary"><Plus size={18} /> Add product</button>
      </PageToolbar>

      <DataTable columns={columns} data={filteredProducts} onEdit={handleOpenModal} onDelete={handleDelete} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit product" : "Add product"}
        fields={formFields}
        initialData={editingProduct ? {
          ...editingProduct,
          category: editingProduct.category?._id || editingProduct.category,
          sizes: Array.isArray(editingProduct.sizes) ? editingProduct.sizes.join(", ") : editingProduct.sizes,
          bottomSizes: Array.isArray(editingProduct.bottomSizes) ? editingProduct.bottomSizes.join(", ") : editingProduct.bottomSizes,
        } : { customTailoringEnabled: true, addons: [] }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
