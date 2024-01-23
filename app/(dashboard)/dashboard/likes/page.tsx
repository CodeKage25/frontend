'use client';
import { getFavorites } from "@/api/product/endpoints";
import ProductCard from "@/components/category/ProductCard";
import NoSSRWrapper from "@/components/likes/NoSSRWrapper";
// import LikesPane from "@/components/likes/LikesPane";
import getQueryClient from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import dynamic from 'next/dynamic';

const LikesPane = dynamic(() => import('@/components/likes/LikesPane'))

const Likes = () => {
    // const queryClient = getQueryClient();
    // await queryClient.prefetchQuery({
    //     queryKey: ['likes'],
    //     queryFn: getFavorites
    // });
    // const dehydratedState = dehydrate(queryClient);

    return (
        // <HydrationBoundary state={dehydratedState}>
        <div className="flex flex-col h-full">
            <p className="hidden font-medium lg:block">Likes</p>
            <NoSSRWrapper>
                <LikesPane />
            </NoSSRWrapper>
        </div>
        // </HydrationBoundary>
    )
}

export default Likes;