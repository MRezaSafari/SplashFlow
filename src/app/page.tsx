"use client";
import { IconLoader2 } from "@tabler/icons-react";
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
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, backdropFilter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, backdropFilter: "blur(10px)" }}
      transition={{ duration: 0.4 }}
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
  const [loading, setLoading] = useState(true);
  const [imagesForRender, setImagesForRender] = useState<UnsplashPhoto[]>([]);
  const [centerImageId, setCenterImageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("japanese aesthetic");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetImageForCenter, setTargetImageForCenter] =
    useState<UnsplashPhoto | null>(null);

  const handleSearch = useCallback(
    async (query: string) => {
      if (isTransitioning) return;
      setLoading(true);
      try {
        const fetchedImages = await fetcher(query).then(
          (res) => res.data as UnsplashPhoto[]
        );

        if (fetchedImages.length > 0) {
          let newCenterId = centerImageId;
          if (
            !newCenterId ||
            !fetchedImages.find((img) => img.id === newCenterId)
          ) {
            newCenterId = fetchedImages[0].id;
          }
          setCenterImageId(newCenterId);

          const centerImgInstance = fetchedImages.find(
            (img) => img.id === newCenterId
          );
          const otherImgs = fetchedImages.filter(
            (img) => img.id !== newCenterId
          );

          if (centerImgInstance) {
            setImagesForRender([centerImgInstance, ...otherImgs]);
          } else {
            setImagesForRender(fetchedImages);
            if (fetchedImages.length > 0) setCenterImageId(fetchedImages[0].id);
            else setCenterImageId(null);
          }
        } else {
          setCenterImageId(null);
          setImagesForRender([]);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setImagesForRender([]);
        setCenterImageId(null);
      }
      setLoading(false);
    },
    [centerImageId, isTransitioning]
  );

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((query: string) => {
        handleSearch(query);
      }, 800),
    [handleSearch]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: only initial load
  useEffect(() => {
    handleSearch("japanese landscape");
  }, []);

  const handleImageClick = useCallback(
    (selectedImage: UnsplashPhoto) => {
      if (isTransitioning || selectedImage.id === centerImageId) return;

      setIsTransitioning(true);
      setTargetImageForCenter(selectedImage);
      setImagesForRender([selectedImage]);
    },
    [isTransitioning, centerImageId]
  );

  const onExitAnimationsDone = useCallback(async () => {
    if (targetImageForCenter) {
      const currentClickedImage = targetImageForCenter;
      setCenterImageId(currentClickedImage.id);

      const newSearchQuery =
        currentClickedImage.alt_description?.split(" ").slice(0, 3).join(" ") ||
        "japanese aesthetic";
      setSearchQuery(newSearchQuery);

      setLoading(true);
      try {
        const fetchedPeripheralImages = await fetcher(newSearchQuery).then(
          (res) => res.data as UnsplashPhoto[]
        );

        const otherImages = fetchedPeripheralImages.filter(
          (img) => img.id !== currentClickedImage.id
        );
        setImagesForRender([currentClickedImage, ...otherImages]);
      } catch (error) {
        console.error("Failed to fetch peripheral images:", error);
        setImagesForRender([currentClickedImage]);
      } finally {
        setLoading(false);
        setIsTransitioning(false);
        setTargetImageForCenter(null);
      }
    } else {
      setIsTransitioning(false);
      setTargetImageForCenter(null);
    }
  }, [targetImageForCenter]);

  const renderLoading = () => {
    return (
      <p className="text-center text-xl mt-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2">
        <IconLoader2 className="animate-spin" />
        <span className="animate-pulse">Loading images...</span>
      </p>
    );
  };

  const renderImages = useCallback(() => {
    if (loading && imagesForRender.length === 0 && !isTransitioning) {
      return renderLoading();
    }

    const imageElements: React.ReactElement[] = [];
    let centerImgRect: Rect | null = null;
    const placedSideImageRects: Rect[] = [];

    const currentCenterDisplayImage = imagesForRender.find(
      (img: UnsplashPhoto) => img.id === centerImageId
    );

    if (currentCenterDisplayImage) {
      const { element, rect } = renderSingleImageAndRect(
        currentCenterDisplayImage,
        true,
        handleImageClick,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        { isCenter: true }
      );
      if (element && rect) {
        centerImgRect = rect;
        imageElements.push(element);
      }
    }

    const otherImagesToRender = imagesForRender.filter(
      (img: UnsplashPhoto) => img.id !== centerImageId
    );

    for (const image of otherImagesToRender) {
      const { element, rect } = renderSingleImageAndRect(
        image,
        false,
        handleImageClick,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        {
          existingRects: [
            ...placedSideImageRects,
            ...(centerImgRect ? [centerImgRect] : []),
          ],
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
  }, [
    imagesForRender,
    centerImageId,
    handleImageClick,
    loading,
    isTransitioning,
  ]);

  return (
    <div>
      <div className="flex justify-between items-center fixed bottom-3 px-4 right-0 left-0 w-full z-50">
        <p className="text-sm text-gray-400">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/MRezaSafari"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reza Safari
          </a>
        </p>
        <Input
          loading={loading || isTransitioning}
          onSearch={debouncedHandleSearch}
          value={searchQuery}
          disabled={isTransitioning}
        />

        <p className="text-center text-sm text-gray-400">
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

      <div className="relative w-full h-full min-h-screen">
        <AnimatePresence mode="wait" onExitComplete={onExitAnimationsDone}>
          {renderImages()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
