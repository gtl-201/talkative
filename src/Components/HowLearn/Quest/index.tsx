import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View, Animated, Image, ImageBackground, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale, scale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import { getAchievements, getQuest, updateArchivement } from '../../../Store/Services/user-services';
import { SIZES } from '../../../Utils/Values';
// import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';

import SoundPlayer from 'react-native-sound-player';

interface Props {
    color: any;
    language: any;
    navigation: any;
    gate: string;
    round: string;
    level: string;
}

const Quest: FC<Props> = (props) =>
{
    // const navigation = useNavigation();
    const { color, language, navigation, gate, round, level } = props;
    const styles = styleScaled(color);
    const [step, setStep] = useState(0);
    const [preStep, setPreStep] = useState(0);

    // GET DATA START
    const [dataQuest, setDataQuest] = useState<any[]>([]);
    const [listRightVi, setListRightVi] = useState<string[]>([]);
    const [listRightEn, setListRightEn] = useState<string[]>([]);
    const [choosedItem, setChoosedItem] = useState(':::');
    const [questRen, setQuestRen] = useState<string[]>([]);
    const [showBottomResult, setShowBottomResult] = useState(false);
    const [resultTrue, setResultTrue] = useState(true);
    const [rightAndWrong, setRightAndWrong] = useState<any[]>([]);
    // For type 2
    const [choosedListItem, setChoosedListItem] = useState<any[]>([]);
    // For show last screen
    const [showLastResult, setShowLastResult] = useState(false);

    useEffect(() =>
    {
        Tts.setDefaultVoice('com.apple.ttsbundle.siri_male_en-US_compact');
        // console.log(gate, round, '?????');
        const getAllQuest = async () =>
        {
            const allQuest = await getQuest(gate, round, level);
            // console.log(allQuest);
            const allRightEn: any[] = allQuest.map((data) =>
            {
                if (data.type === 2)
                {
                    const tmpData = data.rightEn;
                    return tmpData.split(/(\s+)/).filter((e: any) =>
                    {
                        return e.trim().length > 0;
                    });
                }
                return data.rightEn;
            });
            // console.log(allRightEn.flat());
            const allRightVi = allQuest.map((data) =>
            {
                if (data.type === 2)
                {
                    const tmpData = data.rightVi;
                    return tmpData.split(/(\s+)/).filter((e: any) =>
                    {
                        return e.trim().length > 0;
                    });
                }
                return data.rightVi;
            });
            // console.log(allRightVi.flat());
            setListRightEn(allRightEn.flat());
            setListRightVi(allRightVi.flat());
            setDataQuest(allQuest);
        };
        SoundPlayer.loadUrl(
            'https://firebasestorage.googleapis.com/v0/b/spearker-d3cc4.appspot.com/o/audio%2Fquest%2Fcorrect.mp3?alt=media&token=516f372c-8f0f-49ec-8d06-24d62dfa022b',
        );
        SoundPlayer.loadUrl(
            'https://firebasestorage.googleapis.com/v0/b/spearker-d3cc4.appspot.com/o/audio%2Fquest%2Fwrong.mp3?alt=media&token=aca29f96-5935-4cee-97c4-dacb8ebb4038',
        );

        getAllQuest();
    }, []);
    // GET DATA END

    // ANIMATION START
    // ANIMATION PROCESSBAR
    const animationProcessValue = useRef(new Animated.Value(0)).current;
    useEffect(() =>
    {
        Animated.timing(animationProcessValue, {
            toValue: step,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [step, animationProcessValue]);
    const w = SIZES.WIDTH_WINDOW * 0.85;
    const animationProcess = {
        width: animationProcessValue.interpolate({
            inputRange: preStep < step ? [preStep, step] : [step, preStep],
            outputRange: [w * (preStep / 10), w * (step / 10)],
        }),
    };
    const subAnimationProcess = {
        width: animationProcessValue.interpolate({
            inputRange: preStep < step ? [preStep, step] : [step, preStep],
            outputRange: [w * (preStep / 10) * 0.8, w * (step / 10) * 0.8],
        }),
    };
    // ANIMATION BOTTOM RESULT
    const animationBottomResultValue = useRef(new Animated.Value(0)).current;
    useEffect(() =>
    {
        if (showBottomResult === true)
        {
            Animated.timing(animationBottomResultValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start(() =>
            {
                if (showBottomResult)
                {
                    resultTrue ? ring(true) : ring(false);
                }
            });
        }
    }, [showBottomResult, animationBottomResultValue]);
    const bottomResultAnimation = {
        height: animationBottomResultValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, !resultTrue ? 210 : 180],
        }),
    };
    // ANIMATION FLOATING SHOOT
    const shootAniationValue = useRef(new Animated.Value(0)).current;
    useEffect(() =>
    {
        Animated.timing(shootAniationValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start(() =>
        {
            shootAniationValue.setValue(0);
        });
    }, [shootAniationValue, step]);
    const shootAnimationSize = {
        width: shootAniationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 40],
        }),
        height: shootAniationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 40],
        }),
        opacity: shootAniationValue.interpolate({
            inputRange: [0, 0.6, 1],
            outputRange: [0, 1, 0],
        }),
    };
    const shootAnimationSize2 = {
        width: shootAniationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 30],
        }),
        height: shootAniationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 30],
        }),
        opacity: shootAniationValue.interpolate({
            inputRange: [0, 0.6, 1],
            outputRange: [0, 1, 0],
        }),
    };
    // ANIMATION END

    // RING START
    const ring = (right: boolean) =>
    {
        // SoundPlayer.stop();
        // try
        // {
        //     right === true
        //         ? SoundPlayer.playUrl(
        //             'https://firebasestorage.googleapis.com/v0/b/spearker-d3cc4.appspot.com/o/audio%2Fquest%2Fcorrect.mp3?alt=media&token=cc755513-a417-4bf9-b975-3e5f2b1bdf33',
        //         )
        //         : SoundPlayer.playUrl(
        //             'https://firebasestorage.googleapis.com/v0/b/spearker-d3cc4.appspot.com/o/audio%2Fquest%2Fwrong.mp3?alt=media&token=d79e75a4-b702-4875-809d-36a38743e09a',
        //         );
        // }
        // catch (error)
        // {
        //     console.log(error);
        // }
    };

    // RING END

    // QUEST TYPE 1 START
    const renAnsType1 = () =>
    {
        const allWrongEn = listRightEn.filter((x: any) =>
        {
            return x !== (dataQuest.length > 0 ? dataQuest[step].rightEn : '');
        });
        // console.log(allWrongEn, '?');

        const questRen = allWrongEn.sort(() => Math.random() - Math.random()).slice(0, 4);
        questRen[Math.floor(Math.random() * 4)] = dataQuest.length > 0 ? dataQuest[step].rightEn : '';
        // console.log(questRen, '?');
        setQuestRen(questRen);
    };

    useEffect(() =>
    {
        dataQuest && dataQuest[step] && dataQuest[step].type === 1 && renAnsType1();
    }, [dataQuest, step]);

    const Rendetype1 = () =>
    {
        return (
            <View style={{ flex: 1 }}>
                {dataQuest && dataQuest[step] && (
                    <>
                        <Text style={[styles.title, { marginTop: SIZES.HEIGHT_STATUSBAR }]}>{language.HOWTOTALK + ' "' + dataQuest[step].rightVi + '"?'} </Text>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            {questRen.map((data, index) => (
                                <TouchableOpacity
                                    key={index + data}
                                    style={[styles.cardBox, choosedItem === data && styles.cardChoosed]}
                                    onPress={() =>
                                    {
                                        setChoosedItem(data);
                                    }}
                                >
                                    <Text style={[styles.content, choosedItem === data && { color: '#59bfff' }]}>{data}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
            </View>
        );
    };
    // QUEST TYPE 1 END

    // QUEST TYPE 2 START
    const shuffle = (array: any[]) =>
    {
        let currentIndex = array.length;
        let randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0)
        {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    const renAnsType2 = () =>
    {
        const allWrongEn = listRightVi.filter((x: any) =>
        {
            return x !== (dataQuest.length > 0 ? dataQuest[step].rightVi : '');
        });
        // console.log(allWrongEn, '?');

        const questRen = allWrongEn.sort(() => Math.random() - Math.random()).slice(0, 8);

        questRen[Math.floor(Math.random() * 8)] =
            dataQuest.length > 0
                ? dataQuest[step].rightVi.split(/(\s+)/).filter((e: any) =>
                {
                    return e.trim().length > 0;
                })
                : '';
        // console.log(questRen.flat(), '?');
        setQuestRen(shuffle(questRen.flat()));
    };

    useEffect(() =>
    {
        dataQuest && dataQuest[step] && dataQuest[step].type === 2 && renAnsType2();
    }, [dataQuest, step]);

    const Rendetype2 = () =>
    {
        return (
            <View style={{ flex: 1 }}>
                {dataQuest && dataQuest[step] && (
                    <>
                        <Text style={[styles.title, { marginTop: SIZES.HEIGHT_STATUSBAR }]}>{language.TRANSLATETHIS} </Text>
                        {/* Speak */}
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() =>
                            {
                                Tts.setDefaultLanguage('en-IE');
                                Tts.speak(dataQuest[step].rightEn);
                            }}
                        >
                            <View style={styles.SpeakerIc}>
                                <Icon
                                    type={'MaterialIcons'}
                                    name={'volume-up'}
                                    size={moderateScale(23, 0.3)}
                                    color={'white'}
                                />
                            </View>
                            <Text style={[styles.content, { marginLeft: 5, fontSize: 15 }]}>{dataQuest[step].rightEn}</Text>
                        </TouchableOpacity>

                        {/* Txt Choosed */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', minHeight: 20, width: SIZES.WIDTH_WINDOW - 20, borderBottomWidth: 1, borderColor: 'black' }}>
                            {choosedListItem &&
                                choosedListItem.length > 0 &&
                                choosedListItem.map((dataChoosed, indexChoosedList) =>
                                {
                                    return (
                                        <TouchableOpacity
                                            key={indexChoosedList + dataChoosed.data}
                                            style={[styles.cardBox2, styles.cardChoosed, { marginVertical: 2 }]}
                                            onPress={() =>
                                            {
                                                const tmpData: any[] = [...choosedListItem.filter((x) => x.data !== dataChoosed.data)];
                                                setChoosedListItem(tmpData);
                                                // console.log(tmpData);
                                            }}
                                        >
                                            <Text style={[styles.content]}>{dataChoosed.data}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                            {questRen.map((data, index) =>
                            {
                                const tmpData: any = choosedListItem && choosedListItem.length > 0 && [...choosedListItem.filter((x) => x.index === index)];
                                return (
                                    <TouchableOpacity
                                        key={index + data}
                                        style={[styles.cardBox2, tmpData && tmpData.length > 0 && tmpData[0].data === data && styles.cardChoosed2]}
                                        disabled={tmpData && tmpData.length > 0 && tmpData[0].data === data ? true : false}
                                        onPress={() =>
                                        {
                                            const tmp: any[] = [...choosedListItem];
                                            tmp.push({ data: data, index: index });
                                            setChoosedListItem(tmp);
                                            // console.log(choosedListItem);

                                            // console.log(tmp);
                                        }}
                                    >
                                        <Text style={[styles.content, tmpData && tmpData.length > 0 && tmpData[0].data === data && { opacity: 0 }]}>{data}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )}
            </View>
        );
    };
    // QUEST TYPE 2 END

    // UPDATE PROCESS WHEN FINISH ALL START
    const reSetArchivement = async (percent: number) =>
    {
        const tmpAllArchivements: any = await getAchievements();
        tmpAllArchivements[0][gate][round][level && parseInt(level) > 0 ? parseInt(level) - 1 : 0] = percent;

        // console.log(tmpAllArchivements[0][gate][round][parseInt(level) - 1], '+++++++++++');
        // console.log(tmpAllArchivements[0][gate], '+++++++++++');
        console.log(tmpAllArchivements[0]);

        await updateArchivement(tmpAllArchivements[0]);
        // console.log(tmpAllArchivements, '+++++++++++');

        // console.log(percent);
    };

    // UPDATE PROCESS WHEN FINISH ALL END

    return (
        <View style={[styles.container, styles.bgColor]}>
            {/* START PROCESSBAR */}
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
                        // backgroundColor: 'red',
                    }}
                    onPress={() =>
                    {
                        navigation.goBack();
                    }}
                >
                    <Icon
                        type={'MaterialIcons'}
                        name={'arrow-back-ios'}
                        size={moderateScale(22, 0.3)}
                        color={'red'}
                    />
                </TouchableOpacity>
                <View style={styles.processBar}>
                    <Animated.View style={[styles.percent, animationProcess]}>
                        <Animated.View style={[styles.subPercent, subAnimationProcess]} />
                    </Animated.View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Animated.View style={[shootAnimationSize, { marginLeft: -20, borderRadius: 30, backgroundColor: '#45f248' }]}>
                            <Animated.View style={[shootAnimationSize2, { borderRadius: 30, backgroundColor: '#45f248' }]} />
                        </Animated.View>
                    </View>
                </View>
            </View>
            {/* END PROCESSBAR */}
            {!showLastResult ? (
                <>
                    {dataQuest && dataQuest[step] && dataQuest[step].rightVi && dataQuest[step].rightEn && dataQuest[step].type === 1 ? <Rendetype1 /> : <Rendetype2 />}

                    {/* START BUTTON CHECK */}
                    <View style={styles.containerBtnNext}>
                        <TouchableOpacity
                            style={[styles.btnNext, choosedItem === ':::' && choosedListItem.length === 0 && styles.disabled, !resultTrue && { backgroundColor: '#ff3333' }]}
                            disabled={choosedItem === ':::' && choosedListItem.length === 0 ? true : false}
                            onPress={() =>
                            {
                                if (step < dataQuest.length && choosedListItem.length > 0)
                                {
                                    const choosedString = choosedListItem.map((x) => x.data).join(' ');
                                    if (
                                        choosedString.toLowerCase() === dataQuest[step].rightVi.toLowerCase() ||
                                        choosedString.toLowerCase === dataQuest[step].rightEn.toLowerCase()
                                    )
                                    {
                                        // console.log(choosedString);
                                        setResultTrue(true);
                                        setShowBottomResult(true);
                                        rightAndWrong.push({ status: true, noun: dataQuest[step].noun ?? null, en: dataQuest[step].rightEn, vi: dataQuest[step].rightVi });
                                    }
                                    else
                                    {
                                        setResultTrue(false);
                                        setShowBottomResult(true);
                                        rightAndWrong.push({ status: false, noun: dataQuest[step].noun ?? null, en: dataQuest[step].rightEn, vi: dataQuest[step].rightVi });
                                    }
                                }
                                else if (
                                    step < dataQuest.length &&
                                    (choosedItem.toLowerCase() === dataQuest[step].rightEn.toLowerCase() || choosedItem.toLowerCase() === dataQuest[step].rightVi.toLowerCase())
                                )
                                {
                                    setResultTrue(true);
                                    setShowBottomResult(true);
                                    rightAndWrong.push({ status: true, noun: dataQuest[step].noun ?? null, en: dataQuest[step].rightEn, vi: dataQuest[step].rightVi });
                                }
                                else
                                {
                                    setResultTrue(false);
                                    setShowBottomResult(true);
                                    rightAndWrong.push({ status: false, noun: dataQuest[step].noun ?? null, en: dataQuest[step].rightEn, vi: dataQuest[step].rightVi });
                                }
                            }}
                        >
                            <Text style={[styles.btnTxt, choosedItem === ':::' && choosedListItem.length === 0 && { color: '#676767' }]}>{language.CONTINUE}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* END BUTTON CHECK */}

                    {/* START BUTTON RESULT */}
                    {showBottomResult && (
                        <Animated.View
                            style={[
                                styles.containerBtnNext2,
                                bottomResultAnimation,
                                { borderTopWidth: 0 },
                                !resultTrue ? { backgroundColor: '#ffcdd2' } : { backgroundColor: '#abf7b1' },
                            ]}
                        >
                            <View style={{ paddingHorizontal: 10, paddingTop: 0, paddingBottom: 20 }}>
                                <Text style={[styles.title, !resultTrue ? { color: '#d60000' } : { color: '#008631' }]}>
                                    {!resultTrue ? language.WRONG_ANSWER : language.RIGHT_ANSWER}
                                </Text>
                                {!resultTrue && <Text style={[styles.subTitle, !resultTrue ? { color: '#d60000' } : { color: '#008631' }]}>{language.ANSWR_IS}</Text>}
                                <TouchableOpacity
                                    style={{ flexDirection: 'row' }}
                                    onPress={() =>
                                    {
                                        Tts.setDefaultLanguage('en-IE');
                                        Tts.speak(dataQuest[step].rightEn);
                                    }}
                                >
                                    <Icon
                                        type={'MaterialIcons'}
                                        name={'volume-up'}
                                        size={moderateScale(23, 0.3)}
                                        color={!resultTrue ? '#d60000' : '#008631'}
                                    />
                                    <Text style={[styles.content, { marginLeft: 4, fontSize: 15 }, !resultTrue ? { color: '#d60000' } : { color: '#008631' }]}>
                                        {'En: ' + dataQuest[step].rightEn}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row' }}
                                    onPress={() =>
                                    {
                                        Tts.setDefaultLanguage('vi-VN');
                                        Tts.speak(dataQuest[step].rightVi);
                                    }}
                                >
                                    <Icon
                                        type={'MaterialIcons'}
                                        name={'volume-up'}
                                        size={moderateScale(23, 0.3)}
                                        color={!resultTrue ? '#d60000' : '#008631'}
                                    />
                                    <Text style={[styles.content, { marginLeft: 4, fontSize: 15 }, !resultTrue ? { color: '#d60000' } : { color: '#008631' }]}>
                                        {'Vi: ' + dataQuest[step].rightVi}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={[styles.btnNext, !resultTrue && { backgroundColor: '#ff3333' }]}
                                disabled={choosedItem === ':::' && choosedListItem.length === 0 ? true : false}
                                onPress={() =>
                                {
                                    if (step < dataQuest.length - 1)
                                    {
                                        // console.log(step);
                                        setChoosedItem(':::');
                                        setPreStep(step);
                                        setStep((prev) => prev + 1);
                                        setResultTrue(true);
                                        setShowBottomResult(false);
                                        setChoosedListItem([]);
                                        animationBottomResultValue.setValue(0);
                                    }
                                    else
                                    {
                                        setPreStep(step);
                                        setStep((prev) => prev + 1);
                                        setShowLastResult(true);
                                        reSetArchivement(Math.round((rightAndWrong.filter((x) => x.status !== false).length / rightAndWrong.length) * 100));
                                        // console.log(rightAndWrong);
                                        // console.log(level, round, gate, '::::::::::::::::');
                                    }
                                }}
                            >
                                <Text style={[styles.btnTxt]}>{language.CONTINUE}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    {/* END BUTTON RESULT */}
                </>
            ) : (
                // START FINAL RESULT
                <ImageBackground
                    source={require('../../../Assets/gif/giphy.gif')}
                    style={{ width: SIZES.WIDTH_WINDOW, flex: 1, alignItems: 'center', marginTop: -50, paddingTop: 50, marginBottom: -10 }}
                >
                    {/* <View style={{ flex: 1 }}> */}
                    <Text style={[styles.title, { textAlign: 'center', color: '#47b881', marginBottom: 0 }]}>{language.END_GAME}</Text>
                    <Text style={[styles.title, { textAlign: 'center', color: '#f01d2c', marginTop: 0, marginBottom: 0 }]}>
                        {Math.round((rightAndWrong.filter((x) => x.status !== false).length / rightAndWrong.length) * 100)}%
                    </Text>
                    <Text style={[styles.subTitle2, { color: 'white', textAlign: 'center', marginTop: 0, marginBottom: 0 }]}>
                        {language.RIGHT}: {rightAndWrong.filter((x) => x.status !== false).length}/{rightAndWrong.length}
                    </Text>
                    {/* </View> */}
                    <Pressable
                        style={[styles.button, { marginLeft: scale(8) }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon
                            type={'MaterialIcons'}
                            name={'arrow-back'}
                            size={moderateScale(28, 0.3)}
                            color={'white'}
                        />
                    </Pressable>
                    {rightAndWrong.filter((x) => x.status === false).length === 0 && (
                        <>
                            {/* <View style={{ flex: 1, position: 'relative', width: SIZES.WIDTH_WINDOW * 0.9, justifyContent: 'center', alignItems: 'center' }}> */}
                            <Text style={styles.titleUpper}>{language.WOWYOURESOTALEN}</Text>
                            <Image
                                style={{ marginLeft: -SIZES.WIDTH_WINDOW * 0.1, position: 'absolute', left: 0, bottom: -10 }}
                                source={require('../../../Assets/gif/click.gif')}
                                // resizeMode={'cover'}
                                width={200}
                                height={300}
                            />
                            {/* </View> */}
                        </>
                    )}
                    <FlatList
                        data={rightAndWrong}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) =>
                        {
                            // console.log(item);

                            return (
                                <>
                                    {item.status === false && (
                                        <View style={{ width: SIZES.WIDTH_WINDOW, justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={[styles.cardBoxResult]}>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                    {
                                                        Tts.setDefaultLanguage('en-IE');
                                                        Tts.speak(item.en);
                                                    }}
                                                >
                                                    <Text style={[styles.subTitle2, { color: '#f01d2c' }]}>{item.en}</Text>
                                                </TouchableOpacity>
                                                {item.noun && <Text style={[styles.subTitle2, { textTransform: 'lowercase' }]}>😭{item.noun}😭</Text>}

                                                <TouchableOpacity
                                                    onPress={() =>
                                                    {
                                                        Tts.setDefaultLanguage('vi-VN');
                                                        Tts.speak(item.vi);
                                                    }}
                                                >
                                                    <Text style={[styles.subTitle2, { color: '#47b881', textTransform: 'lowercase' }]}>{item.vi}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </>
                            );
                        }}
                        // contentContainerStyle={{ flex: 1, marginHorizontal: 5 }}
                    />
                </ImageBackground>
                // END FINAL RESULT
            )}
        </View>
    );
};

export default memo(Quest);
