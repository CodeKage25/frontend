'use client';

import PasswordUpdateForm from "@/components/form/PasswordUpdateForm";
import ProfileUpdateForm from "@/components/form/ProfileUpdateForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const Settings = () => {
    const [currentForm, setCurrentForm] = useState(0);

    return (
        <div className="flex flex-col h-full">
            <p className="hidden font-medium lg:block">Settings</p>
            <div className="h-full grid grid-cols-1 gap-x-4 border-0 rounded-xl px-2 lg:grid-cols-[0.8fr_3fr_1.5fr] lg:mt-4 lg:p-8 lg:border-[0.5px] lg:border-[#C4C4C4]">
                <div className="flex flex-col text-sm space-y-3">
                    <Button className="p-0" variant={currentForm === 0 ? 'default' : 'link'} onClick={() => {
                        setCurrentForm(0);
                    }}>Edit Profile</Button>
                    <Link href='/password-reset' legacyBehavior passHref>
                        <Button className="p-0" variant={currentForm === 1 ? 'default' : 'link'} onClick={() => {
                            setCurrentForm(1);
                        }}>Password</Button>
                    </Link>
                </div>
                {/* {
                    currentForm === 0 ? <ProfileUpdateForm /> : <PasswordUpdateForm />
                } */}
                <ProfileUpdateForm />
            </div>
        </div>
    );
}

export default Settings;