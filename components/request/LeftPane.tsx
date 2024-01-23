"use client"

import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { currencyFormatter } from "@/lib/utils";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { getSingleRequest } from "@/api/request/endpoints";

const LeftPane = () => {
    const pageParams = useParams();
    const id = pageParams.id;
    const { data, isSuccess } = useQuery({
        queryKey: ['request', id],
        queryFn: () => getSingleRequest(id as string)
    });

    const [selectedImage, setSelectedImage] = useState('');
    useEffect(() => {
        setSelectedImage(data?.data.image.images[0] ?? '');
    }, [isSuccess]);

    return (
        <section className="flex flex-col items-start">
            <div className="relative w-full h-[300px] mt-9">
                {isSuccess && <Image fill style={{ objectFit: 'contain' }} src={selectedImage} alt="" />}
            </div>

            <div className="flex mt-4 space-x-3">
                {
                    data?.data.image.images.map((item) => (
                        <div key={nanoid()} className={`${selectedImage === item ? 'border border-primary overflow-hidden rounded-lg' : 'border-none'} relative w-[100px] h-[100px]  transition-all duration-100 hover:shadow-md hover:scale-105 hover:cursor-pointer`} onClick={() => setSelectedImage(item)}>
                            <Image src={item} fill objectFit="contain" alt="" />
                        </div>
                    ))
                }
            </div>

            <section className="flex flex-col w-full mt-5 md:mt-10">
                <div className="flex justify-between">
                    <p className="font-medium text-base text-black md:text-[24px]">{data?.data.name}</p>
                    {data?.data.rate && <p className="font-medium text-base text-black md:text-[24px]">
                        <span className="text-gray-500 font-normal text-sm">Rate: </span>{currencyFormatter(+data?.data.rate)}
                    </p>}
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