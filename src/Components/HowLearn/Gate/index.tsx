import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, View, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import { IMAGE } from '../../../Utils/Values';
import { getAllLevel, getAllRound, UserServices } from '../../../Store/Services/user-services';
import { firebase } from '@react-native-firebase/storage';
import EmptyView from '../../BaseComponents/EmptyView';
import { MMKV } from 'react-native-mmkv';
import firestore from '@react-native-firebase/firestore';
import { SIZES } from '../../../Utils/Values';
import auth from '@react-native-firebase/auth';
import Svg, { ClipPath, Defs, Image as Img2, LinearGradient, Path, Stop } from 'react-native-svg';
import CircularProgress from 'react-native-circular-progress-indicator';

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
    const getRound = (Gate: any[]) =>
    {
        const dataR = Gate.map(async (x) =>
        {
            // const dataRound: any = await getAllRound(x.id);
            // const data: any = x.data;
            // console.log(dataRound.collection, '?');
            // console.log(x, '???');
            // console.log({ gate: x.id, round: x.data.collection, img: x.data.img }, '!!!!');
            // console.log(x.data.collection,'?');
            const dataRound: any[] = [];
            x.data.collection &&
                x.data.collection.map((x: any) =>
                {
                    dataRound.push({ id: x.slice(0, x.indexOf('++')), img: x.slice(x.indexOf('++'), x.length).replace('++', '') });
                });
            return Promise.resolve({ gate: x.id, round: dataRound, img: x.data.img });
        });

        Promise.all(dataR).then((x) =>
        {
            // console.log(x, '++');

            setAllGate(x);
        });
    };
    useEffect(() =>
    {
        const quearyData = async () =>
        {
            const tmpAllGate: any[] = await getAllLevel();
            getRound(tmpAllGate);
            // allGate.push(tmp);
            // setAllGate(tmpAllGate);
            // console.log(allGate, '?');
        };
        quearyData();
    }, []);

    const RenderGate = () =>
    {
        // console.log(allGate);

        return (
            <>
                {allGate.map((x, index) =>
                {
                    return (
                        <>
                            {x.img !== undefined
                                ? (
                                        <View style={{ marginTop: 10, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image
                                                source={{ uri: x.img }}
                                                style={{ width: 100, height: 100 }}
                                            />
                                            <Text style={styles.txtGate}>{x.gate}</Text>
                                        </View>
                                    )
                                : (
                                        <Text key={x.gate}>{x.gate}</Text>
                                    )}
                            {x.round &&
                                x.round.map((dataRound: any, index2: number) => (
                                    <TouchableOpacity
                                        key={dataRound.url}
                                        // disabled={true}
                                        style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <CircularProgress
                                            value={60}
                                            radius={(SIZES.WIDTH_WINDOW * 0.25) / 2}
                                            progressValueColor={'#fff0'}
                                            duration={0}
                                            // activeStrokeColor={'#'}
                                            // inActiveStrokeColor={'#5C8AEA'}
                                            titleColor={'#fff0'}
                                            subtitleColor={'#fff0'}
                                            inActiveStrokeOpacity={0.5}
                                            inActiveStrokeWidth={18}
                                            activeStrokeWidth={18}
                                        />
                                        <Image
                                            source={{ uri: dataRound.img }}
                                            style={styles.imgRound}
                                        />
                                        <Text style={styles.txtRound}>{dataRound.id}</Text>
                                    </TouchableOpacity>
                                ))}
                        </>
                    );
                })}
            </>
        );
    };
    return (
        <View style={[styles.container, styles.bgColor]}>
            <RenderGate />
        </View>
    );
};

export default memo(Gate);
