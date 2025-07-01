'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { TailSpin } from "react-loader-spinner";
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });
export default function PromotionsPage() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    // Fetch promotions data
    useEffect(() => {
        async function fetchPromotions() {
            try {
                setLoading(true);
                const response = await fetch('https://www.bookme.com.bd/admin/api/homepage/hot-package');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch promotions');
                }

                const { data } = await response.json();
                setPromotions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPromotions();
    }, []);

    return (
        <div className={`${roboto.className} bg-white w-full mx-auto px-4 sm:px-6 py-6 md:py-10 lg:py-12 max-w-7xl`}>
            <div className="w-full text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-2">
                    Save & Explore Global Destinations!
                </h2>
                <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <TailSpin height="60" width="60" color="#0678B4" ariaLabel="loading" />
                </div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">
                    Error loading promotions: {error}
                </div>
            ) : promotions && promotions.length > 0 ? (
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                         centeredSlides={true}
                        initialSlide={1}
                        speed={1000}
                        navigation={{
                            nextEl: '.promo-swiper-button-next',
                            prevEl: '.promo-swiper-button-prev',
                        }}
                        autoplay={{ 
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        loop={true}
                        breakpoints={{
                            350: {
                                slidesPerView: 1.2,
                                spaceBetween: 16,
                                centeredSlides: true,
                                slidesPerGroup: 1,
                            },
                            640: { 
                                slidesPerView: 1.5,
                                spaceBetween: 16,
                                centeredSlides: true,
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
                                slidesPerGroup: 3,
                                speed: 800, // Smooth transition on desktops
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 32,
                                slidesPerGroup: 3,
                            }
                        }}
                        className="w-full md:w-[90%] lg:w-[89%] mx-auto"
                    >
                        {promotions.slice(0,12).map((promo) => (
                            <SwiperSlide key={promo.id} className="pb-10 h-auto">
                                <div className="relative rounded-xl overflow-hidden shadow-lg h-72 group transition-all duration-300 hover:shadow-xl">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${promo.image}`}
                                            alt={promo.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                            priority={promo.id < 3}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                    </div>

                                    <div className="relative h-full flex flex-col justify-between p-6">
                                        <div>
                                            <div className="mb-2">
                                                {promo.discounts && (
                                                    <span className="inline-block bg-white text-red-600 font-bold text-xs px-2 py-1 rounded-md mb-2">
                                                        {promo.discounts}% OFF
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{promo.title}</h3>
                                            <p className="text-gray-200 text-sm md:text-base line-clamp-2">{promo.subtitle}</p>
                                        </div>

                                        <div className="mt-4">
                                           
                                                <Link
                                                    href={promo.btn_link || "/contact"}
                                                   
                                                    className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-full text-sm sm:text-base text-center transition-all duration-300 transform hover:scale-[1.03] shadow-md hover:shadow-lg"
                                                >
                                                    Book Now
                                                </Link>
                                         
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <button 
                        className="promo-swiper-button-prev hidden sm:flex absolute left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 hover:border-gray-300"
                        aria-label="Previous promotion"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-700">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button 
                        className="promo-swiper-button-next hidden sm:flex absolute right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 hover:border-gray-300"
                        aria-label="Next promotion"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-700">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center h-[200px]">
                    <p className="text-gray-600 text-base sm:text-lg">No promotions available at the moment.</p>
                </div>
            )}
        </div>
    );
}