import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    iconContainer: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface Props {
    children: any;
}

const BounceView: React.FC<Props> = ({ children }) =>
{
    // Initial scale value of 1 means no scale applied initially.
    const animatedButtonScale = new Animated.Value(1);
    // When button is pressed in, animate the scale to 1.5
    const onPressInFunc = () =>
    {
        Animated.spring(animatedButtonScale, {
            toValue: 1.2,
            useNativeDriver: true,
        }).start();
    };

    // When button is pressed out, animate the scale back to 1
    const onPressOutFunc = () =>
    {
        Animated.spring(animatedButtonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    // The animated style for scaling the button within the Animated.View
    const animatedScaleStyle = {
        transform: [{ scale: animatedButtonScale }],
    };

    return (
        <Pressable
            onPressIn={onPressInFunc}
            onPressOut={onPressOutFunc}
        >
            <Animated.View style={[styles.iconContainer, animatedScaleStyle]}>{children}</Animated.View>
        </Pressable>
    );
};

export default BounceView;
