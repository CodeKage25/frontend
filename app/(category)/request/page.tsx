'use client'

import ItemRequestForm from "@/components/form/ItemRequestForm";
import ServiceRequestForm from "@/components/form/ServiceRequestForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Request = () => {
    const [form, setForm] = useState(0);
    return (
        <section className="container bg-[url('./../public/bg.png')] flex flex-col mx-auto px-3 py-6 lg:px-[60px]">
            <div className="bg-white border-[.5px] border-[#EAEAEA] p-6 rounded-[20px] shadow-[6px_6px_16px_0px_#D1CDC740] lg:py-20 lg:px-36">
                <h1 className="font-medium text-black text-2xl lg:text-4xl">Request Special Item</h1>
                <p className="text-[#253B4B] text-sm mt-2 font-medium">
                    Cant find what you are looking for? Someone here might have what you need, submit a request below.
                </p>
                <div className="w-full flex items-end border-b-[1px] mt-5">
                    <Button variant='ghost' className={`${form === 0 && 'border-b-2 rounded-none border-b-primary'} py-0`} onClick={() => setForm(0)}>
                        Special Item
                    </Button>
                    <Button variant='ghost' className={`${form === 1 && 'border-b-2 rounded-none border-b-primary'} py-0`} onClick={() => setForm(1)}>
                        Services
                    </Button>
                </div>
                {form === 0 ?
                    <ItemRequestForm /> : <ServiceRequestForm />
                }
            </div>
        </section>
    )
}

export default Request;