"use client";
import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, getBespokeCollections } from "../../api";
import { resolveImage } from "../../utils";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import { PageToolbar, StatusBadge, EmptyThumb } from "../../components/ui";
import { Plus } from "lucide-react";

const DEFAULT_BESPOKE_OPTIONS = [
  ["PRINTS", "Choose your Colour"],
  ["PRINTS", "Choose your Boota"],
  ["PRINTS", "Choose your Jaal"],
  ["PRINTS", "Choose your Border"],
  ["SAREE HIGHLIGHTS", "Choose your Embroidery"],
  ["SAREE HIGHLIGHTS", "Choose your Chaam"],
  ["BLOUSE STITCHING", "Same Design"],
  ["BLOUSE STITCHING", "Front Design"],
  ["BLOUSE STITCHING", "Back Design"],
  ["BLOUSE STITCHING", "Sleeve's Design"],
  ["BLOUSE HIGHLIGHTS", "Choose your Embroidery"],
  ["BLOUSE HIGHLIGHTS", "Choose your Chaam"],
].map(([section, title]) => ({ section, title, price: 1000, allowAsIs: true, choices: [] }));

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bespokeCollections, setBespokeCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const fetchData = async () => {
    try {
      const [prodRes, catRes, bespokeRes] = await Promise.all([getProducts(), getCategories(), getBespokeCollections()]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setBespokeCollections(bespokeRes.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Promise.all([getProducts(), getCategories(), getBespokeCollections()])
      .then(([prodRes, catRes, bespokeRes]) => {
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
        setBespokeCollections(bespokeRes.data || []);
      })
      .catch((error) => console.error(error));
  }, []);

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
    if (!payload.bespokeCollection || payload.bespokeCollection === "none") {
      delete payload.bespokeCollection;
      delete payload.bespokeOptions;
    }
    else payload.bespokeOptions = payload.bespokeOptions || [];
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
      render: (val, row) => {
        const img = val || row.variants?.[0]?.images?.[0];
        return img ? <img src={resolveImage(img)} alt="" className="h-12 w-12 rounded-lg object-cover object-top" /> : <EmptyThumb />;
      },
    },
    { key: "title", label: "Title", render: (val, row) => <div><p className="font-medium text-white">{val}</p><p className="text-xs" style={{ color: "var(--text-muted)" }}>{row.category?.title}</p></div> },
    { key: "designerName", label: "Designer", render: (val) => val || "—" },
    { key: "bespokeCollection", label: "Bespoke collection", render: (val) => bespokeCollections.find((collection) => collection._id === (val?._id || val))?.title || "—" },
    { key: "currentPrice", label: "Price", render: (val) => `₹${val?.toLocaleString("en-IN")}` },
    { key: "discountPercentage", label: "Discount", render: (val) => val ? `${val}%` : "—" },
    { key: "showInHomePage", label: "Homepage", render: (val) => <StatusBadge value={val} /> },
  ];

  const formFields = [
    { name: "category", label: "Category", type: "select", options: categories.map((c) => ({ label: c.title, value: c._id })), required: true },
    { name: "bespokeCollection", label: "Bespoke collection", type: "select", options: [{ label: "Not a bespoke product", value: "none" }, ...bespokeCollections.map((c) => ({ label: c.title, value: c._id }))] },
    { name: "bespokeOptions", label: "Bespoke customization choices", type: "bespokeOptions" },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "imageUrl", label: "Primary image", type: "image", aspectRatio: 336 / 505 },
    { name: "subtitle", label: "Subtitle", type: "text" },
    { name: "designerName", label: "Designer name", type: "text" },
    { name: "productCode", label: "Product code", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "shippingInfo", label: "Shipping information", type: "textarea" },
    { name: "disclaimer", label: "Disclaimer", type: "textarea" },
    { name: "supplierInfo", label: "Supplier information", type: "textarea" },
    { name: "tags", label: "Tags", type: "tags", placeholder: "trending, new" },
    { name: "variants", label: "Color variants & pricing", type: "variants" },
    { name: "sizes", label: "Sizes", type: "text", placeholder: "XS, S, M, L, XL" },
    { name: "bottomSizes", label: "Bottom sizes", type: "text" },
    { name: "addons", label: "Add-ons", type: "addons" },
    { name: "customTailoringEnabled", label: "Custom tailoring enabled", type: "toggle" },
    { name: "customTailoringPrice", label: "Custom tailoring price (₹)", type: "number" },
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
          bespokeCollection: editingProduct.bespokeCollection?._id || editingProduct.bespokeCollection || "none",
          sizes: Array.isArray(editingProduct.sizes) ? editingProduct.sizes.join(", ") : editingProduct.sizes,
          bottomSizes: Array.isArray(editingProduct.bottomSizes) ? editingProduct.bottomSizes.join(", ") : editingProduct.bottomSizes,
        } : { customTailoringEnabled: true, addons: [], bespokeCollection: "none", bespokeOptions: DEFAULT_BESPOKE_OPTIONS }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
