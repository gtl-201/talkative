import React, { FC, memo, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Text,
    View,
    Animated,
    Image,
    ImageBackground,
    Pressable,
    TextInput,
    Keyboard,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale, scale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import {
    getAchievements,
    getQuest,
    getQuestPassRound,
    getRound,
    updateArchivement,
} from '../../../Store/Services/user-services';
import { SHADOW_3, SHADOW_5, SIZES } from '../../../Utils/Values';
// import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';

import SoundPlayer from 'react-native-sound-player';
import TxtInput from './txtInput';

interface Props {
  color: any;
  language: any;
  navigation: any;
  gate: string;
  preGate: string;
}

const PassLock: FC<Props> = (props) =>
{
    // const navigation = useNavigation();
    const { color, language, navigation, gate,preGate } = props;
    const styles = styleScaled(color);
    const [step, setStep] = useState(0);
    const [preStep, setPreStep] = useState(0);

    // GET DATA START
    const [dataQuest, setDataQuest] = useState<any[]>([]);
    const [listRightVi, setListRightVi] = useState<string[]>([]);
    const [listRightEn, setListRightEn] = useState<string[]>([]);
    const [listRight, setListRight] = useState<any[]>([]);
    const [listRes, setListRes] = useState<any[]>([]);
    const [choosedItem, setChoosedItem] = useState(':::');
    const [choosedItem2, setChoosedItem2] = useState<any[]>([{
        rightVi: '',
        rightEn: '',
    }]);
    const [itemCorrect, setItemCorrect] = useState<any[]>([]);
    const [itemWrong, setItemWrong] = useState<any[]>([]);
    const [questRen, setQuestRen] = useState<string[]>([]);
    const [questRen2, setQuestRen2] = useState<any[]>([]);
    const [showBottomResult, setShowBottomResult] = useState(false);
    const [resultTrue, setResultTrue] = useState(true);
    const [rightAndWrong, setRightAndWrong] = useState<any[]>([]);
    // For type 2
    const [choosedListItem, setChoosedListItem] = useState<any[]>([]);
    const [textValue, setTextValue] = useState<any[]>([]);
    // For show last screen
    const [showLastResult, setShowLastResult] = useState(false);
    const [checkRes, setCheckRes] = useState(false);
    // console.log("===============",choosedListItem);

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() =>
    {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () =>
            {
                setKeyboardVisible(false); // or some other action
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () =>
            {
                setKeyboardVisible(true); // or some other action
            },
        );

        return () =>
        {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() =>
    {
        if (isKeyboardVisible)
        {
            setChoosedListItem(textValue.flat());
            setKeyboardVisible(false);
        }
    }, [isKeyboardVisible]);
    
    const getAllQuest = async () =>
    {
            
        // const allQuest = await getQuest(gate, round, level);
        const allQuests = [];
        const getColelection: any = await getRound(preGate);
        const round = getColelection.collection.map((x)=>x.name);

        for (let index = 0; index < 3; index++)
        {
            for (let index2 = 1; index2 <= 4; index2++)
            {
                const array = await getQuestPassRound(preGate, round[index], index2.toString());
                allQuests.push(array);
            }
            
        }

        const random = shuffle(allQuests.flat());
        const dataType1 = random.filter((x,i)=>x.type === 1);
        const numberRandom = (Math.random() * 3);
        const number = numberRandom <= 1 ? 3 : numberRandom <= 2 ? 4 : 5;
        const dataType1Filter = dataType1.filter((x,i)=>i < number);
        const allQuest = random.filter((x,i)=> i < 15);
            
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
        const allRes = dataType1Filter.map((data) =>
        {
            return data.type === 1
                ? {
                        rightVi: data.rightVi,
                        rightEn: data.rightEn,
                    }
                : null;
        });
        const allResVi = dataType1Filter.map((data) =>
        {
            return data.type === 1
                ? data.rightVi
                : null;
        });
        const allResEn = dataType1Filter.map((data) =>
        {
            return data.type === 1
                ? data.rightEn
                : null;
        });
        
        const allData = allRes.filter((res) => res !== null);
        const allDataVi = shuffle(allResVi.filter((res) => res !== null));
        const allDataEn = shuffle(allResEn.filter((res) => res !== null));

        const array = [];
        
        for (let index = 0; index < number; index++)
        {
            array.push({ rightVi: allDataVi[index],
                rightEn: allDataEn[index] });
        }
        setListRightEn(allRightEn.flat());
        setListRightVi(allRightVi.flat());
        setListRight(allData);
        setListRes(array);
        setDataQuest(allQuest);
        
    };

    const SelectItem = (data,index,type) =>
    {
        const items = [...choosedItem2];
        items[0][type] = data;
        setChoosedItem2(items);

    };
    useEffect(() =>
    {
        if (choosedItem2[0].rightEn !== '' && choosedItem2[0].rightVi !== '')
        {
            const correct = listRight.filter((x)=>x.rightEn === choosedItem2[0].rightEn && x.rightVi === choosedItem2[0].rightVi);
            setItemCorrect(itemCorrect.concat(correct));
            console.log(correct);

            if (correct.length === 0)
            {
                setResultTrue(false);
                setShowBottomResult(true);
                setItemWrong([listRight.filter((x)=>x.rightEn === choosedItem2[0].rightEn)[0],listRight.filter((x)=>x.rightVi === choosedItem2[0].rightVi)[0]]);
            
                rightAndWrong.push({
                    status: false,
                    noun: null,
                    en: null,
                    vi: null,
                });
            }
            else
            {
                if (listRight.length === itemCorrect.concat(correct).length)
                {
                    setResultTrue(true);
                    setShowBottomResult(true);
                    rightAndWrong.push({
                        status: true,
                        noun: dataQuest[step]?.noun ?? null,
                        en: dataQuest[step]?.rightEn,
                        vi: dataQuest[step]?.rightVi,
                    });
                }
                else
                {
                    setCheckRes(true);
                    setChoosedItem2([{
                        rightVi: '',
                        rightEn: '',
                    }]);
                }
                
            }
            
            
        }
    }, [choosedItem2]);
    
    
    useEffect(() =>
    {
        Tts.setDefaultVoice('com.apple.ttsbundle.siri_male_en-US_compact');
        // console.log(gate, round, '?????');
        
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
            outputRange: [w * (preStep / 15), w * (step / 15)],
        }),
    };
    const subAnimationProcess = {
        width: animationProcessValue.interpolate({
            inputRange: preStep < step ? [preStep, step] : [step, preStep],
            outputRange: [w * (preStep / 15) * 0.8, w * (step / 15) * 0.8],
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
            return x !== (dataQuest.length > 0 ? dataQuest[step]?.rightEn : '');
        });

        const questRen = allWrongEn
            .sort(() => Math.random() - Math.random())
            .slice(0, 4);
        questRen[Math.floor(Math.random() * 4)] =
      dataQuest.length > 0 ? dataQuest[step]?.rightEn : '';
        setQuestRen(questRen);

        const filterType = dataQuest.filter((x: any) => x.type === 1);
        const getObj = filterType.map((x: any) => ({
            pic: x.pic,
            rightEn: x.rightEn,
        }));

        const allWrongEn2 = getObj.filter((x: any) =>
        {
            return (
                x.rightEn !== (dataQuest.length > 0 ? dataQuest[step]?.rightEn : '')
            );
        });

        const questRen2 = allWrongEn2
            .sort(() => Math.random() - Math.random())
            .slice(0, 4);
        questRen2[Math.floor(Math.random() * 4)] =
      dataQuest.length > 0
          ? {
                  pic: dataQuest[step]?.pic,
                  rightEn: dataQuest[step]?.rightEn,
              }
          : '';
        setQuestRen2(questRen2);

        
        // const allWrongEn: any = [];
        // dataQuest.map((x: any, index) =>
        // {
        //     if (x.rightEn !== (dataQuest.length > 0 ? dataQuest[step].rightEn : ''))
        //     {
        //         if (x.type === 1)
        //         {
        //             allWrongEn.push({ en: x.rightEn, vi: x.rightVi });
        //         }
        //     }
        // });

    // const questRen: any = allWrongEn.sort(() => Math.random() - Math.random()).slice(0, 4);
    // questRen[Math.floor(Math.random() * 4)] = dataQuest.length > 0 ? { en: dataQuest[step].rightEn, vi: dataQuest[step].rightVi } : '';
    // setQuestRen(questRen);
    };

    useEffect(() =>
    {
        dataQuest && dataQuest[step] && dataQuest[step].type === 1 && renAnsType1();
    }, [dataQuest, step]);

    const [typeShow, setTypeShow] = useState<number>(Math.random() * 3);
    const [typeShow2, setTypeShow2] = useState<number>(Math.random() * 2);
    const txtAns: any = '';
    const Rendetype1 = () =>
    {
        return (
            <>
                {/* <View style={{ flex: 1, alignItems: 'center' }}> */}
                {/* <TouchableOpacity
                        style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() =>
                        {
                            Tts.setDefaultLanguage('en-IE');
                            Tts.speak(dataQuest[step].rightEn);
                        }}
                    >
                        <Text style={[styles.title]}>{language.TABTOLISTEN}</Text>
                        <View style={{ backgroundColor: color.IC, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5, ...SHADOW_5 }}>
                            <Icon
                                type={'MaterialIcons'}
                                name={'volume-up'}
                                size={moderateScale(40)}
                                color={'white'}
                            />
                        </View>
                    </TouchableOpacity> */}
                {/* <TxtInput
                        color={color}
                        language={language}
                        // value={txtAns}
                        onChangeText={(value) =>
                        {
                            txtAns = value;
                            console.log(value, '-----', txtAns);
                            // setChoosedItem(value.toString() ?? '');
                        }}
                        onBlur={() => setChoosedItem(txtAns)}
                    /> */}
                {/* </View> */}
                {typeShow <= 1 && questRen2.length >= 4
                    ? (
                            <View style={{ flex: 1 }}>
                                {dataQuest && dataQuest[step] && (
                                    <>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: SIZES.HEIGHT_STATUSBAR,
                                            }}
                                        >
                                            <Image
                                                source={require('../../../Assets/Images/ask.png')}
                                                // resizeMode={'cover'}
                                                style={{ width: '40%', height: 130 }}
                                            />
                                            <Text style={styles.title2}>
                                                {language.HOWTOTALK + ' "' + dataQuest[step]?.rightVi + '"?'}{' '}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                justifyContent: 'space-between',
                                                marginTop: SIZES.HEIGHT_STATUSBAR,
                                            }}
                                        >
                                            {questRen2.map((data, index) => (
                                                <TouchableOpacity
                                                    key={index + data.rightEn}
                                                    style={[
                                                        styles.cardBoxImg,
                                                        choosedItem === data.rightEn && styles.cardChoosed,
                                                    ]}
                                                    onPress={() =>
                                                    {
                                                        setChoosedItem(data.rightEn);
                                                    }}
                                                >
                                                    <Image
                                                        source={{ uri: data.pic }}
                                                        resizeMode={'contain'}
                                                        style={{ width: '100%', height: 100 }}
                                                    />
                                                    <View>
                                                        <Text
                                                            style={[
                                                                styles.content,
                                                                choosedItem === data.rightEn && {
                                                                    color: '#59bfff',
                                                                },
                                                            ]}
                                                        >
                                                            {data.rightEn}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </>
                                )}
                            </View>
                        )
                    : typeShow <= 2
                        ? (
                                <View style={{ flex: 1 }}>
                                    {dataQuest && dataQuest[step] && (
                                        <>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginTop: SIZES.HEIGHT_STATUSBAR,
                                                }}
                                            >
                                                <Image
                                                    source={require('../../../Assets/Images/ask.png')}
                                                    // resizeMode={'cover'}
                                                    style={{ width: '40%', height: 130 }}
                                                />
                                                <Text style={styles.title2}>
                                                    {language.HOWTOTALK + ' "' + dataQuest[step]?.rightVi + '"?'}{' '}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center',marginBottom: 50 }}>
                                                {questRen.map((data, index) => (
                                                    <TouchableOpacity
                                                        key={index + data}
                                                        style={[
                                                            styles.cardBox,
                                                            choosedItem === data && styles.cardChoosed,
                                                        ]}
                                                        onPress={() =>
                                                        {
                                                            setChoosedItem(data);
                                                        }}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.content,
                                                                choosedItem === data && { color: '#59bfff' },
                                                            ]}
                                                        >
                                                            {data}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </>
                                    )}
                                </View>
                            )
                        : (
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() =>
                                        {
                                            Tts.setDefaultLanguage('en-IE');
                                            Tts.speak(dataQuest[step]?.rightEn);
                                        }}
                                    >
                                        <Text style={[styles.title]}>{language.TABTOLISTEN}</Text>
                                        <View
                                            style={{
                                                backgroundColor: color.IC,
                                                width: 50,
                                                height: 50,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 5,
                                                ...SHADOW_5,
                                            }}
                                        >
                                            <Icon
                                                type={'MaterialIcons'}
                                                name={'volume-up'}
                                                size={moderateScale(40)}
                                                color={'white'}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={[styles.title]}>{language.CHOOSEWHATYOUHEAR}</Text>
                                    <View style={{ flex: 1 }}>
                                        {questRen.map((data, index) => (
                                            <TouchableOpacity
                                                key={index + data}
                                                style={[
                                                    styles.cardBox,
                                                    choosedItem === data && styles.cardChoosed,
                                                ]}
                                                onPress={() =>
                                                {
                                                    setChoosedItem(data);
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.content,
                                                        choosedItem === data && { color: '#59bfff' },
                                                    ]}
                                                >
                                                    {data}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}
            </>
        );
    };
    const Rendetype3 = () =>
    {
        return (
            <>
                {(
                    typeShow2 <= 1
                        ? (
                                <View style={{ flex: 1 }}>
                                    {dataQuest && dataQuest[step] && (
                                        <>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginTop: SIZES.HEIGHT_STATUSBAR,
                                                }}
                                            >
                                                <Text style={styles.title3}>
                                                    {language.CHOOSE}{' '}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center',marginBottom: 50 }}>
                                                {listRes.map((data, index) => (
                                                    <View
                                                        key={index}
                                                        style={{ flexDirection: 'row',justifyContent: 'space-between' }}
                                                    >
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.cardBox3,
                                                                choosedItem2[0].rightEn === data.rightEn && styles.cardChoosed,
                                                                itemCorrect.find((x)=>x.rightEn === data.rightEn) && styles.cardChoosed2,
                                                            ]}
                                                            disabled={itemCorrect.find((x)=>x.rightEn === data.rightEn) ? true : false}
                                                            onPress={() =>
                                                            {
                                                                SelectItem(data.rightEn, index,'rightEn');
                                                                Tts.setDefaultLanguage('en-IE');
                                                                Tts.speak(data.rightEn);
                                                            }}
                                                        >
                                                            {/* <Text
                                                    style={[
                                                        styles.content,
                                                        choosedItem2[0].rightEn === data.rightEn && { color: '#59bfff' },
                                                        itemCorrect.find((x)=>x.rightEn === data.rightEn) && { color: '#b2b2b2' },
                                                    ]}
                                                >
                                                    {data.rightEn}
                                                </Text> */}
                                                            <Icon
                                                                type={'MaterialIcons'}
                                                                name={'volume-up'}
                                                                size={moderateScale(40)}
                                                                color={choosedItem2[0].rightEn === data.rightEn ? '#59bfff' : '#b2b2b2'}
                                                            />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.cardBox3,
                                                                choosedItem2[0].rightVi === data.rightVi && styles.cardChoosed,
                                                                itemCorrect.find((x)=>x.rightVi === data.rightVi) && styles.cardChoosed2,
                                                            ]}
                                                            disabled={itemCorrect.find((x)=>x.rightVi === data.rightVi) ? true : false}
                                                            onPress={() =>
                                                            {
                                                                SelectItem(data.rightVi, index,'rightVi');
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.content,
                                                                    choosedItem2[0].rightVi === data.rightVi && { color: '#59bfff' },
                                                                    itemCorrect.find((x)=>x.rightVi === data.rightVi) && { color: '#b2b2b2' },
                                                                ]}
                                                            >
                                                                {data.rightVi}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </View>
                                        </>
                                    )}
                                </View>
                            )
                        : (
                                <View style={{ flex: 1 }}>
                                    {dataQuest && dataQuest[step] && (
                                        <>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginTop: SIZES.HEIGHT_STATUSBAR,
                                                }}
                                            >
                                                <Text style={styles.title3}>
                                                    {language.CHOOSE}{' '}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center',marginBottom: 50 }}>
                                                {listRes.map((data, index) => (
                                                    <View
                                                        key={index}
                                                        style={{ flexDirection: 'row',justifyContent: 'space-between' }}
                                                    >
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.cardBox3,
                                                                choosedItem2[0].rightVi === data.rightVi && styles.cardChoosed,
                                                                itemCorrect.find((x)=>x.rightVi === data.rightVi) && styles.cardChoosed2,
                                                            ]}
                                                            disabled={itemCorrect.find((x)=>x.rightVi === data.rightVi) ? true : false}
                                                            onPress={() =>
                                                            {
                                                                SelectItem(data.rightVi, index,'rightVi');
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.content,
                                                                    choosedItem2[0].rightVi === data.rightVi && { color: '#59bfff' },
                                                                    itemCorrect.find((x)=>x.rightVi === data.rightVi) && { color: '#b2b2b2' },
                                                                ]}
                                                            >
                                                                {data.rightVi}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.cardBox3,
                                                                choosedItem2[0].rightEn === data.rightEn && styles.cardChoosed,
                                                                itemCorrect.find((x)=>x.rightEn === data.rightEn) && styles.cardChoosed2,
                                                            ]}
                                                            disabled={itemCorrect.find((x)=>x.rightEn === data.rightEn) ? true : false}
                                                            onPress={() =>
                                                            {
                                                                SelectItem(data.rightEn, index,'rightEn');
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.content,
                                                                    choosedItem2[0].rightEn === data.rightEn && { color: '#59bfff' },
                                                                    itemCorrect.find((x)=>x.rightEn === data.rightEn) && { color: '#b2b2b2' },
                                                                ]}
                                                            >
                                                                {data.rightEn}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </View>
                                        </>
                                    )}
                                </View>
                            )
                )
                }
            </>
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
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    };

    const renAnsType2 = () =>
    {
        const allWrongEn = listRightVi.filter((x: any) =>
        {
            return x !== (dataQuest.length > 0 ? dataQuest[step]?.rightVi : '');
        });
        // console.log(allWrongEn, '?');

        const questRen = allWrongEn
            .sort(() => Math.random() - Math.random())
            .slice(0, 8);

        questRen[Math.floor(Math.random() * 8)] =
      dataQuest.length > 0
          ? dataQuest[step]?.rightVi.split(/(\s+)/).filter((e: any) =>
          {
              return e.trim().length > 0;
          })
          : '';
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
                        <Text style={[styles.title, { marginTop: SIZES.HEIGHT_STATUSBAR }]}>
                            {language.TRANSLATETHIS}{' '}
                        </Text>
                        {/* Speak */}
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() =>
                            {
                                Tts.setDefaultLanguage('en-IE');
                                Tts.speak(dataQuest[step]?.rightEn);
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
                            <Text style={[styles.content, { marginLeft: 5, fontSize: 15 }]}>
                                {dataQuest[step]?.rightEn}
                            </Text>
                        </TouchableOpacity>
                        {typeShow2 <= 1
                            ? (
                                    <TxtInput
                                        color={color}
                                        language={language}
                                        values={choosedListItem.map((x) => x.data).join(' ')}
                                        onChangeText={(value) =>
                                        {
                                            const tmp = value
                                                .split(' ')
                                                .map((x, index) => ({ data: x, index: index }));
                                            console.log(
                                                textValue
                                                    .flat()
                                                    .map((x) => x.data)
                                                    .join(' '),
                                            );
                                            textValue[0] = tmp;
                                        }}
                                        onBlur={() => setChoosedListItem(textValue.flat())}
                                    />
                                )
                            : (
                                    <>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                minHeight: 20,
                                                width: SIZES.WIDTH_WINDOW - 20,
                                                borderBottomWidth: 1,
                                                borderColor: 'black',
                                            }}
                                        >
                                            {choosedListItem &&
                choosedListItem.length > 0 &&
                choosedListItem.map((dataChoosed, indexChoosedList) =>
                {
                    return (
                        <TouchableOpacity
                            key={indexChoosedList + dataChoosed.data}
                            style={[
                                styles.cardBox2,
                                styles.cardChoosed,
                                { marginVertical: 2 },
                            ]}
                            onPress={() =>
                            {
                                const tmpData: any[] = [
                                    ...choosedListItem.filter(
                                        (x) => x.data !== dataChoosed.data,
                                    ),
                                ];
                                setChoosedListItem(tmpData);
                                // console.log(tmpData);
                            }}
                        >
                            <Text style={[styles.content]}>{dataChoosed.data}</Text>
                        </TouchableOpacity>
                    );
                })}
                                        </View>

                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            {questRen.map((data, index) =>
                                            {
                                                const tmpData: any = choosedListItem &&
                  choosedListItem.length > 0 && [
                                                    ...choosedListItem.filter((x) => x.index === index),
                                                ];
                                                return (
                                                    <TouchableOpacity
                                                        key={index + data}
                                                        style={[
                                                            styles.cardBox2,
                                                            tmpData &&
                        tmpData.length > 0 &&
                        tmpData[0].data === data &&
                        styles.cardChoosed2,
                                                        ]}
                                                        disabled={
                                                            tmpData && tmpData.length > 0 && tmpData[0].data === data
                                                                ? true
                                                                : false
                                                        }
                                                        onPress={() =>
                                                        {
                                                            const tmp: any[] = [...choosedListItem];
                                                            tmp.push({ data: data, index: index });
                                                            setChoosedListItem(tmp);
                                                            // console.log(choosedListItem);

                                                        // console.log(tmp);
                                                        }}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.content,
                                                                tmpData &&
                          tmpData.length > 0 &&
                          tmpData[0].data === data && { opacity: 0 },
                                                            ]}
                                                        >
                                                            {data}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </>
                                )}
                    </>
                )}
            </View>
        );
    };
    
    // QUEST TYPE 2 END

    // UPDATE PROCESS WHEN FINISH ALL START
    const per = Math.round(
        (rightAndWrong.filter((x) => x.status !== false).length /
rightAndWrong.length) *
100,
    );
    const reSetArchivement = async (gate) =>
    {
        
        if (per >= 80)
        {
            const tmpAllArchivements: any = await getAchievements();
            tmpAllArchivements[gate].family = [];
            await updateArchivement(tmpAllArchivements);
        }
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
                        <Animated.View
                            style={[
                                shootAnimationSize,
                                {
                                    marginLeft: -20,
                                    borderRadius: 30,
                                    backgroundColor: '#45f248',
                                },
                            ]}
                        >
                            <Animated.View
                                style={[
                                    shootAnimationSize2,
                                    { borderRadius: 30, backgroundColor: '#45f248' },
                                ]}
                            />
                        </Animated.View>
                    </View>
                </View>
            </View>
            {/* END PROCESSBAR */}
            {!showLastResult
                ? (
                        <>
                            {dataQuest &&
          dataQuest[step] &&
          dataQuest[step]?.rightVi &&
          dataQuest[step]?.rightEn
          
                                ? (
                                        step === 0
                                            ? <Rendetype3 />
                                            : dataQuest[step]?.type === 1 &&
                                        step !== 0
                                                ? <Rendetype1 />
                                                : <Rendetype2 />
                                    )
                                : null}

                            {/* START BUTTON CHECK */}
                            <View style={styles.containerBtnNext}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnNext,
                                        choosedItem === ':::' &&
                  choosedListItem.length === 0 &&
                  styles.disabled,
                                        !resultTrue && { backgroundColor: '#ff3333' },
                                    ]}
                                    disabled={
                                        choosedItem === ':::' && choosedListItem.length === 0
                                            ? true
                                            : false
                                    }
                                    onPress={() =>
                                    {
                                        if (step < dataQuest.length && choosedListItem.length > 0)
                                        {
                                            const choosedString = choosedListItem
                                                .map((x) => x.data)
                                                .join(' ');
                                            if (
                                                choosedString.toLowerCase() ===
                      dataQuest[step]?.rightVi.toLowerCase() ||
                    choosedString.toLowerCase() ===
                      dataQuest[step]?.rightEn.toLowerCase()
                                            )
                                            {
                                                // console.log(choosedString);
                                                setResultTrue(true);
                                                setShowBottomResult(true);
                                                rightAndWrong.push({
                                                    status: true,
                                                    noun: dataQuest[step]?.noun ?? null,
                                                    en: dataQuest[step]?.rightEn,
                                                    vi: dataQuest[step]?.rightVi,
                                                });
                                            }
                                            else
                                            {
                                                setResultTrue(false);
                                                setShowBottomResult(true);
                                                rightAndWrong.push({
                                                    status: false,
                                                    noun: dataQuest[step]?.noun ?? null,
                                                    en: dataQuest[step]?.rightEn,
                                                    vi: dataQuest[step]?.rightVi,
                                                });
                                            }
                                        }
                                        else if (
                                            step < dataQuest.length &&
                  (choosedItem.toLowerCase() ===
                    dataQuest[step]?.rightEn.toLowerCase() ||
                    choosedItem.toLowerCase() ===
                      dataQuest[step]?.rightVi.toLowerCase())
                                        )
                                        {
                                            setResultTrue(true);
                                            setShowBottomResult(true);
                                            rightAndWrong.push({
                                                status: true,
                                                noun: dataQuest[step]?.noun ?? null,
                                                en: dataQuest[step]?.rightEn,
                                                vi: dataQuest[step]?.rightVi,
                                            });
                                        }
                                        else
                                        {
                                            setResultTrue(false);
                                            setShowBottomResult(true);
                                            rightAndWrong.push({
                                                status: false,
                                                noun: dataQuest[step]?.noun ?? null,
                                                en: dataQuest[step]?.rightEn,
                                                vi: dataQuest[step]?.rightVi,
                                            });
                                        }
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.btnTxt,
                                            choosedItem === ':::' &&
                    choosedListItem.length === 0 && { color: '#676767' },
                                        ]}
                                    >
                                        {language.CONTINUE}
                                    </Text>
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
                                        !resultTrue
                                            ? { backgroundColor: '#ffcdd2' }
                                            : { backgroundColor: '#abf7b1' },
                                    ]}
                                >
                                    <View
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingTop: 0,
                                            paddingBottom: 20,
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.title,
                                                !resultTrue ? { color: '#d60000' } : { color: '#008631' },
                                            ]}
                                        >
                                            {!resultTrue ? language.WRONG_ANSWER : language.RIGHT_ANSWER}
                                        </Text>
                                        {!resultTrue && (
                                            <Text
                                                style={[
                                                    styles.subTitle,
                                                    !resultTrue ? { color: '#d60000' } : { color: '#008631' },
                                                ]}
                                            >
                                                {language.ANSWR_IS}
                                            </Text>
                                        )}
                                        <View style={{ flexDirection: 'row' }}>
                                            {!checkRes
                                                ? (
                                                        <TouchableOpacity
                                                            style={{ flexDirection: 'row' }}
                                                            onPress={() =>
                                                            {
                                                                Tts.setDefaultLanguage('en-IE');
                                                                Tts.speak(itemWrong.length !== 0 ? itemWrong[0]?.rightEn : dataQuest[step]?.rightEn);
                                                            }}
                                                        >
                                                            <Icon
                                                                type={'MaterialIcons'}
                                                                name={'volume-up'}
                                                                size={moderateScale(23, 0.3)}
                                                                color={!resultTrue ? '#d60000' : '#008631'}
                                                            />
                                                            <Text
                                                                style={[
                                                                    styles.content,
                                                                    { marginLeft: 4, fontSize: 15 },
                                                                    !resultTrue ? { color: '#d60000' } : { color: '#008631' },
                                                                ]}
                                                            >
                                                En: {itemWrong.length !== 0 ? itemWrong[0]?.rightEn : dataQuest[step]?.rightEn}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                : (
                                                        <Text
                                                            style={[
                                                                styles.content,
                                                                { marginLeft: 4, fontSize: 15 },
                                                                !resultTrue ? { color: '#d60000' } : { color: '#008631' },
                                                            ]}
                                                        />
                                                    )
                                            }
                                            {itemWrong.length !== 0 && (
                                                <TouchableOpacity
                                                    style={{ flexDirection: 'row',marginLeft: 10 }}
                                                    onPress={() =>
                                                    {
                                                        Tts.setDefaultLanguage('en-IE');
                                                        Tts.speak(itemWrong.length !== 0 ? itemWrong[1]?.rightEn : dataQuest[step]?.rightEn);
                                                    }}
                                                >
                                                    <Icon
                                                        type={'MaterialIcons'}
                                                        name={'volume-up'}
                                                        size={moderateScale(23, 0.3)}
                                                        color={!resultTrue ? '#d60000' : '#008631'}
                                                    />
                                                    <Text
                                                        style={[
                                                            styles.content,
                                                            { marginLeft: 4, fontSize: 15 },
                                                            !resultTrue ? { color: '#d60000' } : { color: '#008631' },
                                                        ]}
                                                    >
                                                En: {itemWrong.length !== 0 ? itemWrong[1]?.rightEn : dataQuest[step]?.rightEn}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            {!checkRes
                                                ? (
                                                        <TouchableOpacity
                                                            style={{ flexDirection: 'row' }}
                                                            onPress={() =>
                                                            {
                                                                Tts.setDefaultLanguage('vi-VN');
                                                                Tts.speak(itemWrong.length !== 0 ? itemWrong[0]?.rightVi : dataQuest[step]?.rightVi);
                                                            }}
                                                        >
                                                            <Icon
                                                                type={'MaterialIcons'}
                                                                name={'volume-up'}
                                                                size={moderateScale(23, 0.3)}
                                                                color={!resultTrue ? '#d60000' : '#008631'}
                                                            />
                                                            <Text
                                                                style={[
                                                                    styles.content,
                                                                    { marginLeft: 4, fontSize: 15 },
                                                                    !resultTrue ? { color: '#d60000' } : { color: '#008631' },
                                                                ]}
                                                            >
                                                Vi: {itemWrong.length !== 0 ? itemWrong[0]?.rightVi : dataQuest[step]?.rightVi}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                            
                                                : (
                                                        <Text
                                                            style={[
                                                                styles.content,
                                                                { marginLeft: 4, fontSize: 15 },
                                                                !resultTrue ? { color: '#d60000' } : { color: '#008631' },
                                                            ]}
                                                        />
                                                    )
                                            }
                                            {itemWrong.length !== 0 && (
                                                <TouchableOpacity
                                                    style={{ flexDirection: 'row',marginLeft: 10 }}
                                                    onPress={() =>
                                                    {
                                                        Tts.setDefaultLanguage('vi-VN');
                                                        Tts.speak(itemWrong.length !== 0 ? itemWrong[1]?.rightVi : dataQuest[step]?.rightVi);
                                                    }}
                                                >
                                                    <Icon
                                                        type={'MaterialIcons'}
                                                        name={'volume-up'}
                                                        size={moderateScale(23, 0.3)}
                                                        color={!resultTrue ? '#d60000' : '#008631'}
                                                    />
                                                    <Text
                                                        style={[
                                                            styles.content,
                                                            { marginLeft: 4, fontSize: 15 },
                                                            !resultTrue ? { color: '#d60000' } : { color: '#008631' },
                                                        ]}
                                                    >
                                                Vi: {itemWrong.length !== 0 ? itemWrong[1]?.rightVi : dataQuest[step]?.rightVi}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={[
                                            styles.btnNext,
                                            !resultTrue && { backgroundColor: '#ff3333' },
                                        ]}
                                        disabled={
                                            choosedItem === ':::' && choosedListItem.length === 0 && choosedItem2[0].rightEn === '' && choosedItem2[0].rightVi === ''
                                                ? true
                                                : false
                                        }
                                        onPress={() =>
                                        {
                                            if (step < dataQuest.length - 1)
                                            {
                                                setTypeShow(Math.random() * 3);
                                                setTypeShow2(Math.random() * 2);
                                                setChoosedItem(':::');
                                                setPreStep(step);
                                                setStep((prev) => prev + 1);
                                                setResultTrue(true);
                                                setShowBottomResult(false);
                                                setChoosedListItem([]);
                                                animationBottomResultValue.setValue(0);
                                                setItemCorrect([]);
                                                setItemWrong([]);
                                                setCheckRes(false);
                                                setChoosedItem2([{
                                                    rightVi: '',
                                                    rightEn: '',
                                                }]);
                                            }
                                            else
                                            {
                                                setTypeShow(Math.random() * 3);
                                                setTypeShow2(Math.random() * 2);
                                                setPreStep(step);
                                                setStep((prev) => prev + 1);
                                                setShowLastResult(true);
                                                reSetArchivement(gate);
                                                // console.log(level, round, gate, '::::::::::::::::');
                                                setItemCorrect([]);
                                                setItemWrong([]);
                                                setCheckRes(false);
                                                setChoosedItem2([{
                                                    rightVi: '',
                                                    rightEn: '',
                                                }]);
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
                            style={{
                                width: SIZES.WIDTH_WINDOW,
                                flex: 1,
                                alignItems: 'center',
                                marginTop: -50,
                                paddingTop: 50,
                                marginBottom: -10,
                            }}
                        >
                            {/* <View style={{ flex: 1 }}> */}
                            <Text
                                style={[
                                    styles.title,
                                    { textAlign: 'center', color: '#47b881', marginBottom: 0 },
                                ]}
                            >
                                {language.END_GAME}
                            </Text>
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        textAlign: 'center',
                                        color: '#f01d2c',
                                        marginTop: 0,
                                        marginBottom: 0,
                                    },
                                ]}
                            >
                                {Math.round(
                                    (rightAndWrong.filter((x) => x.status !== false).length /
                rightAndWrong.length) *
                100,
                                )}
            %
                            </Text>
                            <Text
                                style={[
                                    styles.subTitle2,
                                    {
                                        color: 'white',
                                        textAlign: 'center',
                                        marginTop: 0,
                                        marginBottom: 0,
                                    },
                                ]}
                            >
                                {language.RIGHT}:{' '}
                                {rightAndWrong.filter((x) => x.status !== false).length}/
                                {rightAndWrong.length}
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
                                        style={{
                                            marginLeft: -SIZES.WIDTH_WINDOW * 0.1,
                                            position: 'absolute',
                                            left: 0,
                                            bottom: -10,
                                        }}
                                        source={require('../../../Assets/gif/click.gif')}
                                        // resizeMode={'cover'}
                                        width={200}
                                        height={300}
                                    />
                                    {/* </View> */}
                                </>
                            )}
                            <View style={{ alignItems: 'center' }}>
                                {per < 80 && <Text style={styles.titleUpper}>{language.YOULOSS}</Text>}
                                <TouchableOpacity
                                    style={{ width: SIZES.WIDTH_WINDOW * 0.6,height: 50,borderRadius: 10,backgroundColor: '#007dc5',alignItems: 'center',justifyContent: 'center' }}
                                    onPress={() =>
                                    {
                                        if (per < 80)
                                        {
                                            setShowLastResult(false);
                                            getAllQuest();
                                            setTypeShow(Math.random() * 3);
                                            setTypeShow2(Math.random() * 2);
                                            setChoosedItem(':::');
                                            setPreStep(0);
                                            setStep(0);
                                            setResultTrue(true);
                                            setShowBottomResult(false);
                                            setChoosedListItem([]);
                                            animationBottomResultValue.setValue(0);
                                            setRightAndWrong([]);
                                        }
                                        else
                                        {
                                            navigation.goBack();
                                        }
                                    }}
                                >
                                    <Text style={{ color: 'white',fontWeight: 'bold',fontSize: 20 }}>{per < 80 ? language.PLAYAGAIN : language.CONTINUE}</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={rightAndWrong}
                                keyExtractor={({ item, index }) => index}
                                renderItem={({ item, index }) =>
                                {
                                    // console.log(item);

                                    return (
                                        <>
                                            {item.status === false && (
                                                <View
                                                    style={{
                                                        width: SIZES.WIDTH_WINDOW,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <View style={[styles.cardBoxResult]}>
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                            {
                                                                Tts.setDefaultLanguage('en-IE');
                                                                Tts.speak(item.en);
                                                            }}
                                                        >
                                                            <Text
                                                                style={[styles.subTitle2, { color: '#f01d2c' }]}
                                                            >
                                                                {item.en}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        {item.noun && (
                                                            <Text
                                                                style={[
                                                                    styles.subTitle2,
                                                                    { textTransform: 'lowercase' },
                                                                ]}
                                                            >
                            😭{item.noun}😭
                                                            </Text>
                                                        )}

                                                        <TouchableOpacity
                                                            onPress={() =>
                                                            {
                                                                Tts.setDefaultLanguage('vi-VN');
                                                                Tts.speak(item.vi);
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.subTitle2,
                                                                    { color: '#47b881', textTransform: 'lowercase' },
                                                                ]}
                                                            >
                                                                {item.vi}
                                                            </Text>
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

export default memo(PassLock);
