import { IconLink } from "@tabler/icons-react";
import Image from "next/image";
interface IImageProps {
  src: string;
  alt: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  tilt: number;
  user: {
    username: string;
    avatar: string;
    profile_url: string;
  };
  link: string;
  isCenter?: boolean;
  onClick?: () => void;
}

const UnsplashImage = ({
  src,
  alt,
  position,
  width,
  height,
  tilt,
  user,
  link,
  onClick,
}: IImageProps) => {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className="absolute rounded-xl h-fit overflow-hidden aspect-square will-change-transform"
      style={{
        top: position.y,
        left: position.x,
        transform: `rotate(${tilt}deg)`,
      }}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover h-full"
      />

      <div className="absolute bottom-1 left-1 right-1  text-white flex justify-between items-center">
        <a
          href={user.profile_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 py-1 px-1 pr-2 bg-black/30 rounded-full"
        >
          <Image
            src={user.avatar}
            alt={user.username}
            className="rounded-full"
            width={20}
            height={20}
          />
          <span className="text-xs">{user.username}</span>
        </a>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className=" py-1 px-1 bg-black/30 rounded-full"
        >
          <IconLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default UnsplashImage;
