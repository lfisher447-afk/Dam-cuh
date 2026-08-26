import { useEffect, useRef } from "react";

type VideoModalProps = {
  url: string;
  title: string;
  onClose: () => void;
};

function VideoModal({ url, title, onClose }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 h-full w-full">
        {isYouTube ? (
          <iframe
            ref={iframeRef}
            className="h-full w-full"
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <iframe
            ref={iframeRef}
            className="h-full w-full"
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-20 rounded-full bg-black/60 px-4 py-2 text-lg text-white hover:bg-black/80"
      >
        ✕
      </button>
    </div>
  );
}

export default VideoModal;
