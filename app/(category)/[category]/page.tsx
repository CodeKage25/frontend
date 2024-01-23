import {
    getCategory,
    getCategoryProducts,
  } from "@/api/category/endpoints";
  import Loading from "@/app/loading";
  import LeftPane from "@/components/category/LeftPane";
  import RightPane from "@/components/category/RightPane";
  import getQueryClient from "@/lib/getQueryClient";
import { CategoryInterface } from "@/lib/types/category/CategoryInterface";
  import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
  import { Metadata, ResolvingMetadata } from "next";
  import { Suspense } from "react";
  
  // Assuming that getCategory has a signature like this:
  // (id: number) => Promise<CategoryInterface>
  
  // Update the signature to match the expected type for queryFn
  type Props = {
    params: { category: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };
  
  export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> {
    const category = params.category;
    return {
      title: `${category} - category | Buy on Katangwa`,
      description: '',
    };
  }
  
  const Category = async ({
    params,
    searchParams,
  }: {
    params: { category: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }) => {
    const {
      catId,
      subcatId,
      condition,
      minPrice,
      maxPrice,
      log,
      lan,
    } = searchParams;
    const queryClient = getQueryClient();
  
    // Use the existing getCategory function with the correct type
    // await queryClient.prefetchQuery({
    //   queryKey: ['category'],
    //   queryFn: getCategory,
    // });
  
    await queryClient.prefetchQuery({
      queryKey: [
        'category',
        params.category.includes('buy') ? 'all' : catId,
        subcatId,
        condition,
        minPrice,
        maxPrice,
        log,
        lan,
      ],
      queryFn: () =>
        getCategoryProducts(
          catId as string,
          subcatId as string,
          condition as string,
          minPrice as string,
          maxPrice as string,
          log as string,
          lan as string
        ),
    });
  
    const dehydratedState = dehydrate(queryClient);
  
    return (
      <HydrationBoundary state={dehydratedState}>
        <section className="container mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_4fr]">
          <div className="hidden lg:block">
            <LeftPane />
          </div>
          <Suspense
            key={`${params.category.includes('buy') ? 'all' : catId}-${subcatId}-${condition}-${minPrice}-${maxPrice}-${log}-${lan}`}
            fallback={<Loading />}
          >
            <RightPane id={Number(catId)} />
          </Suspense>
        </section>
      </HydrationBoundary>
    );
  };
  
  export default Category;
  