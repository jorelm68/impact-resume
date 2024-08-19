import { ChangeEvent, ChangeEventHandler, useState } from "react";
import View from "./View";
import { CheckboxProps } from "@/lib/props";

export default function Checkbox({ isChecked, onChange }: CheckboxProps) {
    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
            />
        </View>
    );
}
