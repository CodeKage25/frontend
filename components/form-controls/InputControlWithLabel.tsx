import { ErrorMessage, Field, FieldProps } from "formik";
import { FC } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputProps {
    name: string;
    label: string;
    type: string;
    placeholder?: any;
    disabled?: boolean;
}

const InputControlWithLabel: FC<InputProps> = ({ name, label, type, placeholder, disabled }) => {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className="flex flex-col space-y-3">
                            <Label htmlFor={name} className="text-[#253B4B] text-xs">{label}</Label>
                            <Input type={type} className="block border-0 ring-[1px] ring-input rounded-[10px] w-full p-7 text-sm bg-[#F0F0F1]"
                                id={name} placeholder={placeholder} disabled={disabled} {...props.field} />
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className="text-red-500 text-xs">{msg}</small>} />
        </div>
    )
}

export default InputControlWithLabel;