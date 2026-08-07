"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@/components/icons";
import { cn } from "@/lib/utils";

const HERO_VIDEO_SRC = "/videos/onyx-hero-h264.mp4";
const HERO_VIDEO_FALLBACK = "/videos/onyx-hero.mp4";
const HERO_POSTER_SRC = "/videos/onyx-hero-poster.png";

type HeroShowreelVideoProps = {
  badge?: string;
  className?: string;
};

export function HeroShowreelVideo({
  badge = "Platform preview",
  className,
}: HeroShowreelVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const play = () => {
      video.play().catch(() => setNeedsTap(true));
    };

    const onError = () => setFailed(true);

    play();
    video.addEventListener("error", onError);

    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });

    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("error", onError);
    };
  }, []);

  return (
    <div className={cn("tv-hero-video-shell", className)}>
      <div className="tv-hero-video-frame">
        {failed ? (
          <img
            src={HERO_POSTER_SRC}
            alt="ONYX trading platform preview"
            className="tv-hero-video tv-hero-video-poster"
          />
        ) : (
          <video
            ref={videoRef}
            className="tv-hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER_SRC}
            aria-label="ONYX trading platform preview"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
            <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
          </video>
        )}

        <div className="tv-hero-video-vignette" aria-hidden />

        {badge && (
          <span className="tv-hero-video-badge">{badge}</span>
        )}

        {(needsTap || failed) && !failed && (
          <button
            type="button"
            className="tv-hero-video-play"
            onClick={() => {
              videoRef.current?.play().then(() => setNeedsTap(false));
            }}
            aria-label="Play platform preview"
          >
            <Play className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
