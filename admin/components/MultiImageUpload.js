import { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../api';

export default function MultiImageUpload({ value = [], onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (!imageFiles.length) {
      setError('Please select valid image files');
      return;
    }
    try {
      setIsUploading(true);
      setError('');
      const newUrls = [];
      for (const file of imageFiles) {
        const data = await uploadImage(file);
        if (data.url || data.imageUrl) newUrls.push(data.url || data.imageUrl);
      }
      onChange([...value, ...newUrls]);
    } catch {
      setError('Failed to upload some images');
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" />
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6" style={{ borderColor: 'var(--border-color)', background: 'var(--input-bg)' }}>
          {isUploading ? (
            <>
              <Loader2 size={26} className="animate-spin" style={{ color: 'var(--primary-teal)' }} />
              <p className="text-sm" style={{ color: 'var(--primary-teal)' }}>Uploading...</p>
            </>
          ) : (
            <>
              <UploadCloud size={22} style={{ color: 'var(--primary-teal)' }} />
              <p className="text-sm text-white">Click or drag images</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Select multiple files</p>
            </>
          )}
        </div>
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((url, index) => (
            <div key={index} className="group relative aspect-[2/3] overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} className="absolute right-2 top-2 hidden rounded-full bg-[var(--danger)] p-1 text-white group-hover:block">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
