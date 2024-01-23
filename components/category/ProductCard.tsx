import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import product from '@/public/product.png'
import { Heart, MapPin } from "lucide-react";
import { Data } from "@/lib/types/category/ProductInterface";
import { Data as ProductData } from "@/lib/types/product/ProductInterface";
import { FC, useContext } from "react";
import { currencyFormatter, userLoggedIn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/AuthContextProvider";
import { useMutation } from "@tanstack/react-query";
import { markFavorite } from "@/api/product/endpoints";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProductCard: FC<Data | ProductData> = (data) => {
    const router = useRouter();
    const { auth } = useContext(AuthContext);
    const markFav = useMutation({
        mutationFn: () => markFavorite(data.id),
        onSuccess(responseData, variables, context) {
            toast.success(`${data.name} is marked as favourite!`);
        },
        onError(error, variables, context) {
            toast.error('Something went wrong');
        }
    });
    return (
        <Link href={data.category ? `/${data?.category?.name?.toLowerCase()}/${data.id}` : `/request/${data.id}`} legacyBehavior passHref>
            <Card className="relative overflow-hidden border border-[#E8E8E8] shadow-none drop-shadow-none transition-all duration-200 rounded-[8px] hover:shadow-sm hover:cursor-pointer">
                <CardHeader className="relative p-0 items-center overflow-hidden">
                    <div className="relative w-[300px] h-[200px]">
                        <Image fill style={{ objectFit: 'cover' }} src={data.image.images.length > 0 ? data.image.images[0] : product} alt="" />
                    </div>
                    {/* <Image src={data.image.images.length > 0 ? data.image.images[0] : product}
                        width={250}
                        height={100}
                        sizes="(max-width: 640px) 100vw,
                      (max-width: 1280px) 50vw,
                      (max-width: 1536px) 33vw,
                      25vw"
                        alt="" /> */}
                </CardHeader>
                <CardContent className="p-2 lg:p-3">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <p className="text-[#878787] text-[10px] font-normal">{data.name}</p>
                            <p className="text-black text-[12px] whitespace-pre-wrap text-ellipsis line-clamp-2 font-medium lg:text-[14px]">{data.description}</p>
                        </div>
                        {data.price &&
                            <Button disabled={markFav.isPending} variant="ghost" size="icon" onClick={(e) => {
                                e.stopPropagation();
                                if (userLoggedIn(auth)) {
                                    markFav.mutate();
                                    return;
                                }
                                router.push('/login');
                            }}>
                                <Heart className="w-5 h-5" stroke="black" />
                            </Button>
                        }
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between p-2 lg:p-3">
                    {data.address &&
                        <div className="flex justify-between items-center text-[#737373] space-x-1">
                            <MapPin className="w-5 h-5" />
                            <p className="text-[10px] font-normal whitespace-pre-wrap text-ellipsis line-clamp-2">{data.address}</p>
                        </div>
                    }
                    {data.price &&
                        <p className="text-black text-[12px] font-semibold lg:text-[14px]">
                            {currencyFormatter(data.price)}
                        </p>
                    }
                </CardFooter>
            </Card>
        </Link>
    )
}

export default ProductCard;