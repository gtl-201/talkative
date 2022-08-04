import React, { FC, memo, useEffect, useState } from 'react';
import { ScrollView, Image, Text, View, FlatList, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styleScaled from './style';
import { getAchievements, getAllGate, createArchive, getAllRound, getLevel, updateArchivement } from '../../../Store/Services/user-services';
import { SHADOW_1, SIZES } from '../../../Utils/Values';
import CircularProgress from 'react-native-circular-progress-indicator';
import Icon from '../../BaseComponents/Icon';
import auth from '@react-native-firebase/auth';

import { NoFlickerImage } from '../../../Components/NoFlickerImg/no-flicker-image';
import { moderateScale } from 'react-native-size-matters';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
    color: any;
    language: any;
    navigation: any;
    userInfor: any;
    onFinish: () => void;
}

const Gate: FC<Props> = (props) =>
{
    const { color, language, navigation, userInfor, onFinish } = props;
    const styles = styleScaled(color);
    // let allGate: any[] = [];
    const [allGate, setAllGate] = useState<any[]>([]);
    const [levelShow, setLevelShow] = useState<any[]>([]);
    const showLevel: any[] = [];

    const getRound = (Gate: any[], process: any[]) =>
    {
        const dataR = Gate.map(async (x) =>
        {
            const dataRound: any[] = [];
            const showLevelTmp: any[] = [];
            x.data.collection &&
                x.data.collection.map(async (y: any) =>
                {
                    dataRound.push({ id: y.name, img: y.img, level: x.data.listLevel[y.name] });
                    showLevelTmp.push(false);
                });
            showLevel.push({ gate: showLevelTmp });
            const tmpId: any[] = [];
            // console.log(dataRound);

            dataRound.map((key) =>
            {
                // console.log(key, '!!!');
                // key.id);
                process[0][x.id][key.id] && tmpId.push(process[0][x.id][key.id]);
            });

            // console.log(tmpId, ')))))))))');

            setLevelShow(showLevel);
            return Promise.resolve({ gate: x.id, round: dataRound, img: x.data.img, process: tmpId });
        });

        Promise.all(dataR).then((x) =>
        {
            setAllGate(x.reverse());
        });
    };
    const quearyData = async () =>
    {
        const tmpAllGate: any[] = await getAllGate();
        const tmpAllArchivements: any = await getAchievements();
        console.log([tmpAllArchivements], '++++++++++');
        // console.log();
        if (tmpAllArchivements === null)
        {
            quearyData();
        }
        else
        {
            getRound(tmpAllGate, [tmpAllArchivements]);
        }
    };
    useEffect(() =>
    {
        quearyData();

        console.log(auth().currentUser?.uid);
    }, []);
    const [isRefresh, setIsRefresh] = useState(false);
    const onRefresh = () =>
    {
        setIsRefresh(true);
        quearyData();
        setIsRefresh(false);
    };

    useFocusEffect(
        React.useCallback(() =>
        {
            // console.log('99999');
            onRefresh();
        }, []),
    );

    const RenderGate = (item: any, index: number) =>
    {
        return (
            <>
                {/* RENDER GATE */}

                {/* RENDER ROUND */}
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        paddingHorizontal: '20%',
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {item.round &&
                        item.round.map((dataRound: any, index2: number) =>
                        {
                            // console.log('=========================');

                            const tmpTotalProcessNumber: any = [];
                            item.process &&
                                item.process.map((x: any) =>
                                {
                                    let tmp = 0;
                                    tmpTotalProcessNumber.push(
                                        x !== undefined
                                            ? x.map((x1: string) =>
                                            {
                                                tmp += parseInt(x1);
                                                return tmp;
                                            })
                                            : [],
                                    );
                                    // console.log(tmpTotalProcessNumber, '+++');
                                });
                            // console.log('=========================');

                            return (
                                <View
                                    key={dataRound.url}
                                    style={{ position: 'relative', paddingBottom: index === 0 ? 130 : 0 }}
                                >
                                    {dataRound !== undefined && dataRound.level !== undefined && (
                                        <View style={[styles.boxLevelContainer, levelShow[index] && !levelShow[index].gate[index2] && { display: 'none' }]}>
                                            <View style={[styles.boxLevel, levelShow[index] && !levelShow[index].gate[index2] && { display: 'none' }]}>
                                                {/* <Text>{dataLevel}</Text> */}
                                                {dataRound &&
                                                    dataRound.level &&
                                                    Object.keys(dataRound.level).map((key) =>
                                                    {
                                                        let tmpProcessEachLevel: any = 0;
                                                        item.process && item.process[index2]
                                                            ? (tmpProcessEachLevel = item.process[index2][key] ? item.process[index2][key] : 0)
                                                            : 0;
                                                        // console.log(dataRound, key);
                                                        // console.log(key);

                                                        // console.log(item.process[index2][key]);

                                                        return (
                                                            <View
                                                                key={key}
                                                                style={{ flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'space-around' }}
                                                            >
                                                                <TouchableOpacity
                                                                    style={{ alignItems: 'center', justifyContent: 'center' }}
                                                                    onPress={() =>
                                                                    {
                                                                        navigation.navigate('Quest', { gate: item.gate, round: dataRound.id, level: String(parseInt(key) + 1) });
                                                                    }}
                                                                >
                                                                    {/* <Image
                                                                width={20}
                                                                height={20}
                                                                style={{ width: 40, height: 40 }}
                                                                source={require('../../../Assets/Images/Ic/crownGray.png')}
                                                            /> */}
                                                                    <Icon
                                                                        type={'MaterialIcons'}
                                                                        name={'emoji-events'}
                                                                        size={moderateScale(40)}
                                                                        color={tmpProcessEachLevel < 60 ? '#bebebe' : '#f1c500'}
                                                                    />
                                                                    <Text style={{ color: color.TITLE_TXT }}>{tmpProcessEachLevel}%</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity
                                                                    style={styles.learnBtn}
                                                                    onPress={() =>
                                                                    {
                                                                        navigation.navigate('Learn', { gate: item.gate, round: dataRound.id, level: String(parseInt(key) + 1) });
                                                                    }}
                                                                >
                                                                    <Text style={{ color: 'white' }}>{language.LEARN}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    })}
                                            </View>
                                        </View>
                                    )}
                                    <View style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            // disabled={true}
                                            style={{ justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() =>
                                            {
                                                const tmpShowLevel = [...levelShow];
                                                tmpShowLevel[index].gate[index2] = !levelShow[index].gate[index2];
                                                setLevelShow(tmpShowLevel);
                                            }}
                                        >
                                            {/* {console.log(tmpTotalProcessNumber[index2], ';;;;')} */}

                                            <CircularProgress
                                                value={
                                                    tmpTotalProcessNumber && tmpTotalProcessNumber[index2] && tmpTotalProcessNumber[index2].length !== 0
                                                        ? tmpTotalProcessNumber[index2][tmpTotalProcessNumber[index2].length - 1] / 4
                                                        : 0
                                                }
                                                radius={(SIZES.WIDTH_WINDOW * 0.25) / 2}
                                                progressValueColor={'#fff0'}
                                                duration={500}
                                                // activeStrokeColor={'#'}
                                                // inActiveStrokeColor={'#5C8AEA'}
                                                titleColor={'#fff0'}
                                                subtitleColor={'#fff0'}
                                                inActiveStrokeOpacity={0.5}
                                                inActiveStrokeWidth={18}
                                                activeStrokeWidth={18}
                                            />
                                            <Text style={styles.txtRound}>{dataRound.id}</Text>
                                        </TouchableOpacity>
                                        <View style={{ position: 'absolute', top: 25, zIndex: 0 }}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                {
                                                    const tmpShowLevel = [...levelShow];
                                                    tmpShowLevel[index].gate[index2] = !levelShow[index].gate[index2];
                                                    setLevelShow(tmpShowLevel);
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: dataRound.img }}
                                                    style={styles.imgRound}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                </View>
                {item != undefined && item.img !== undefined
                    ? (
                            <View
                                key={item ? item.gate : index}
                                style={{ marginTop: 10, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Image
                                    source={{ uri: item.img }}
                                    style={{ width: 100, height: 100 }}
                                />
                                <Text style={styles.txtGate}>{item.gate}</Text>
                            </View>
                        )
                    : (
                            <Text key={item.gate}>{item.gate}</Text>
                        )}
            </>
        );
    };
    return (
        <View style={[styles.container, styles.bgColor]}>
            <ScrollView refreshControl={(
                <RefreshControl
                    refreshing={isRefresh}
                    onRefresh={onRefresh}
                />
            )}
            >
                <FlatList
                    data={allGate}
                    keyExtractor={({ item, index }) => index}
                    renderItem={({ item, index }) => RenderGate(item, index)}
                    // contentContainerStyle={{ flex: 1, width: SIZES.WIDTH_WINDOW }}
                    style={{ flex: 1, width: SIZES.WIDTH_WINDOW, flexDirection: 'column-reverse' }}
                    refreshing={isRefresh}
                    inverted
                    // onEnd
                    // onRefresh={() =>
                    // {
                    //     setIsRefresh(true);
                    //     quearyData();
                    //     setIsRefresh(false);
                    // }}
                />
            </ScrollView>
            {/* <RenderGate /> */}
        </View>
    );
};

export default memo(Gate);
