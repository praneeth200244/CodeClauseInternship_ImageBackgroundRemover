import { useState } from "react";
import "./App.css";
import oldImage from "./images/withBackground.png";
import newImage from "./images/withoutBackground.png";

export default function App() {
  const [uploadedImage, setUploadedImage] = useState(oldImage);
  console.log(uploadedImage);
  const [backgroundRemovedImage, setBackgroundRemovedImage] =
    useState(newImage);
  const [file, setFile] = useState(null);

  const handleImageUpload = (event) => {
    const uploadedFile = event.target.files[0];
    console.log(uploadedFile);
    if (uploadedFile) {
      setFile(uploadedFile);
      const imageUrl = URL.createObjectURL(uploadedFile);
      setUploadedImage(imageUrl);
    } else {
      console.error("No image uploaded");
    }
  };

  const removeBackground = async () => {
    const url = "https://api.remove.bg/v1.0/removebg";
    const apiKey = "tDQstR5KatnozVsg8ZMQ43Dr";

    const form = new FormData();
    form.append("image_file", file, file.name); 
    form.append("size", "auto");

    const options = {
      method: "POST",
      headers: {
        "X-api-key": apiKey,
      },
      body: form,
    };

    try {
      const response = await fetch(url, options);
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundRemovedImage(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error removing background:", error);
      alert(
        "An error occurred while removing the background. Please try again later."
      );
    }
  };

  const handleImageDownload = () => {
    if (backgroundRemovedImage) {
      const a = document.createElement("a");
      a.href = backgroundRemovedImage;
      a.download = "background_removed_image.png";

      a.click();
    } else {
      console.error("No background-removed image available for download");
    }
  };

  return (
    <div className="application">
      <h1>Image Background Remover</h1>
      <div className="usedImage">
        <img src={uploadedImage} alt="uploadedImage" />
        <img src={backgroundRemovedImage} alt="backgroundRemovedImage" />
      </div>
      <div className="allButtons">
        <input type="file" onChange={handleImageUpload} />
        <button onClick={removeBackground}>Remove Background</button>
        <button onClick={handleImageDownload}>Download</button>
      </div>
    </div>
  );
}
