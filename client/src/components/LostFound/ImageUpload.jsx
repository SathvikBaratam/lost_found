import { useState } from "react";
import "./styles/ImageUpload.css";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ImageUpload({ onUploaded }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const storageRef = ref(storage, `items/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    onUploaded(url);
    setUploading(false);
  };

  return (
    <div className="image-upload">
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && <img src={preview} alt="preview" />}
      {uploading && <span>Uploading...</span>}
    </div>
  );
}
