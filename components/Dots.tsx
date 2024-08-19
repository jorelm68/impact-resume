import React from 'react';
import View from "./View";
import { DotsProps } from '@/lib/props';

export default function Dots({ dragHandleProps }: DotsProps) {
    return (
        <View style={{
            width: '24px',
            minHeight: '24px',
            backgroundColor: '#ccc',
            borderRadius: '8px',
        }} dragHandleProps={dragHandleProps} />
    );
}
