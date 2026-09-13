import { UploadCloud, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { uploadImage } from '../api';
import ImageCropperModal from './ImageCropperModal';

export default function ImageUpload({ value, onChange, aspectRatio }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    try {
      setIsUploading(true);
      setError('');
      const data = await uploadImage(file);
      onChange(data.url || data.imageUrl);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {imageToCrop && (
        <ImageCropperModal imageSrc={imageToCrop} onCropCancel={() => { setImageToCrop(null); setOriginalFile(null); }} onCropDone={() => {}} aspectRatio={aspectRatio} />
      )}
      {value ? (
        <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border-color)', background: 'var(--input-bg)' }}>
          <img src={value} alt="Uploaded preview" className="h-full w-full object-contain" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button type="button" onClick={() => onChange('')} className="rounded-full bg-[var(--danger)] p-2 text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" />
          <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8" style={{ borderColor: isUploading ? 'var(--primary-teal)' : 'var(--border-color)', background: 'var(--input-bg)' }}>
            {isUploading ? (
              <>
                <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary-teal)' }} />
                <p className="text-sm" style={{ color: 'var(--primary-teal)' }}>Uploading...</p>
              </>
            ) : (
              <>
                <div className="rounded-full p-3" style={{ background: 'rgba(94,234,212,0.08)' }}>
                  <UploadCloud size={22} style={{ color: 'var(--primary-teal)' }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white">Click or drag image to upload</p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>PNG, JPG or WEBP</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
