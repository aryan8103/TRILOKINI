import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import getCroppedImg from "../utils/cropImage";

export default function ImageCropperModal({ imageSrc, onCropDone, onCropCancel, aspectRatio }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedBlob);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl" style={{ maxHeight: "90vh", background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <h3 className="text-lg font-semibold text-white">Crop image</h3>
          <button onClick={onCropCancel} className="rounded-full p-1" style={{ color: "var(--text-muted)" }} disabled={isProcessing}>
            <X size={20} />
          </button>
        </div>

        <div className="relative w-full bg-black" style={{ height: "50vh", minHeight: "360px" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="contain"
          />
        </div>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-4">
            <ZoomOut size={20} style={{ color: "var(--text-muted)" }} />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg"
              style={{ accentColor: "var(--primary-teal)", background: "var(--border-color)" }}
            />
            <ZoomIn size={20} style={{ color: "var(--text-muted)" }} />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onCropCancel} className="admin-btn-ghost" disabled={isProcessing}>Cancel</button>
            <button type="button" onClick={handleSave} disabled={isProcessing} className="admin-btn-primary">
              {isProcessing ? "Processing..." : "Crop & upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
