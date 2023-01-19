import { Flex } from "@chakra-ui/react";
import { useImageViewer } from "react-image-viewer-hook";
import JSXStyle from "styled-jsx/style";

const ImageViewerGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const { getOnClick, ImageViewer } = useImageViewer();

  return (
    <>
      <Flex flexWrap={"wrap"} alignItems={"center"} justifyContent={"center"}>
        {images?.map((src, index) => (
          <a key={src + index} href={`${src}`} onClick={getOnClick(src)}>
            <img src={`${src}`} style={{ maxWidth: "150px" }} />
          </a>
        ))}
      </Flex>
      <ImageViewer />
    </>
  );
};

export default ImageViewerGallery;
