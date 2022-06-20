import React from 'react';
import { Animated, GestureResponderEvent, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { SHADOW_2 } from '../../../Utils/Values';

const styles = StyleSheet.create({
    iconContainer: {
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface Props {
    children: any;
    onPress?: (_event: GestureResponderEvent) => void;
    onPressIn?: (_event: GestureResponderEvent) => void;
    onPressOut?: (_event: GestureResponderEvent) => void;
    style?: ViewStyle;
    backgroundColor?: string;
    type?: 'round' | 'square';
}

const Button: React.FC<Props> = ({ children, onPress, onPressOut, onPressIn, style, backgroundColor, type }) =>
{
    // Initial scale value of 1 means no scale applied initially.
    const animatedButtonScale = new Animated.Value(1);

    const bg = backgroundColor ? backgroundColor : 'white';
    // When button is pressed in, animate the scale to 1.5
    const onPressInFunc = (event: GestureResponderEvent) =>
    {
        onPressIn && onPressIn(event);
        Animated.spring(animatedButtonScale, {
            toValue: 1.2,
            useNativeDriver: true,
        }).start();
    };

    // When button is pressed out, animate the scale back to 1
    const onPressOutFunc = (event: GestureResponderEvent) =>
    {
        onPressOut && onPressOut(event);
        Animated.spring(animatedButtonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    // The animated style for scaling the button within the Animated.View
    const animatedScaleStyle = {
        transform: [{ scale: animatedButtonScale }],
    };

    if (type === 'round')
    {
        return (
            <Pressable
                style={[{ ...SHADOW_2, ...style, borderRadius: 37.5 }]}
                onPress={onPress}
                onPressIn={onPressInFunc}
                onPressOut={onPressOutFunc}
            >
                <Animated.View style={[{ ...styles.iconContainer, borderRadius: 37.5, width: 75, height: 75 }, animatedScaleStyle, { backgroundColor: bg }]}>
                    {children}
                </Animated.View>
            </Pressable>
        );
    }

    return (
        <Pressable
            style={[{ ...SHADOW_2, ...style, borderRadius: 10 }]}
            onPress={onPress}
            onPressIn={onPressInFunc}
            onPressOut={onPressOutFunc}
        >
            <Animated.View style={[{ ...styles.iconContainer, borderRadius: 10 }, animatedScaleStyle, { backgroundColor: bg }]}>{children}</Animated.View>
        </Pressable>
    );
};

export default Button;
