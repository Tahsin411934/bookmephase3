'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import IconShow from "@/services/tour/IconShow";
import { TailSpin } from "react-loader-spinner";
import { Roboto } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import getContactNumber from "@/services/tour/getContactNumber";
import getPopularSummary from "@/services/tour/getPopularSummary";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function Tangour() {
    const [data, setData] = useState([]);
    const [contactNumber, setContactNumber] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Fetch property data
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const locationId = 1;
                const result = await getPopularSummary(locationId);
                setData(result);
            } catch (error) {
                console.error("Error fetching property data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Fetch contact number
    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getContactNumber();
                setContactNumber(result);
            } catch (error) {
                console.error("Error fetching contact number data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className={`${roboto.className}  bg-white w-full mx-auto px-4 sm:px-6 py-6 md:py-10 lg:py-12 max-w-7xl`}>
            <div className="w-full text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00026E] mb-2">
                    POPULAR TANGOUR HAOR BOATS
                </h2>
                <div className="w-20 h-1 bg-[#0678B4] mx-auto "></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <TailSpin height="60" width="60" color="#0678B4" ariaLabel="loading" />
                </div>
            ) : data && data.length > 0 ? (
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                         centeredSlides={true}
                        initialSlide={1}
                        speed={1000}
                        navigation={{
                            nextEl: '.property-swiper-button-next',
                            prevEl: '.property-swiper-button-prev',
                        }}
                        autoplay={{ 
                            delay: 2000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        loop
                        breakpoints={{
                            350: {
                                slidesPerView: 1.4,
                                spaceBetween: 16,
                                centeredSlides: true,
                                effect: 'slide',
                                slidesPerGroup: 1,
                                
                            },
                            640: { 
                                slidesPerView: 1.5,
                                spaceBetween: 16,
                                centeredSlides: true,
                                effect: 'slide',
                                slidesPerGroup: 1,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                                centeredSlides: false,
                                 slidesPerGroup: 2,
                                speed: 700, // Smooth transition on tablets
                            },
                            1024: { 
                                slidesPerView: 3,
                                spaceBetween: 28,
                                effect: 'slide',
                                slidesPerGroup: 3,
                                speed: 800, // Smooth transition on desktops
                            },
                            1280: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                                spaceBetween: 32
                            }
                        }}
                        className="w-full md:w-[90%] lg:w-[89%] mx-auto"
                    >
                        {data.slice(0,12).map((property) => (
                            <SwiperSlide key={property.property_id} className="pb-2 h-auto">
                                <div className="shadow-custom flex flex-col gap-4   rounded-lg bg-white h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                                    <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] relative rounded-t-lg overflow-hidden">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${property.main_img}`}
                                            alt={property.property_name}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                            priority={property.property_id < 3}
                                            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        />
                                    </div>

                                    <div className="flex flex-col w-full flex-grow pl-2 pb-5">
                                        <Link
                                            href={`/Property/${property.property_id}`}
                                            className="cursor-pointer"
                                        >
                                            <h1 className="font-semibold text-lg sm:text-xl lg:text-[22px] text-[#00026E] mt-2 mb-3 hover:text-blue-700 transition-colors line-clamp-2 h-16">
                                                {property.property_name}
                                            </h1>
                                        </Link>

                                        {property.property_summaries && (
                                            <div className="flex flex-col gap-3 flex-grow">
                                              
                                               

                                                <div className="flex flex-row flex-wrap justify-between items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs sm:text-sm lg:text-[15px] text-[#00026E]">
                                                            Starting from
                                                        </span>
                                                        <span className="font-bold text-lg sm:text-xl lg:text-2xl text-blue-900">
                                                            {(() => {
                                                                const prices =
                                                                    property.property_uinit?.flatMap((unit) =>
                                                                        unit.price?.map((priceObj) => priceObj.price)
                                                                    ) || [];
                                                                return prices.length > 0
                                                                    ? `${Math.min(...prices).toLocaleString()} TK`
                                                                    : "N/A";
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/Property/${property.property_id}`}
                                                            style={{
                                                                background: "linear-gradient(90deg, #313881, #0678B4)",
                                                            }}
                                                            className="text-xs sm:text-sm lg:text-[15px] px-3 sm:px-4 py-2 lg:py-2.5 text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center"
                                                        >
                                                            See Details
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1 lg:w-4 lg:h-4">
                                                                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons - Hidden on mobile */}
                    <button 
                        className="property-swiper-button-prev border border-blue-600 hidden sm:flex absolute left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Previous property"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button 
                        className="property-swiper-button-next border border-blue-600 hidden sm:flex absolute right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Next property"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* See More Button */}
                    <div className="w-full flex justify-center mt-6 md:mt-8">
                        <Link
                         style={{
                                                                background: "linear-gradient(90deg, #313881, #0678B4)",
                                                            }}
                            href="/tour/1" // Update this with your actual route
                            className="px-6 py-3 md:px-8 md:py-3.5  text-white font-medium rounded-md hover:bg-[#056699] transition-colors duration-200 inline-flex items-center"
                        >
                            See More House Boats
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            ) : (
                !loading && (
                    <div className="flex justify-center items-center h-[200px]">
                        <p className="text-gray-600 text-base sm:text-lg">No properties found.</p>
                    </div>
                )
            )}
        </div>
    );
}