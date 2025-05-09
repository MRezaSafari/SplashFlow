"use client";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input, UnsplashImage } from "./libs/components";
import type { UnsplashPhoto } from "./libs/models/unsplash.models";
import { fetcher, randomPositionInBody } from "./libs/utils";
import debounce from "./libs/utils/debounce.utils";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const IMAGE_WIDTH = 250;
const IMAGE_HEIGHT = 250;

// Helper function to render a single image and return its element and rect
const renderSingleImageAndRect = (
  image: UnsplashPhoto,
  isCenter: boolean,
  onClick: (image: UnsplashPhoto) => void,
  imageWidth: number,
  imageHeight: number,
  positionOptions?: {
    existingRects?: Rect[];
    centerRect?: Rect;
    maxAttempts?: number;
    isCenter?: boolean;
  }
): { element: React.ReactElement | null; rect: Rect | null } => {
  const position = randomPositionInBody(
    imageWidth,
    imageHeight,
    positionOptions
  );

  if (!position) return { element: null, rect: null };

  const tilt = isCenter ? 0 : Math.random() * 10 - 5;
  const rect = {
    x: position.x,
    y: position.y,
    width: imageWidth,
    height: imageHeight,
  };

  const element = (
    <motion.div
      key={image.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, backdropFilter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <UnsplashImage
        src={image.urls.regular}
        alt={image.alt_description ?? (isCenter ? "Center image" : "Image")}
        position={position}
        width={imageWidth}
        height={imageHeight}
        tilt={tilt}
        user={{
          username: image.user.username,
          avatar: image.user.profile_image.medium,
          profile_url: image.user.links.html,
        }}
        link={image.links.html}
        onClick={() => onClick(image)}
        isCenter={isCenter}
      />
    </motion.div>
  );
  return { element, rect };
};

const Home = () => {
  const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
  const [images, setImages] = useState<UnsplashPhoto[]>([]);
  const [centerImageId, setCenterImageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("japanese aesthetic");

  const handleSearch = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const res = await fetcher(query);
        setImages(res.data);
        if (res.data.length > 0) {
          // If no center image is set, or the current center image is not in the new list, set the first image as center.
          if (
            !centerImageId ||
            !res.data.find((img: UnsplashPhoto) => img.id === centerImageId)
          ) {
            setCenterImageId(res.data[0].id);
          }
        } else {
          setCenterImageId(null); // No images, no center
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setImages([]); // Clear images on error
        setCenterImageId(null);
      }
      setLoading(false);
    },
    [centerImageId]
  );

  // Create a debounced version of handleSearch
  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 800),
    [handleSearch]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Initial search on component mount
    handleSearch("japanese landscape");
  }, []);

  const handleImageSelect = useCallback(
    (selectedImage: UnsplashPhoto) => {
      setCenterImageId(selectedImage.id);

      // get first 3 words of alt_description
      const searchQuery =
        selectedImage.alt_description?.split(" ").slice(0, 3).join(" ") ||
        "japanese aesthetic"; // Use alt_description or a sensible default
      setSearchQuery(searchQuery);
      handleSearch(searchQuery);
    },
    [handleSearch]
  );

  const renderImages = useCallback(() => {
    if (loading && images.length === 0) {
      return <p className="text-center text-xl mt-10">Loading images...</p>;
    }

    const imageElements: React.ReactElement[] = [];
    let centerImgRect: Rect | null = null;
    const placedSideImageRects: Rect[] = [];

    const centerImage = images.find(
      (img: UnsplashPhoto) => img.id === centerImageId
    );

    // 1. Render the center image
    if (centerImage) {
      const { element, rect } = renderSingleImageAndRect(
        centerImage,
        true,
        handleImageSelect,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        { isCenter: true }
      );
      if (element && rect) {
        centerImgRect = rect;
        imageElements.push(element);
      }
    }

    // 2. Render other images
    const otherImages = images.filter(
      (img: UnsplashPhoto) => img.id !== centerImageId
    );

    for (const image of otherImages) {
      const { element, rect } = renderSingleImageAndRect(
        image,
        false,
        handleImageSelect,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        {
          existingRects: [...placedSideImageRects],
          centerRect: centerImgRect || undefined,
          maxAttempts: 100,
        }
      );

      if (element && rect) {
        placedSideImageRects.push(rect);
        imageElements.push(element);
      }
    }
    return imageElements;
  }, [images, centerImageId, handleImageSelect, loading]);

  return (
    <div>
      <Input
        loading={loading}
        onSearch={debouncedHandleSearch}
        value={searchQuery}
      />
      <div className="relative w-full h-full min-h-screen">
        <AnimatePresence mode="wait">{renderImages()}</AnimatePresence>
      </div>
      <p className="text-center text-sm text-gray-400 fixed bottom-4 right-4">
        Powered by{" "}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Unsplash
        </a>
      </p>
    </div>
  );
};

export default Home;
