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
import auth from '@react-native-firebase/auth';
import { GIF } from '../../../Utils/Values';

interface Props {
    color: any;
    language: any;
    navigation: any;
    userInfor: any;
    onFinish: () => void;
}

const Howlearn: FC<Props> = (props) =>
{
    const { color, language, navigation, userInfor, onFinish } = props;
    const styles = styleScaled(color);
    const [step, setStep] = useState<number>(0);
    const [showGif, setShowGif] = useState(false);

    const animationProcessValue = useRef(new Animated.Value(0)).current;
    useEffect(() =>
    {
        Animated.timing(animationProcessValue, {
            toValue: step,
            duration: 300,
            useNativeDriver: false,
        }).start();
        // animationProcessValue.setValue(step);
    }, [step, animationProcessValue]);
    const animationGifValue = useRef(new Animated.ValueXY({ x: -100, y: 100 })).current;
    const animationTxtValue = useRef(new Animated.Value(100)).current;
    useEffect(() =>
    {
        showGif &&
            Animated.timing(animationTxtValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        // animationProcessValue.setValue(step);
    }, [showGif, animationTxtValue]);
    useEffect(() =>
    {
        showGif &&
            Animated.timing(animationGifValue, {
                toValue: { x: 0, y: 2 },
                duration: 300,
                useNativeDriver: false,
            }).start();
        // animationProcessValue.setValue(step);
    }, [showGif, animationGifValue]);

    const w = SIZES.WIDTH_WINDOW * 0.85;
    const animationProcess = {
        width: animationProcessValue.interpolate({
            inputRange: [0, 1] || [1, 2] || [2, 3] || [3, 4],
            outputRange: [0, w * (1 / 4)] || [w * (1 / 4), w * (2 / 4)] || [w * (2 / 4), w * (3 / 4)] || [w * (3 / 4), w + 0],
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
        { title: 'EZ', subTitle: 3 },
        { title: 'NORMAL', subTitle: 10 },
        { title: 'MID2', subTitle: 20 },
        { title: 'HARD', subTitle: 40 },
        { title: 'HARD CORE', subTitle: 80 },
    ];

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
                        setShowGif(false);
                        setPass(true);
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
            {!showGif ? (
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
                                        <Text style={styles.content}>{language[x]}</Text>
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
                                        <Text style={styles.content}>{language[x]}</Text>
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
                                        <Text style={styles.content}>{language[x]}</Text>
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
                                        <Text style={styles.content}>{language[x.title]}</Text>
                                        <Text style={styles.subContent}>
                                            {language[x.subTitle]} {language.MIN_PER_DAY}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {step === 4 && (
                        <View style={{ width: '100%' }}>
                            <Text style={[styles.title, { textAlign: 'left', marginBottom: 1 }]}>{language.PUR_WHEN_FINISH}</Text>
                            <Text style={styles.subTitle}>{language.SUB_PUR_WHEN_FINISH}</Text>
                            <View
                                style={[
                                    styles.cardBox,
                                    {
                                        justifyContent: 'space-between',
                                        flexDirection: 'column',
                                        paddingVertical: 0,
                                    },
                                ]}
                            >
                                <View style={styles.kh}>
                                    <View>
                                        <Image
                                            style={styles.avatar}
                                            // source={}
                                            resizeMode={'cover'}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.content}>{language.CONFIDENT_CONVERSATION}</Text>
                                        <Text style={styles.subContent2}>{language.SUB_CONFIDENT_CONVERSATION}</Text>
                                    </View>
                                </View>

                                <View style={styles.kh}>
                                    <View>
                                        <Image
                                            style={styles.avatar}
                                            // source={}
                                            resizeMode={'cover'}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.content}>{language.CONFIDENT_CONVERSATION}</Text>
                                        <Text style={styles.subContent2}>{language.SUB_CONFIDENT_CONVERSATION}</Text>
                                    </View>
                                </View>

                                <View style={[styles.kh, { borderBottomWidth: 0 }]}>
                                    <View>
                                        <Image
                                            style={styles.avatar}
                                            // source={}
                                            resizeMode={'cover'}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.content}>{language.CONFIDENT_CONVERSATION}</Text>
                                        <Text style={styles.subContent2}>{language.SUB_CONFIDENT_CONVERSATION}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
            ) : (
                <View style={{ flex: 1, width: SIZES.WIDTH_WINDOW * 0.92, justifyContent: 'flex-end' }}>
                    <Animated.View
                        style={[
                            styles.FloatTxt,
                            {
                                translateX: animationTxtValue,
                            },
                        ]}
                    >
                        <Text style={[styles.title, { textAlign: 'left' }]}>{language.TEST_YOUR_LEVEL}</Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            translateX: animationGifValue.x,
                            translateY: animationGifValue.y,
                        }}
                    >
                        <Image
                            style={[styles.clickGif]}
                            source={require('../../Assets/gif/click.gif')}
                            // resizeMode={'cover'}
                            width={200}
                            height={300}
                        />
                    </Animated.View>
                </View>
            )}

            <View style={styles.containerBtnNext}>
                <TouchableOpacity
                    style={[styles.btnNext, Pass === false && styles.disabled]}
                    disabled={Pass === false ? true : false}
                    onPress={() =>
                    {
                        step >= 3 ? setPass(true) : setPass(false);
                        step !== 4 && !showGif
                            ? setStep(step + 1)
                            : step === 4 && !showGif
                                ? firestore()
                                    .collection('Users')
                                    .doc(auth().currentUser?.uid)
                                    .update({
                                        howKnowWe: knowFrom[currentIndexChoose1],
                                        level: level[currentIndexChoose2],
                                        whyLearn: whyLearn[currentIndexChoose3],
                                        purpose: purpose[currentIndexChoose4],
                                        // reverseName: true,
                                    })
                                    .then(() =>
                                    {
                                        setShowGif(true);
                                    })
                                : onFinish();
                    }}
                >
                    <Text style={[styles.btnTxt, Pass === false && { color: '#676767' }]}>{language.CONTINUE}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default memo(Howlearn);
