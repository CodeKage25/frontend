import { ErrorMessage, Field, FieldProps } from "formik";
import { FC } from "react";
import { Input } from "../ui/input";

import Image from "next/image";

interface InputProps {
    name: string;
    label: string;
    type: string;
    icon?: any;
}

const InputControl: FC<InputProps> = ({ name, label, type, icon }) => {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className="relative">
                            <div className="absolute rounded-tl-[10px] rounded-bl-[10px] inset-y-0 left-0 px-5 flex items-center overflow-hidden bg-[#EBEBEB] pointer-events-none">
                                <Image src={icon} width={16} height={20} alt="" />
                            </div>
                            <Input type={type} className="block border-0 ring-[1px] ring-input rounded-[10px] w-full p-7 pl-16 text-sm bg-[#F0F0F1]"
                                id={name} placeholder={label} {...props.field} />
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className="text-red-500 text-xs">{msg}</small>} />
        </div>
    )
}

export default InputControl;