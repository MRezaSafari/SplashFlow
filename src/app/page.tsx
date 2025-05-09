"use client";
import { useCallback, useEffect, useState } from "react";
import { Input, UnsplashImage } from "./libs/components";
import type { UnsplashPhoto } from "./libs/models/unsplash.models";
import { fetcher, randomPositionInBody } from "./libs/utils";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 300;

export default function Home() {
  const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
  const [images, setImages] = useState<UnsplashPhoto[]>([]);
  const [centerImageId, setCenterImageId] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const res = await fetcher(query);
      setImages(res.data);
      if (res.data.length > 0) {
        // If no center image is set, or the current center image is not in the new list, set the first image as center.
        if (!centerImageId || !res.data.find((img: UnsplashPhoto) => img.id === centerImageId)) {
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
  }, [centerImageId]); // Include centerImageId in dependencies as its check influences setCenterImageId

  useEffect(() => {
    // Initial search on component mount
    handleSearch("japanese landscape");
  }, [handleSearch]); // handleSearch is memoized, so this runs once on mount effectively

  const handleImageSelect = useCallback((selectedImage: UnsplashPhoto) => {
    setCenterImageId(selectedImage.id);
    const searchQuery = selectedImage.alt_description || "japanese aesthetic"; // Use alt_description or a sensible default
    handleSearch(searchQuery);
  }, [handleSearch]);

  const renderImages = useCallback(() => {
    if (loading && images.length === 0) {
      // Optionally, show a global loading spinner or placeholder here
      return <p className="text-center text-xl mt-10">Loading images...</p>;
    }

    const imageElements = [];
    let centerImgRect: Rect | null = null;

    const centerImage = images.find((img: UnsplashPhoto) => img.id === centerImageId);

    // 1. Position and render the center image first
    if (centerImage) {
      const position = randomPositionInBody(IMAGE_WIDTH, IMAGE_HEIGHT, { isCenter: true });
      if (position) {
        centerImgRect = { ...position, width: IMAGE_WIDTH, height: IMAGE_HEIGHT };
        imageElements.push(
          <div key={centerImage.id}>
            {/* TODO: Ensure UnsplashImage props (IImageProps) accept onClick and isCenter */}
            <UnsplashImage
              src={centerImage.urls.regular}
              alt={centerImage.alt_description ?? "Center image"}
              position={position}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              tilt={0}
              user={{
                username: centerImage.user.username,
                avatar: centerImage.user.profile_image.medium,
                profile_url: centerImage.user.links.html,
              }}
              link={centerImage.links.html}
              onClick={() => handleImageSelect(centerImage)}
              isCenter={true}
            />
          </div>
        );
      }
    }

    // 2. Position and render other images
    const otherImages = images.filter((img: UnsplashPhoto) => img.id !== centerImageId);
    const placedSideImageRects: Rect[] = [];

    for (const image of otherImages) {
      const positionOptions = {
        existingRects: [...placedSideImageRects],
        centerRect: centerImgRect || undefined, // Pass undefined if centerImgRect is null
        maxAttempts: 100,
      };
      const position = randomPositionInBody(
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        positionOptions
      );

      const tilt = Math.random() * 10 - 5;

      if (position) {
        placedSideImageRects.push({
          x: position.x,
          y: position.y,
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
        });

        imageElements.push(
          <div key={image.id}>
            {/* TODO: Ensure UnsplashImage props (IImageProps) accept onClick and isCenter */}
            <UnsplashImage
              src={image.urls.regular}
              alt={image.alt_description ?? "Image"}
              position={position}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              tilt={tilt}
              user={{
                username: image.user.username,
                avatar: image.user.profile_image.medium,
                profile_url: image.user.links.html,
              }}
              link={image.links.html}
              onClick={() => handleImageSelect(image)}
              isCenter={false}
            />
          </div>
        );
      }
    }
    return imageElements;
  }, [images, centerImageId, handleImageSelect, loading]);

  return (
    <div>
      {/* TODO: Ensure Input props (IInputProps) accept onSearch */}
      <Input loading={loading} onSearch={handleSearch} />
      <div className="relative w-full h-full min-h-screen">
        {renderImages()}
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
}
