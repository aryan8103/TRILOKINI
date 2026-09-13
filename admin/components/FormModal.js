import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "./ImageUpload";
import ToggleSwitch from "./ToggleSwitch";
import MultiImageUpload from "./MultiImageUpload";

function AddonsEditor({ value = [], onChange }) {
  const addons = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-4">
      {addons.map((addon, index) => (
        <div key={index} className="relative rounded-xl border border-[var(--border-color)] bg-[var(--card-elevated)] p-4">
          <button type="button" onClick={() => onChange(addons.filter((_, i) => i !== index))} className="absolute right-3 top-3 text-[var(--danger)] hover:bg-[rgba(239,68,68,0.1)] p-1.5 rounded-lg transition-colors" aria-label="Remove addon">
            <Trash2 size={16} />
          </button>
          <div className="grid grid-cols-2 gap-4 pr-10">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1.5 block">Name</label>
              <input className="admin-input" value={addon.name || ""} onChange={(e) => {
                const next = [...addons];
                next[index] = { ...addon, name: e.target.value };
                onChange(next);
              }} />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1.5 block">Price (₹)</label>
              <input type="number" className="admin-input" value={addon.price ?? ""} onChange={(e) => {
                const next = [...addons];
                next[index] = { ...addon, price: Number(e.target.value) };
                onChange(next);
              }} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-white">
            <ToggleSwitch checked={!!addon.hasSizes} onChange={(c) => {
              const next = [...addons];
              next[index] = { ...addon, hasSizes: c, sizes: addon.sizes || ["XS", "S", "M", "L", "XL"] };
              onChange(next);
            }} />
            <span>Has sizes</span>
          </div>
          {addon.hasSizes ? (
            <div className="mt-3">
              <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1.5 block">Sizes (comma separated)</label>
              <input
                className="admin-input"
                placeholder="XS, S, M, L, XL"
                value={typeof addon.sizes === "string" ? addon.sizes : (addon.sizes || []).join(", ")}
                onChange={(e) => {
                  const next = [...addons];
                  next[index] = { ...addon, sizes: e.target.value };
                  onChange(next);
                }}
              />
            </div>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...addons, { name: "", price: 0, hasSizes: false, sizes: [] }])}
        className="w-full py-3 rounded-xl border border-dashed border-[var(--primary)] text-[var(--primary)] flex items-center justify-center gap-2 text-sm hover:bg-[rgba(124,109,250,0.05)] transition-colors font-medium"
      >
        <Plus size={16} /> Add addon
      </button>
    </div>
  );
}

export default function FormModal({ isOpen, onClose, title, fields, initialData = null, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (initialData) {
        setFormData(initialData);
      } else {
        const defaultData = {};
        fields.forEach((field) => {
          if (field.type === "toggle") defaultData[field.name] = false;
          else if (field.type === "variants" || field.type === "addons") defaultData[field.name] = [];
          else defaultData[field.name] = "";
        });
        setFormData(defaultData);
      }
    }
  }, [isOpen, initialData, fields]);

  const handleChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingRequired = fields.find((f) => f.required && (formData[f.name] === undefined || formData[f.name] === null || formData[f.name] === ""));
    if (missingRequired) {
      setError(`Please fill out: ${missingRequired.label}`);
      return;
    }
    setIsSubmitting(true);
    const sanitizedData = { ...formData };
    fields.forEach((field) => {
      if (field.type === "number" && (sanitizedData[field.name] === "" || sanitizedData[field.name] === undefined)) {
        delete sanitizedData[field.name];
      }
      if (field.type === "tags" && typeof sanitizedData[field.name] === "string") {
        sanitizedData[field.name] = sanitizedData[field.name].split(",").map((t) => t.trim()).filter(Boolean);
      }
    });

    if (sanitizedData.addons && Array.isArray(sanitizedData.addons)) {
      sanitizedData.addons = sanitizedData.addons.map(addon => {
        if (typeof addon.sizes === "string") {
          return { ...addon, sizes: addon.sizes.split(",").map(s => s.trim()).filter(Boolean) };
        }
        return addon;
      });
    }

    try {
      await onSubmit(sanitizedData);
      onClose();
    } catch (err) {
      setError(err.message || "Form submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    if (field.type === "textarea") {
      return (
        <textarea required={field.required} value={formData[field.name] || ""} onChange={(e) => handleChange(field.name, e.target.value)} className="admin-input min-h-[96px] resize-y" placeholder={field.placeholder} />
      );
    }
    if (field.type === "select") {
      return (
        <select required={field.required} value={formData[field.name] || ""} onChange={(e) => handleChange(field.name, e.target.value)} className="admin-input">
          <option value="" disabled>Select {field.label}</option>
          {field.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      );
    }
    if (field.type === "image") {
      return <ImageUpload value={formData[field.name]} onChange={(url) => handleChange(field.name, url)} aspectRatio={field.aspectRatio} />;
    }
    if (field.type === "toggle") {
      return <ToggleSwitch checked={!!formData[field.name]} onChange={(checked) => handleChange(field.name, checked)} />;
    }
    if (field.type === "addons") {
      return <AddonsEditor value={formData[field.name]} onChange={(v) => handleChange(field.name, v)} />;
    }
    if (field.type === "tags") {
      return (
        <div>
          <input
            type="text"
            required={field.required}
            value={Array.isArray(formData[field.name]) ? formData[field.name].join(", ") : (formData[field.name] || "")}
            placeholder={field.placeholder || "trending, new"}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="admin-input"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1.5">Comma separated list of tags</p>
        </div>
      );
    }
    if (field.type === "variants") {
      return (
        <div className="space-y-4">
          {(formData[field.name] || []).map((variant, index) => (
            <div key={index} className="relative rounded-xl border border-[var(--border-color)] bg-[var(--card-elevated)] p-4 space-y-4">
              <button type="button" onClick={() => {
                const next = [...formData[field.name]];
                next.splice(index, 1);
                handleChange(field.name, next);
              }} className="absolute right-3 top-3 text-[var(--danger)] hover:bg-[rgba(239,68,68,0.1)] p-1.5 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
              
              <div className="pr-10">
                <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1.5 block">Color / tone *</label>
                <input type="text" required value={variant.color || ""} onChange={(e) => {
                  const next = [...formData[field.name]];
                  next[index].color = e.target.value;
                  handleChange(field.name, next);
                }} className="admin-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1.5 block">Current price *</label>
                  <input type="number" required value={variant.currentPrice || ""} onChange={(e) => {
                    const next = [...formData[field.name]];
                    next[index].currentPrice = Number(e.target.value);
                    handleChange(field.name, next);
                  }} className="admin-input" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1.5 block">Previous price</label>
                  <input type="number" value={variant.previousPrice || ""} onChange={(e) => {
                    const next = [...formData[field.name]];
                    next[index].previousPrice = e.target.value ? Number(e.target.value) : undefined;
                    handleChange(field.name, next);
                  }} className="admin-input" />
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1.5 block">Images</label>
                <MultiImageUpload value={variant.images || []} onChange={(urls) => {
                  const next = [...formData[field.name]];
                  next[index].images = urls;
                  handleChange(field.name, next);
                }} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => handleChange(field.name, [...(formData[field.name] || []), { color: "", images: [], currentPrice: "" }])} className="w-full py-3 rounded-xl border border-dashed border-[var(--primary)] text-[var(--primary)] flex items-center justify-center gap-2 text-sm hover:bg-[rgba(124,109,250,0.05)] transition-colors font-medium">
            <Plus size={16} /> Add variant
          </button>
        </div>
      );
    }
    return (
      <input
        type={field.type || "text"}
        required={field.required}
        value={formData[field.name] || ""}
        placeholder={field.placeholder}
        onChange={(e) => handleChange(field.name, field.type === "number" ? Number(e.target.value) : e.target.value)}
        className="admin-input"
      />
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex max-h-[90vh] w-full max-w-2xl mx-4 flex-col overflow-hidden rounded-2xl shadow-2xl bg-[var(--card-bg)] border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar">
              <form id="admin-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                {fields.filter(f => {
                  if (f.name === "customTailoringPrice") {
                    return !!formData.customTailoringEnabled;
                  }
                  return true;
                }).map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1.5">
                      {field.label} {field.required && <span className="text-[var(--danger)]">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
                {error && <p className="text-sm text-[var(--danger)] bg-[rgba(239,68,68,0.1)] p-3 rounded-lg border border-[rgba(239,68,68,0.2)]">{error}</p>}
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-color)] bg-[rgba(0,0,0,0.15)]">
              <button type="button" onClick={onClose} className="admin-btn-ghost">Cancel</button>
              <button type="submit" form="admin-form" disabled={isSubmitting} className="admin-btn-primary min-w-[128px]">
                {isSubmitting ? "Saving..." : initialData?._id ? "Save changes" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
