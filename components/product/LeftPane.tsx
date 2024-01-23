"use client"

import { CalendarDays, Mail, MapPin } from "lucide-react";
import shoe from '@/public/footy.png';
import Image from "next/image";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/api/product/endpoints";
import { useParams } from "next/navigation";
import { currencyFormatter } from "@/lib/utils";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useState } from "react";
import { nanoid } from "nanoid";

const LeftPane = () => {
    const pageParams = useParams();
    const id = pageParams.product;
    const { data } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(id as string)
    })

    const [selectedImage, setSelectedImage] = useState(data?.data.image.images[0]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

console.log(data?.data.image.images)
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleImageClick = (item, index) => {
        setSelectedImage(item);
        setSelectedImageIndex(index);
        toggleFullscreen();
    };

    const navigateCarousel = (direction) => {
        const totalImages = data?.data.image.images.length || 0;
        let newIndex = selectedImageIndex + direction;
    
        if (newIndex < 0) {
            newIndex = totalImages - 1;
        } else if (newIndex >= totalImages) {
            newIndex = 0;
        }
    
        setSelectedImage(data?.data.image.images[newIndex]);
        setSelectedImageIndex(newIndex);
    };
    


    return (
        <section className={`flex flex-col items-center justify-center ${isFullscreen ? 'fixed inset-0 bg-black z-50 flex items-center justify-center' : ''}`}>
            {/* <Image src={(data?.data.image.images.length || 0) > 0 ? selectedImage : shoe} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} className="mt-9" alt="" /> */}
            {isFullscreen && (
            <div className="absolute inset-0 bg-black opacity-75" onClick={toggleFullscreen}></div>
        )}
        <div className={`relative ${isFullscreen ? 'w-full h-full max-w-screen-xl max-h-screen overflow-hidden' : 'w-full h-[300px]'} mt-9`}>
            <Image fill style={{ objectFit: 'contain' }} src={isFullscreen ? selectedImage : ((data?.data.image.images.length || 0) > 0 ? selectedImage : shoe)} alt="" onClick={toggleFullscreen} />
            {isFullscreen && (
                <button className="absolute top-1/2 -left-8 text-white text-3xl focus:outline-none" onClick={() => navigateCarousel(-1)}>&lt;</button>
            )}
            {isFullscreen && (
                <button className="absolute top-1/2 right-0 -right-8 text-white text-3xl focus:outline-none" onClick={() => navigateCarousel(1)}>&gt;</button>
            )}
        </div>

            <div className={`flex mt-4 space-x-3 ${isFullscreen ? 'hidden' : 'block'}`}>
            {data?.data.image.images.map((item, index) => (
                <div key={nanoid()} className={`${selectedImage === item ? 'border border-primary overflow-hidden rounded-lg' : 'border-none'} relative w-[100px] h-[100px]  transition-all duration-100 hover:shadow-md hover:scale-105 hover:cursor-pointer`} onClick={() => handleImageClick(item, index)}>
                    <Image src={item} fill objectFit="contain" alt="" />
                </div>
            ))}
            </div>

            <section className="flex flex-col w-full mt-5 md:mt-10">
                <div className="flex justify-between">
                    <p className="font-medium text-base text-black md:text-[24px]">{data?.data.name}</p>
                    <p className="font-medium text-base text-black md:text-[24px]">{currencyFormatter(data?.data.price as number)}</p>
                </div>

                <div className="flex flex-col text-[#737373] space-y-4 mt-[8px] md:flex-row md:space-y-0 md:space-x-4">
                    {data?.data.address && <div className="flex justify-start items-center space-x-1 md:justify-between">
                        <MapPin className="w-5 h-5" />
                        <p className="text-[14px] font-normal">{data.data.address}</p>
                    </div>
                    }

                    <div className="flex justify-start items-center space-x-1 md:justify-between">
                        <CalendarDays className="w-5 h-5" />
                        <p className="text-[14px] font-normal">{`Posted: ${format(parseISO(data?.data.createdAt ?? new Date().toISOString()), 'MMMM d, yyyy')}`}</p>
                    </div>
                </div>

                <div className="flex flex-col mt-5">
                    <p className="font-medium text-[18px] text-black">Description</p>
                    <p className="font-normal text-[12px] text-[#253B4B]">
                        {data?.data.description}
                    </p>
                </div>
            </section>
        </section>
    )
}

export default LeftPane;