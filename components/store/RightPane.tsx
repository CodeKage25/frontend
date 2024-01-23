'use client'

import { getSellerProfile } from "@/api/user/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import ProductCard from "../category/ProductCard";
import { nanoid } from "nanoid";

const RightPane = () => {
    const searchParams = useParams();
    const id = searchParams.id as string;
    const { data: products } = useQuery({
        queryKey: ['seller-profile', id],
        queryFn: () => getSellerProfile(id ?? '')
    });

    return (
        <section className="flex flex-col order-1 lg:order-2">
            <p className="font-medium text-[#253B4B] text-[18px] -translate-y-1">Listings</p>
            <div className="grid grid-cols-2 gap-2 mt-[2px] lg:grid-cols-3 lg:gap-4">
                {
                    products?.data.map((item) => <ProductCard key={nanoid()} {...item} />)
                }
            </div>
        </section >
    );
}

export default RightPane;