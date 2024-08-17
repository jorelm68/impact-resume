import React from 'react';
import Text from "./Text";
import View from "./View";

export default function Dots() {
    const createDots = (totalDots: number) => {
        return Array(totalDots).fill('•');
    };

    const dots = createDots(44);

    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            width: '1.5rem',
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.1rem',
            }}>
            {dots.map((dot, index) => (
                <Text key={index} style={{
                    fontSize: '0.75rem',
                    lineHeight: '0.25rem',
                    textAlign: 'center',
                    color: 'grey',
                }}>
                    {dot}
                </Text>
            ))}
            </View>
        </View>
    );
}
