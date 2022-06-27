import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, View, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../BaseComponents/Icon';
import styleScaled from './style';
import { IMAGE } from '../../../Utils/Values';
import { UserServices } from '../../../Store/Services/user-services';
import { firebase } from '@react-native-firebase/storage';
import EmptyView from '../../BaseComponents/EmptyView';
import { MMKV } from 'react-native-mmkv';
import firestore from '@react-native-firebase/firestore';
import { SIZES } from '../../Utils/Values';

interface Props {
    color: any;
    language: any;
    navigation: any;
    userInfor: any;
}

const Howlearn: FC<Props> = (props) =>
{
    const { color, language, navigation, userInfor } = props;
    const styles = styleScaled(color);
    const [step, setStep] = useState<number>(0);

    const animationProcessValue = useRef(new Animated.Value(0)).current;

    useEffect(() =>
    {
        Animated.timing(animationProcessValue, {
            toValue: step,
            duration: 500,
            useNativeDriver: false,
        }).start();
        // animationProcessValue.setValue(step);
    }, [step, animationProcessValue]);
    const w = SIZES.WIDTH_WINDOW - SIZES.WIDTH_WINDOW * 0.08;
    const animationProcess = {
        width: animationProcessValue.interpolate({
            inputRange: [0, 1] || [1, 2] || [2, 3] || [3, 4],
            outputRange: [0, w * (1 / 4)] || [w * (1 / 4), w * (2 / 4)] || [w * (2 / 4), w * (3 / 4)] || [w * (3 / 4), w],
        }),
    };
    const subAnimationProcess = {
        width: animationProcessValue.interpolate({
            inputRange: [0, 1] || [1, 2] || [2, 3] || [3, 4],
            outputRange: [0, w * (1 / 4) * 0.8] || [w * (1 / 4) * 0.8, w * (2 / 4) * 0.8] || [w * (2 / 4) * 0.8, w * (3 / 4) * 0.8] || [w * (3 / 4) * 0.8, w * 0.8],
        }),
    };

    const [currentIndexChoose1, setCurrentIndexChoose1] = useState(999);
    const [currentIndexChoose2, setCurrentIndexChoose2] = useState(999);
    const [currentIndexChoose3, setCurrentIndexChoose3] = useState(999);
    const [currentIndexChoose4, setCurrentIndexChoose4] = useState(999);
    const [Pass, setPass] = useState(false);

    const knowFrom = ['FRIENDS/FAMYLI', 'TV', 'TIKTOK', 'YOUTUBE', 'GGSTORE', 'NEWSPAPER', 'FB_INS', 'OTHER'];
    const level = ['LOW', 'MID', 'HIGHT'];
    const whyLearn = ['CULTURE', 'MAKE_FRIENDS_AND_SHARE', 'SHCOOL', 'BRAIN', 'JOB', 'TRAVEL', 'OTHER'];
    const purpose = [
        { title: 'ez', subTitle: 3 },
        { title: 'normal', subTitle: 10 },
        { title: 'mid', subTitle: 20 },
        { title: 'hard', subTitle: 40 },
        { title: 'hard core', subTitle: 80 },
    ];

    return (
        <View style={[styles.container, styles.bgColor]}>
            <View style={styles.processBar}>
                <Animated.View style={[styles.percent, animationProcess]}>
                    <Animated.View style={[styles.subPercent, subAnimationProcess]} />
                </Animated.View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {step === 0 && (
                    <View style={{ width: '100%' }}>
                        <Text style={styles.title}>{language.HOW_U_KNOW_WE}</Text>
                        {knowFrom.map((x, index) =>
                        {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.cardBox, index === currentIndexChoose1 && styles.cardChoosed]}
                                    onPress={() =>
                                    {
                                        setPass(true);
                                        setCurrentIndexChoose1(index);
                                    }}
                                >
                                    <View>
                                        <Image
                                            style={styles.avatar}
                                            // source={}
                                            resizeMode={'cover'}
                                        />
                                    </View>
                                    <Text style={styles.content}>{x}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {step === 1 && (
                    <View style={{ width: '100%' }}>
                        <Text style={styles.title}>{language.LEVEL_ENG}</Text>
                        {level.map((x, index) =>
                        {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.cardBox, index === currentIndexChoose2 && styles.cardChoosed]}
                                    onPress={() =>
                                    {
                                        setPass(true);
                                        setCurrentIndexChoose2(index);
                                    }}
                                >
                                    <View>
                                        <Image
                                            style={styles.avatar}
                                            // source={}
                                            resizeMode={'cover'}
                                        />
                                    </View>
                                    <Text style={styles.content}>{x}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {step === 2 && (
                    <View style={{ width: '100%' }}>
                        <Text style={styles.title}>{language.WHY_LEARN}</Text>
                        {whyLearn.map((x, index) =>
                        {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.cardBox, index === currentIndexChoose3 && styles.cardChoosed]}
                                    onPress={() =>
                                    {
                                        setPass(true);
                                        setCurrentIndexChoose3(index);
                                    }}
                                >
                                    <View>
                                        <Image
                                            style={styles.avatar}
                                            // source={}
                                            resizeMode={'cover'}
                                        />
                                    </View>
                                    <Text style={styles.content}>{x}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {step === 3 && (
                    <View style={{ width: '100%' }}>
                        <Text style={styles.title}>{language.PURPOSE_LEARN}</Text>
                        {purpose.map((x, index) =>
                        {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.cardBox, { justifyContent: 'space-between', flexDirection: 'row' }, index === currentIndexChoose4 && styles.cardChoosed]}
                                    onPress={() =>
                                    {
                                        setPass(true);
                                        setCurrentIndexChoose4(index);
                                    }}
                                >
                                    <Text style={styles.content}>{x.title}</Text>
                                    <Text style={styles.subContent}>
                                        {x.subTitle} {language.MIN_PER_DAY}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
            <View style={styles.containerBtnNext}>
                <TouchableOpacity
                    style={[styles.btnNext, Pass === false && styles.disabled]}
                    disabled={Pass === false ? true : false}
                    onPress={() =>
                    {
                        setPass(false);
                        setStep(step + 1);
                    }}
                >
                    <Text style={[styles.btnTxt, Pass === false && { color: '#676767' }]}>{language.CONTINUE}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default memo(Howlearn);
