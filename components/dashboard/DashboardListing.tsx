'use client'

import { getSellerProducts } from "@/api/product/endpoints";
import { AuthContext } from "@/context/AuthContextProvider";
import { useQuery } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from "react";
import ListingItem from "./ListingItem";
import { nanoid } from "nanoid";
import ProductUploadForm from "../form/ProductUploadForm";
import { Button } from "../ui/button";
import Loading from "@/app/(category)/loading";
import { deleteProduct } from "@/api/product/endpoints";

const DashboardListing = () => {
    const [showForm, setShowForm] = useState(false);
    const { auth } = useContext(AuthContext);
    const { data: sellerProducts, isFetching, isSuccess, isLoading } = useQuery({
        queryKey: ['seller-product'],
        queryFn: () => getSellerProducts(Number(auth?.id) ?? -1, 'PRODUCT')
    });

    const onDeleteProduct = async (productId: number) => {
        try {
          await deleteProduct(productId);
          toast.success('Product deleted successfully');
        } catch (error) {
          console.error('Error deleting product:', error.message);
          toast.error('Error deleting product');
        }
      };

    useEffect(() => {
        setShowForm(false);
    }, [isSuccess])

    if (isFetching) {
        return <Loading />
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between px-4 lg:px-0">
                <p className="hidden font-medium lg:block">Listings</p>
                <Button className="font-semibold px-4 py-0 -mt-2"
                    onClick={() => setShowForm(prev => !prev)}>
                    {showForm ? 'Product listing' : 'Add a new listing'}
                </Button>
            </div>
            <div className="border-0 rounded-xl px-4 mt-4 lg:p-10 lg:mt-2 lg:border-[0.5px] lg:border-[#C4C4C4]">
                <div className="flex flex-col justify-between max-h-[100vh] overflow-y-scroll no-scrollbar">
                    {
                        (isSuccess && ((sellerProducts?.data.length ?? 0) > 0) && !showForm) ?
                            sellerProducts?.data.map((item) => <ListingItem key={nanoid()} {...item} onDelete={() => onDeleteProduct(item.id)} />) :
                            <ProductUploadForm />
                    }
                </div>
            </div>
        </div>
    )
}

export default DashboardListing;