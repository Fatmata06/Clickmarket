import { useState } from "react";
import { toast } from "sonner";

interface UseImageUploadReturn {
  imageFiles: File[];
  previewImages: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
  setPreviewImages: React.Dispatch<React.SetStateAction<string[]>>;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

/**
 * Hook pour gérer l'upload et la prévisualisation d'images
 * @param maxImages - Nombre maximum d'images autorisées (par défaut 5)
 */
export function useImageUpload(maxImages: number = 5): UseImageUploadReturn {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Vérifier le nombre total d'images
    if (imageFiles.length + files.length > maxImages) {
      toast.error(`Vous ne pouvez ajouter que ${maxImages} images maximum`);
      return;
    }

    // Créer des previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviewImages((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setPreviewImages([]);
    setImageFiles([]);
  };

  return {
    imageFiles,
    previewImages,
    handleImageChange,
    removeImage,
    clearImages,
    setPreviewImages,
    setImageFiles,
  };
}
