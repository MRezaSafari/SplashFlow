import { motion } from "motion/react";
import type { Rect, UnsplashPhoto } from "../models/unsplash.models";
import { randomPositionInBody } from "../utils";
import UnsplashImage from "./image";

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

export default renderSingleImageAndRect;
