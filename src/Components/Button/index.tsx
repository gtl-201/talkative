import React from 'react';
import { Pressable, StyleProp, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../BaseComponents/Icon';
import { moderateScale, scale } from 'react-native-size-matters';
import styleScaled from './style';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';

interface ButtonProps {
    color?: any;
    colorIc?: string;
    title?: string;
    onPressIc?: () => void;
    icon?: string;
    type?: string;
    bgColor?: string;
}

function Button({ color, colorIc, title, icon = '', type = '', bgColor, onPressIc = () => {} }: ButtonProps)
{
    const navigation = useNavigation();
    const styles = styleScaled(color);

    return (
        <TouchableOpacity
            style={[styles.btn, { backgroundColor: bgColor ?? '#3d3f3f' }]}
            onPress={() => onPressIc()}
        >
            <Text style={styles.txtBtn}>
                <Icon
                    type={type}
                    name={icon}
                    size={moderateScale(30, 0.5)}
                    color={colorIc ?? 'white'}
                />
            </Text>
        </TouchableOpacity>
    );
}

function mapStateToProps(state: any)
{
    return {
        color: state.controlApp.settings.color.HEADER,
    };
}

export default connect(mapStateToProps)(Button);
