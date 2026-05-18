import { useEffect, useState } from "react";

const DEFAULT_IMAGE = "def.jpg";

const ImageGallery = ({ images = [], alt = "Product image" }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageList =
    Array.isArray(images) && images.length > 0 ? images : [DEFAULT_IMAGE];

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  return (
    <div className="image-gallery">
      <div className="image-gallery-main">
        <img src={imageList[selectedIndex]} alt={`${alt} preview`} />
      </div>
      {imageList.length > 1 && (
        <div className="image-gallery-thumbs">
          {imageList.map((imgSrc, index) => (
            <div
              key={`${imgSrc}-${index}`}
              role="button"
              tabIndex={0}
              className={`image-gallery-thumb ${
                selectedIndex === index ? "image-gallery-thumb-active" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setSelectedIndex(index);
                }
              }}>
              <img src={imgSrc} alt={`${alt} thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
