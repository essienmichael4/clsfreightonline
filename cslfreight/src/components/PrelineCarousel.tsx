import { useEffect } from "react";
import image1 from "../assets/DONE1.png"
import image2 from "../assets/DONE2.png"
import image3 from "../assets/DONE3.png"

export default function HeroCarousel() {
  useEffect(() => {
    if (window.HSCarousel) {
      window.HSCarousel.autoInit();
    }
  }, []);

  return (
    <div
      data-hs-carousel='{
        "loadingClasses": "opacity-0",
        "dotsItemClasses": "hs-carousel-active:bg-blue-700 hs-carousel-active:border-blue-700 size-3 border border-gray-400 rounded-full cursor-pointer dark:border-neutral-600 dark:hs-carousel-active:bg-blue-500 dark:hs-carousel-active:border-blue-500",
        "isAutoPlay": true
      }'
      className="relative w-full"
    >
      <div className="hs-carousel relative overflow-hidden w-full 
        h-40 sm:h-56 md:h-72 lg:h-[470px] xl:h-[570px]
        bg-white rounded-lg">

        <div className="hs-carousel-body absolute top-0 bottom-0 start-0 
            flex flex-nowrap transition-transform duration-700 opacity-0">

          {/* Slide 1 */}
          <div className="hs-carousel-slide w-full h-full">
            <img
              src={image1}
              alt="Slide 1"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Slide 2 */}
          <div className="hs-carousel-slide w-full h-full">
            <img
              src={image2}
              alt="Slide 2"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Slide 3 */}
          <div className="hs-carousel-slide w-full h-full">
            <img
              src={image3}
              alt="Slide 3"
              className="w-full h-full object-contain"
            />
          </div>

        </div>
      </div>

      {/* Prev */}
      {/* <button
        type="button"
        className="hs-carousel-prev hs-carousel-disabled:opacity-50 hs-carousel-disabled:pointer-events-none
          absolute inset-y-0 start-0 
          flex justify-center items-center 
          w-10 sm:w-12 md:w-14
          h-full text-white/80 hover:text-white
          bg-black/20 hover:bg-black/30
          backdrop-blur-sm
          rounded-s-lg"
      >
        <svg className="size-5 sm:size-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button> */}

      {/* Next */}
      {/* <button
        type="button"
        className="hs-carousel-next hs-carousel-disabled:opacity-50 hs-carousel-disabled:pointer-events-none
          absolute inset-y-0 end-0 
          flex justify-center items-center 
          w-10 sm:w-12 md:w-14
          h-full text-white/80 hover:text-white
          bg-black/20 hover:bg-black/30
          backdrop-blur-sm
          rounded-e-lg"
      >
        <svg className="size-5 sm:size-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button> */}

      {/* Pagination */}
      <div className="hs-carousel-pagination flex justify-center absolute 
        bottom-2 sm:bottom-3 w-full gap-x-2"></div>
    </div>
  );
}
