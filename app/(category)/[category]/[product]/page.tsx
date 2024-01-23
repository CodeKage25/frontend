import { getProduct } from "@/api/product/endpoints";
import BottomPane from "@/components/product/BottomPane";
import LeftPane from "@/components/product/LeftPane";
import RightPane from "@/components/product/RightPane";
import getQueryClient from "@/lib/getQueryClient";
import { ProductInterface } from "@/lib/types/product/ProductInterface";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ChevronRight, Store } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

type Props = {
    params: { product: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.product as string;

    const product = await getProduct(id);

    return {
        title: `${product.data.name} | Katangwa`,
        description: product.data.description,
        openGraph: {
            images: [product.data.image.images[0]]
        }
    }
}

const Product = async ({ params }: {
    params: { category: string, product: string }
}) => {
    const id = params.product as string;
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(id)
    });
    const dehydratedState = dehydrate(queryClient);
    const productData = queryClient.getQueryData<ProductInterface>(['product', id])?.data;

    return (
        <HydrationBoundary state={dehydratedState}>
            <section className="container flex flex-col mx-auto px-3 py-6 lg:px-[60px]">
                <div className="flex justify-between items-center">
                    <div className="flex justify-evenly items-center space-x-2">
                        <Link href={'/'} replace>
                            <Store className="w-5 h-5 text-[#B1B5C3]" />
                        </Link>
                        <ChevronRight className="w-5 h-6 text-[#737373]" />
                        <Link href={`/${productData?.category?.name.toLowerCase()}?catId=${productData?.categoryId}`} replace>
                            <p className="font-medium text-[14px] text-[#253B4B] capitalize">{decodeURIComponent(params.category)}</p>
                        </Link>
                        <ChevronRight className="w-5 h-6 text-[#737373]" />
                        <p className="font-medium text-[14px] text-[#253B4B] capitalize">{productData?.name}</p>
                    </div>
                </div>
                <section className="grid grid-cols-1 gap-x-8 lg:grid-cols-[3fr_1.5fr]">
                    <LeftPane />
                    <RightPane />
                </section>
                <BottomPane />
            </section>
        </HydrationBoundary>
    )
}

export default Product;