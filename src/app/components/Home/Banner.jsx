"use client";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Roboto } from "next/font/google";
import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function Banner() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // No need for API fetch since we're using a local video now
  const videoData = {
    title: "Plan to dream locations in just a click!",
    subtitle: "Travel is a transformative and enriching experience that allows individuals to explore new destinations, cultures, and landscapes."
  };

  useEffect(() => {
    // Try to autoplay the video
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.log("Autoplay prevented, showing fallback:", error);
            setIsPlaying(false);
          });
      }
    };

    playVideo();
  }, []);

  return (
    <section className={`${raleway.className} relative z-10 h-[40vh] lg:h-[62vh]`}>
      {/* Single video banner instead of Swiper */}
      <div className="relative h-full w-full overflow-hidden">
        {/* Video element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
        >
          <source src="/banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Fallback image if video can't load/play */}
       
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10 pointer-events-none"></div>

        {/* Text Content */}
        <div className="absolute inset-0 flex items-center h-full px-4  z-20 pointer-events-none">
          <div className="font-heading pt-10 md:pt-0 text-white w-full lg:w-3/5 space-y-6 pl-8 lg:pl-16 text-left">
            <h4 className="sm:text-3xl text-[20px] lg:text-4xl font-bold mb-4">
              {videoData.title}
            </h4>
            <p className="text-[12px]  lg:flex sm:text-[16px]">
              {videoData.subtitle}
            </p>
          </div>
         
        </div>
      </div>
    </section>
  );
}