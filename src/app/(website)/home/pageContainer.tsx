"use client";
import Image from "next/image";
import { ImageLoader } from "@/util/imageLoader";
export default function HomeContainer() {
  return (
    <div
      className="h-screen w-full
  bg-[linear-gradient(to_bottom,rgba(255,255,255,255),rgba(255,255,255,0.1)),url('/bg1.jpg')]
  bg-cover bg-center bg-no-repeat filter  flex flex-col items-center justify-center font-sans"
    >
      <div className="max-w-xl p-3">
        <div className=" text-xl text-black flex font-semibold">
            <Image
              alt="logo"
              width={0}
              height={0}
              src={"/logo.png"}
              loader={ImageLoader}
              priority={true}
              className="w-20 h-20 sm:w-20 sm:h-20 object-cover -mt-5"
            />
          "When you have the right Feng Shui, it is like climbing up in an
          escalator that is going up. Your effort is magnified! Pranic Feng Shui
          allows you to make your life better."
        </div>
        <div className="text-black text-xl font-extrabold text-right mt-2">
          - Master Choa Kok Sui
        </div>
      </div>
    </div>
  );
}
