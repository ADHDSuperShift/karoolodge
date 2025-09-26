import React, { useState } from 'react';
import { uploadFile } from '../utils/uploadFile';

interface ImageUploaderProps {
  onUpload?: (url: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, 'backgrounds');
    setPreview(url);
    if (onUpload) {
      onUpload(url);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {preview && (
        <div style={{ marginTop: '10px' }}>
          <img src={preview} alt="Uploaded preview" style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  );
}
