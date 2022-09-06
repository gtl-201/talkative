import React, { FC, memo, useEffect, useState } from 'react';
import {
    ScrollView,
    Image,
    Text,
    View,
    FlatList,
    RefreshControl,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styleScaled from './style';
import {
    getAchievements,
    getAllGate,
    createArchive,
    getAllRound,
    getLevel,
    updateArchivement,
} from '../../../Store/Services/user-services';
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
    const [openPopup, setOpenPopup] = useState<number>(-1);
    const [openNew, setOpenNew] = useState<number>(-1);
    const [openNewGate, setOpenNewGate] = useState<number>(-1);
    const showLevel: any[] = [];
    const [dataTopic, setDataTopic] = useState<any>([]);

    const getRound = (Gate: any[], process: any[]) =>
    {
        const dataR = Gate.map(async (x) =>
        {
            const dataRound: any[] = [];
            const showLevelTmp: any[] = [];
            x.data.collection &&
        x.data.collection.map(async (y: any) =>
        {
            dataRound.push({
                id: y.name,
                img: y.img,
                level: x.data.listLevel[y.name],
            });
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
            return Promise.resolve({
                gate: x.id,
                round: dataRound,
                img: x.data.img,
                process: tmpId,
            });
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
        if (tmpAllArchivements === null)
        {
            quearyData();
        }
        else
        {
            getRound(tmpAllGate, [tmpAllArchivements]);
        }
        console.log(tmpAllArchivements);
        
        const gate: any = Object.keys(tmpAllArchivements);
        const topic: any = [];
        const array: any = [];
        gate.forEach((y, i2) => topic.push(Object.keys(tmpAllArchivements[y]))),
        gate.forEach((y, i2) =>
            topic.flat().forEach((x, i) =>
            {
                const initialValue = 0;
                const sumWithInitial = (tmpAllArchivements[y][x] ?? [0]).reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue,
                );
                tmpAllArchivements[y][x] &&
            array.push({
                point: sumWithInitial,
                gate: y,
                topic: x,
            });
            }),
        );
        setDataTopic(array);
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
    const renderPer = (tmpTotalProcessNumber,index2) =>
    {
        const per = tmpTotalProcessNumber.length !== 0 &&
tmpTotalProcessNumber[index2] &&
tmpTotalProcessNumber[index2].length !== 0
            ? tmpTotalProcessNumber[index2][
                tmpTotalProcessNumber[index2].length - 1
            ] / 4
            : 0;
        return (
            <CircularProgress
                value={per}
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
        );
    };
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
                // console.log('=========================',tmpTotalProcessNumber);
                
                return (
                    <View
                        key={dataRound.url}
                        style={{
                            position: 'relative',
                            paddingBottom: index === 0 ? 130 : 0,
                        }}
                    >
                        {openPopup ===
                    (index === 0
                        ? index2 + 10
                        : index === 1
                            ? index2 + 20
                            : index2 + 30) && (
                            <View
                                style={[
                                    styles.boxLevelContainer,
                                    openPopup !==
                          (index === 0
                              ? index2 + 10
                              : index === 1
                                  ? index2 + 20
                                  : index2 + 30) && { display: 'none' },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.boxLevel,
                                        openPopup !==
                            (index === 0
                                ? index2 + 10
                                : index === 1
                                    ? index2 + 20
                                    : index2 + 30) && { display: 'none' },
                                    ]}
                                >
                                    {/* <Text>{dataLevel}</Text> */}
                                    {dataRound &&
                          dataRound.level &&
                          Object.keys(dataRound.level).map((key) =>
                          {
                              let tmpProcessEachLevel: any = 0;
                              item.process && item.process[index2]
                                  ? (tmpProcessEachLevel = item.process[index2][key]
                                          ? item.process[index2][key]
                                          : 0)
                                  : 0;
                              // console.log(dataRound, key);
                              // console.log(key);

                              // console.log(item.process[index2][key]);

                              return (
                                  <View
                                      key={key}
                                      style={{
                                          flexDirection: 'column',
                                          flex: 1,
                                          alignItems: 'center',
                                          justifyContent: 'space-around',
                                      }}
                                  >
                                      <TouchableOpacity
                                          style={{
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                          }}
                                          onPress={() =>
                                          {
                                              navigation.navigate('Quest', {
                                                  gate: item.gate,
                                                  round: dataRound.id,
                                                  level: String(parseInt(key) + 1),
                                              });
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
                                              color={
                                                  tmpProcessEachLevel < 60
                                                      ? '#bebebe'
                                                      : '#f1c500'
                                              }
                                          />
                                          <Text style={{ color: color.TITLE_TXT }}>
                                              {tmpProcessEachLevel}%
                                          </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                          style={styles.learnBtn}
                                          onPress={() =>
                                          {
                                              navigation.navigate('Learn', {
                                                  gate: item.gate,
                                                  round: dataRound.id,
                                                  level: String(parseInt(key) + 1),
                                              });
                                          }}
                                      >
                                          <Text style={{ color: 'white' }}>
                                              {language.LEARN}
                                          </Text>
                                      </TouchableOpacity>
                                  </View>
                              );
                          })}
                                </View>
                            </View>
                        )}
                        {openNew ===
                    (index === 0
                        ? index2 + 10
                        : index === 1
                            ? index2 + 20
                            : index2 + 30) && (
                            <View
                                style={[
                                    styles.boxLevelContainer,
                                    openNew !==
                          (index === 0
                              ? index2 + 10
                              : index === 1
                                  ? index2 + 20
                                  : index2 + 30) && { display: 'none' },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.boxLevel,
                                        { backgroundColor: '#fac706' },
                                        openNew !==
                            (index === 0
                                ? index2 + 10
                                : index === 1
                                    ? index2 + 20
                                    : index2 + 30) && { display: 'none' },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: 'white',
                                            fontSize: 17,
                                            textAlign: 'center',
                                        }}
                                    >{`${language.THUTHACH} ${dataRound.id}!`}
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            width: 220,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: 'white',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 15,
                                        }}
                                        onPress={() =>
                                        {
                                            navigation.navigate('PassLock', {
                                                gate: item.gate,
                                                preRound: item.round.filter((x,i)=>i === index - 1)[0].id,
                                                round: dataRound.id,
                                            });
                                            setOpenNew(-1);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#fac706',
                                                fontSize: 17,
                                                textAlign: 'center',
                                            }}
                                        >
                            {language.START}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        
                        <View
                            style={{
                                marginVertical: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <TouchableOpacity
                                // disabled={true}
                                style={{ justifyContent: 'center', alignItems: 'center' }}
                                onPress={() =>
                                {
                                    const tmpShowLevel = [...levelShow];
                                    tmpShowLevel[index].gate[index2] =
                          !levelShow[index].gate[index2];
                                    setLevelShow(tmpShowLevel);
                                    setOpenPopup(
                                        openPopup ===
                            (index === 0
                                ? index2 + 10
                                : index === 1
                                    ? index2 + 20
                                    : index2 + 30)
                                            ? -1
                                            : index === 0
                                                ? index2 + 10
                                                : index === 1
                                                    ? index2 + 20
                                                    : index2 + 30,
                                    );
                                }}
                            >
                                {renderPer(tmpTotalProcessNumber,index2)}
                                <Text style={styles.txtRound}>{dataRound.id}</Text>
                            </TouchableOpacity>
                            <View style={{ position: 'absolute', top: 25, zIndex: 0 }}>
                                <TouchableOpacity
                                    onPress={() =>
                                    {
                                        const tmpShowLevel = [...levelShow];
                                        tmpShowLevel[index].gate[index2] =
                            !levelShow[index].gate[index2];
                                        setLevelShow(tmpShowLevel);
                                        setOpenPopup(
                                            openPopup ===
                              (index === 0
                                  ? index2 + 10
                                  : index === 1
                                      ? index2 + 20
                                      : index2 + 30)
                                                ? -1
                                                : index === 0
                                                    ? index2 + 10
                                                    : index === 1
                                                        ? index2 + 20
                                                        : index2 + 30,
                                        );
                                    }}
                                >
                                    <Image
                                        source={{ uri: dataRound.img }}
                                        style={styles.imgRound}
                                    />
                                </TouchableOpacity>
                            </View>
                            {dataRound.id === 'basic'
                                ? null
                                : !dataTopic.find((x)=>x.topic === dataRound.id) &&
                                (
                                    <>
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                width: 103,
                                                height: 103,
                                                backgroundColor: 'gray',
                                                opacity: 0.7,
                                                borderRadius: 100,
                                            }}
                                        />
                                        {dataTopic.find((x)=>x.gate === item.gate) && (
                                            <View style={{ position: 'absolute', top: 25 }}>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                    {
                                                        setOpenNew(
                                                            openNew ===
                              (index === 0
                                  ? index2 + 10
                                  : index === 1
                                      ? index2 + 20
                                      : index2 + 30)
                                                                ? -1
                                                                : index === 0
                                                                    ? index2 + 10
                                                                    : index === 1
                                                                        ? index2 + 20
                                                                        : index2 + 30,
                                                        );
                                                    }}
                                                >
                                                    <Image
                                                        source={require('../../../Assets/Images/lock.png')}
                                                        style={{ width: 50, height: 50 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </>
                                )
                            }
                        </View>
                    </View>
                );
            })}
                </View>
                {item != undefined && item.img !== undefined
                    ? (
                            <View
                                key={item ? item.gate : index}
                                style={{
                                    marginTop: 10,
                                    marginBottom: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    source={{ uri: item.img }}
                                    style={{ width: 100, height: 100 }}
                                />
                                {item.gate === 'gate1'
                                    ? null
                                    : !dataTopic.find((x)=>x.gate === item.gate) && (
                                            <>
                                                <View style={{ position: 'absolute',top: 10,width: 90, height: 90,backgroundColor: 'gray',opacity: 0.7,borderRadius: 100 }} />
                                                {(index < (allGate.length - 1) && dataTopic.filter((x)=>x.gate === 'gate' + ((allGate.length - 1) - index)).length === 3 && (item.gate === 'gate' + ((allGate.length - 1) - index + 1))) && (
                                                    <View style={{ position: 'absolute',top: 30 }}>
                                                        <TouchableOpacity onPress={()=>
                                                        {
                                                            setOpenNewGate(openNewGate === index ? -1 : index);
                                                        }}
                                                        >
                                                            <Image
                                                                source={require('../../../Assets/Images/lock.png')}
                                                                style={{ width: 50, height: 50 }}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </>
                                        )}
                                
                                <Text style={styles.txtGate}>{item.gate}</Text>
                            </View>
                        )
                    : (
                            <Text key={item.gate}>{item.gate}</Text>
                        )}
                {openNewGate === index && (
                    <View
                        style={[
                            styles.boxLevelContainer2,
                            openNewGate !==
                          index && { display: 'none' },
                        ]}
                    >
                        <View
                            style={[
                                styles.boxLevel2,
                                { backgroundColor: '#fac706' },
                                openNewGate !==
                            index && { display: 'none' },
                            ]}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontSize: 17,
                                    textAlign: 'center',
                                }}
                            >{`${language.THUTHACH} ${item.gate}!`}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    width: 220,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 15,
                                }}
                                onPress={() =>
                                {
                                    navigation.navigate('PassGate', {
                                        gate: item.gate,
                                        preGate: 'gate' + index,
                                    });
                                    setOpenNewGate(-1);
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        color: '#fac706',
                                        fontSize: 17,
                                        textAlign: 'center',
                                    }}
                                >
                            {language.START}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </>
        );
    };
    return (
        <View style={[styles.container, styles.bgColor]}>
            <ScrollView
                refreshControl={(
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
                    style={{
                        flex: 1,
                        width: SIZES.WIDTH_WINDOW,
                        flexDirection: 'column-reverse',
                    }}
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
