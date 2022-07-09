import React, { FC, memo, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styleScaled from './style';
import { getAllGate, getAllRound, getLevel } from '../../../Store/Services/user-services';
import { SIZES } from '../../../Utils/Values';
import CircularProgress from 'react-native-circular-progress-indicator';
import { NoFlickerImage } from '../../../Components/NoFlickerImg/no-flicker-image';

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

    const getRound = (Gate: any[]) =>
    {
        console.log('+=========================================+');
        const dataR = Gate.map(async (x) =>
        {
            const dataRound: any[] = [];
            const showLevelTmp: any[] = [];
            x.data.collection &&
                x.data.collection.map(async (y: any) =>
                {
                    dataRound.push({ id: y.name, img: y.img, level: x.data.listLevel });
                    showLevelTmp.push(false);
                });
            showLevel.push({ gate: showLevelTmp });
            // console.log(showLevel);
            setLevelShow(showLevel);
            return Promise.resolve({ gate: x.id, round: dataRound, img: x.data.img });
        });

        Promise.all(dataR).then((x) =>
        {
            setAllGate(x);
        });
    };
    useEffect(() =>
    {
        const quearyData = async () =>
        {
            const tmpAllGate: any[] = await getAllGate();
            getRound(tmpAllGate);
            // console.log(allGate, '__');
        };
        quearyData();
    }, []);

    const RenderGate = () =>
    {
        // console.log(allGate[0].round);
        // console.log(levelShow, '...');

        return (
            <>
                {allGate.map((x, index) =>
                {
                    return (
                        <>
                            {/* RENDER GATE */}
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
                            {/* {console.log(x, '!!')} */}
                            {/* RENDER ROUND */}
                            {x.round &&
                                x.round.map((dataRound: any, index2: number) => (
                                    <View
                                        key={dataRound.url}
                                        style={{ position: 'relative', width: '100%' }}
                                    >
                                        {dataRound.level !== undefined && (
                                            <View style={[styles.boxLevelContainer, !levelShow[index].gate[index2] && { display: 'none' }]}>
                                                <View style={[styles.boxLevel, !levelShow[index].gate[index2] && { display: 'none' }]}>
                                                    {/* <Text>{dataLevel}</Text> */}
                                                    {dataRound.level.map((dataLevel: string) =>
                                                    {
                                                        return (
                                                            <TouchableOpacity
                                                                key={dataLevel}
                                                                onPress={() =>
                                                                {
                                                                    navigation.navigate('Quest', { gate: x.gate, round: dataRound.id, level: dataLevel });
                                                                }}
                                                            >
                                                                <Text>{dataLevel}</Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        )}
                                        <TouchableOpacity
                                            // disabled={true}
                                            style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}
                                            onPress={() =>
                                            {
                                                const tmpShowLevel = [...levelShow];
                                                tmpShowLevel[index].gate[index2] = !levelShow[index].gate[index2];
                                                console.log(tmpShowLevel);
                                                setLevelShow(tmpShowLevel);
                                                // navigation.navigate('Quest', { gate: x.gate, round: dataRound.id, level: '1' });
                                            }}
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
                                    </View>
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
