'use client';

import { getFavorites } from "@/api/product/endpoints";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../category/ProductCard";
import { nanoid } from "nanoid";
import { ProductInterface } from "@/lib/types/product/ProductInterface";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const LikesPane = () => {

    const { data, isSuccess } = useQuery<ProductInterface[]>({
        queryKey: ['likes'],
        queryFn: getFavorites
    });

    if (isSuccess && data.length === 0) {
        return (
            <div className="grid h-full border border-[#C4C4C4] p-8 place-content-center mt-4 rounded-lg lg:p-0">
                <div className="flex flex-col items-center">

                    <Heart className="w-20 h-20 text-gray-600" />
                    <p className="text-xl font-semibold">No Likes yet</p>
                    <p className="text-sm text-gray-600 text-center">Browse through Katangwa to find products you like!</p>
                    <Link href="/buy" legacyBehavior passHref>
                        <Button variant="link">Buy now</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-2 mt-6 lg:grid-cols-3 lg:gap-4 lg:mt-8">
            {
                data?.map((item) => {
                    const { data } = item;
                    return <ProductCard key={nanoid()} {...data} />
                })
            }
        </div>
    );
}

export default LikesPane;