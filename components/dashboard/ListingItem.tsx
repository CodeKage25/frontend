import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MapPin } from 'lucide-react';
import { FC } from 'react';
import { Data } from '@/lib/types/category/ProductInterface';
import { currencyFormatter } from '@/lib/utils';
import { toast } from 'react-toastify';

// interface ListingItemProps extends Data {
//   onDelete: () => void;
// }

const ListingItem: FC<Data & { onDelete: () => void }> = (data) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this product?');

      if (confirmDelete) {
        setIsDeleting(true);
        await data.onDelete();
        // toast.success('Product deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    //   toast.error('Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border border-[#E8E8E8] mb-5 rounded-xl grid grid-cols-1 lg:grid-cols-[1.3fr_4fr] hover:shadow-sm hover:cursor-pointer">
      <div className="relative">
        <Image src={data.image.images[0]} fill alt="" />
      </div>

      <div className="flex flex-col p-4">
        <p className="text-[#878787] text-[10px] font-normal">{data.name}</p>
        <p className="text-black text-[14px] font-medium line-clamp-2 lg:text-[14px]">{data.description}</p>
        <div className="flex justify-between items-start mt-5">
          <p className="text-black text-base font-semibold lg:text-[14px]">{currencyFormatter(data.price)}</p>
          <div className="flex flex-col space-y-3">
            <Button className="px-6 font-semibold" size="sm">
              Edit
            </Button>
            <Button
              size="sm"
              className="bg-red-600 px-6 font-semibold"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
        {data.address && (
          <div className="flex items-center text-[#737373] space-x-1">
            <MapPin className="w-5 h-5" />
            <p className="text-[10px] font-normal">{data?.address}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingItem;
