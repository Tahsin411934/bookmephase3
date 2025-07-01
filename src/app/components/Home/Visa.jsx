'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { TailSpin } from 'react-loader-spinner';
import getAllVisa from '@/services/visa/getAllVisa';

export default function Visa() {
    const [visaData, setVisaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const visaResult = await getAllVisa();
                setVisaData(visaResult);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white w-full mx-auto px-4 sm:px-6 py-6 md:py-10 lg:py-12 max-w-7xl">
            <div className="w-full text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00026E] mb-2">
                    Popular Visa Destinations
                </h2>
                <div className="w-20 h-1 bg-[#0678B4] mx-auto"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <TailSpin height="60" width="60" color="#0678B4" ariaLabel="loading" />
                </div>
            ) : visaData && visaData.length > 0 ? (
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                        spaceBetween={16}
                        slidesPerView={1.5}
                        centeredSlides={true}
                        initialSlide={1}
                        speed={1000} // Adjust scroll speed (default: 300ms)
                        navigation={{
                            nextEl: '.visa-swiper-button-next',
                            prevEl: '.visa-swiper-button-prev',
                        }}
                        autoplay={{
                            delay: 3000, // Slower autoplay transition (default: 2000ms)
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop
                        breakpoints={{
                            350: {
                                slidesPerView: 1.4,
                                spaceBetween: 16,
                                centeredSlides: true,
                                effect: 'slide',
                                slidesPerGroup: 1,
                                speed: 600, // Slightly slower on mobile
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
                                spaceBetween: 32,
                                slidesPerGroup: 3,
                            }
                        }}
                        className="swiper-visa w-full md:w-[90%] lg:w-[89%] mx-auto" // Added custom class
                    >
                        {visaData.slice(0,12).map((country) => (
                            <SwiperSlide key={country.id} className="pb-2 h-auto">
                                <div className="shadow-custom flex flex-col gap-4 rounded-lg bg-white h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                                    <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] relative rounded-t-lg overflow-hidden">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${country.image}`}
                                            alt={country.name}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                            priority={country.id < 3}
                                            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
                                    </div>

                                    <div className="flex flex-col w-full flex-grow pl-2 pb-5">
                                        <Link
                                            href={`/visa/${country.id}`}
                                            className="cursor-pointer"
                                        >
                                            <h1 className="font-semibold text-lg sm:text-xl lg:text-[22px] text-[#00026E] mt-2 mb-3 hover:text-blue-700 transition-colors line-clamp-2">
                                                {country.name}
                                            </h1>
                                        </Link>



                                        <div className="flex flex-row flex-wrap justify-between items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                                            <div className='flex flex-col'>
                                                <p className="text-xs text-gray-500">Starting from:</p>
                                                <p className="text-sm sm:text-base lg:text-xl font-bold text-blue-600">
                                                    {Math.ceil(country?.properties[0]?.property_uinit[0]?.price[0]?.price).toLocaleString()} BDT
                                                </p>
                                            </div>
                                            <Link
                                                href={`/visa/${country.id}`}
                                                style={{
                                                    background: "linear-gradient(90deg, #313881, #0678B4)",
                                                }}
                                                className="text-xs sm:text-sm lg:text-[15px] px-3 sm:px-4 py-2 lg:py-2.5 text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center"
                                            >
                                                Details
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1 lg:w-4 lg:h-4">
                                                    <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <button
                        className="visa-swiper-button-prev hidden sm:flex absolute left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600"
                        aria-label="Previous visa"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        className="visa-swiper-button-next hidden sm:flex absolute right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600"
                        aria-label="Next visa"
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
                            href="/visa"
                            className="px-6 py-3 md:px-8 md:py-3.5  text-white font-medium rounded-md hover:bg-[#056699] transition-colors duration-200 inline-flex items-center"
                        >
                            See More Destinations
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            ) : (
                !loading && (
                    <div className="flex justify-center items-center h-[200px]">
                        <p className="text-gray-600 text-base sm:text-lg">No visa destinations found.</p>
                    </div>
                )
            )}
        </div>
    );
}