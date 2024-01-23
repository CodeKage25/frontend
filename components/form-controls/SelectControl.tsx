import { ErrorMessage, Field, FieldProps } from "formik";
import { FC } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SelectProps {
    name: string;
    label: string;
    placeholder?: string;
    options?: any[];
    handleChange?: (id: number) => void;
}

const SelectControl: FC<SelectProps> = ({ name, label, placeholder, handleChange, options }) => {
    return (
        <div>
            <Field name={name}>
                {
                    (props: FieldProps) => (
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor={name} className="text-[#253B4B] text-xs">{label}</Label>
                            <Select onValueChange={(value) => {
                                props.form.setFieldValue(name, value);
                                handleChange && handleChange(Number(value));
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        options?.map((item, index) => (
                                            <SelectItem key={index} id={name} value={item?.id ? `${item.id}` : item}>
                                                {item?.name ?? item}
                                            </SelectItem>)
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    )
                }
            </Field>
            <ErrorMessage name={name} render={msg => <small className="text-red-500 text-xs">{msg}</small>} />
        </div>
    )
}

export default SelectControl;