import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, View, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import { IMAGE } from '../../../Utils/Values';
import { UserServices } from '../../../Store/Services/user-services';
import { firebase } from '@react-native-firebase/storage';
import EmptyView from '../../BaseComponents/EmptyView';
import { MMKV } from 'react-native-mmkv';
import firestore from '@react-native-firebase/firestore';
import { SIZES } from '../../../Utils/Values';
import auth from '@react-native-firebase/auth';

interface Props {
    color: any;
    language: any;
    navigation: any;
    userInfor: any;
    onFinish: () => void;
}

const TestLevel: FC<Props> = (props) =>
{
    const { color, language, navigation, userInfor, onFinish } = props;
    const styles = styleScaled(color);
    const [step, setStep] = useState(0);
    const [preStep, setPreStep] = useState(0);

    const animationProcessValue = useRef(new Animated.Value(0)).current;
    useEffect(() =>
    {
        Animated.timing(animationProcessValue, {
            toValue: step,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [step, animationProcessValue]);
    const w = SIZES.WIDTH_WINDOW * 0.85;
    const animationProcess = {
        width: animationProcessValue.interpolate({
            inputRange: preStep < step ? [preStep, step] : [step, preStep],
            outputRange: [w * (preStep / 4), w * (step / 4)],
        }),
    };
    const subAnimationProcess = {
        width: animationProcessValue.interpolate({
            inputRange: preStep < step ? [preStep, step] : [step, preStep],
            outputRange: [w * (preStep / 4) * 0.8, w * (step / 4) * 0.8],
        }),
    };

    return (
        <View style={[styles.container, styles.bgColor]}>
            <View
                style={{
                    flexDirection: 'row',
                    width: SIZES.WIDTH_WINDOW,
                    justifyContent: 'space-around',
                }}
            >
                <TouchableOpacity
                    style={{
                        width: SIZES.WIDTH_WINDOW * 0.05,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() =>
                    {
                        setPreStep(step);
                        step !== 0 && setStep(step - 1);
                    }}
                >
                    <Icon
                        type={'MaterialCommunityIcons'}
                        name={'image-plus'}
                        size={moderateScale(22, 0.3)}
                        color={'red'}
                    />
                </TouchableOpacity>
                <View style={styles.processBar}>
                    <Animated.View style={[styles.percent, animationProcess]}>
                        <Animated.View style={[styles.subPercent, subAnimationProcess]} />
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

export default memo(TestLevel);
