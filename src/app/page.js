import { Roboto } from "next/font/google";
import Banner from "./components/Home/Banner";
import Visa from "./components/Home/Visa";
import Tangour from "./components/Home/Tangour";
import Sundarban from "./components/Home/sundarban";
import SaintMartin from "./components/Home/SaintMartin";
import PromotionsPage from "./components/Home/PromotionsPage";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

async function getServicesData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`, {
      next: { revalidate: 60 } // Revalidate data every 60 seconds
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch services data');
    }
    
    const data = await res.json();
    return data.data || []; // Return empty array if data.data is undefined
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function Home() {
  const servicesData = await getServicesData();

  // Safely check for each category
  const shouldShowVisa = servicesData.some(
    item => item?.category_name === "Visa" && item?.isShow === "yes"
  );

  const shouldShowTour = servicesData.some(
    item => item?.category_name === "Tour" && item?.isShow === "yes"
  );

  const shouldShowTangour = servicesData.some(
    item => item?.category_name === "Tanguar Haor" && item?.isShow === "yes"
  );

  const shouldShowSundarban = servicesData.some(
    item => item?.category_name === "Sundarban" && item?.isShow === "yes"
  );

  const shouldShowSaintMartin = servicesData.some(
    item => item?.category_name === "Saint Martin Ships" && item?.isShow === "yes"
  );

  return (
    <main className={roboto.className}>
      <div className="w-[100%]">
        <Banner />
      </div>
      <div className="py-[20px] md:py-10">
        <div className="mt-[12px] md:mt-0 w-[98%] 2xl:w-[1440px] gap-5 mx-auto">
          <div className="overflow-hidden">
            <PromotionsPage servicesData={servicesData} />

            {/* Visa Section */}
            {shouldShowVisa && <Visa />}

            {/* Tour Sections */}
            {shouldShowTour && (
              <>
                {shouldShowTangour && <Tangour />}
                {shouldShowSundarban && <Sundarban />}
                {shouldShowSaintMartin && <SaintMartin />}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}