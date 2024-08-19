import React from 'react';
import View from "./View";
import { DotsProps } from '@/lib/props';
import Text from './Text';

export default function Dots({ dragHandleProps }: DotsProps) {
    return (
        <View style={{
            minWidth: '24px',
            minHeight: '24px',
            maxWidth: '24px',
            maxHeight: '100%',
            backgroundColor: '#ccc',
            borderRadius: '8px',
            overflow: 'hidden', // Hide overflow
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
        }} dragHandleProps={dragHandleProps}>
            {Array.from({ length: 4 }, () => '•').map((char, index) => (
                <Text key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    lineHeight: '1px',
                    color: 'grey',
                }}>
                    {char}
                </Text>
            ))}
        </View>
    );
}
