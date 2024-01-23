'use client';

import { getProduct, getRelatedProducts, getSellerProducts } from "@/api/product/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ProductCard from "../category/ProductCard";
import { nanoid } from "nanoid";

const BottomPane = () => {
    const pageParams = useParams();
    const id = pageParams.product;
    const { data: productData } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(id as string)
    });

    const { data: sellerProducts } = useQuery({
        queryKey: ['seller-product'],
        queryFn: () => getSellerProducts(productData?.data.userId ?? -1, productData?.data.type ?? ''),
        select: (data) => data.data.filter(item => item.userId !== productData?.data.userId)
    });

    const { data: relatedProducts } = useQuery({
        queryKey: ['related-product'],
        queryFn: () => getRelatedProducts(productData?.data.categoryId ?? -1),
        enabled: sellerProducts?.length === 0,
        select: (data) => data.data.filter(item => item.userId !== productData?.data.userId)
    });

    return (
        <div className="flex flex-col relative no-scrollbar overflow-x-scroll overflow-y-hidden whitespace-nowrap">
            {
                (sellerProducts?.length ?? 0) > 0 ?
                    <>
                        <p className="mt-8 mb-4 font-medium text-base text-[#253B4B]">Other listings by same seller</p>
                        <div className="grid grid-cols-2 gap-3 lg:gap-x-5 lg:grid-cols-4 overflow-x-scroll">
                            {
                                sellerProducts?.map((item) => <ProductCard key={nanoid()} {...item} />)
                            }
                        </div>
                    </>
                    :
                    (relatedProducts?.length ?? 0) > 0 && (
                        <>
                            <p className="mt-8 mb-4 font-medium text-base text-[#253B4B]">Other products that might interest you</p>
                            <div className="grid grid-cols-2 gap-3 lg:gap-x-5 lg:grid-cols-4 overflow-x-scroll">
                                {
                                    relatedProducts?.map((item) => <ProductCard key={nanoid()} {...item} />)
                                }
                            </div>
                        </>
                    )
            }
        </div >
    )
}

export default BottomPane;