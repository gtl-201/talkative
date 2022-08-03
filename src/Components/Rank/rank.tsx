import React, { FC, memo, useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    getAchievements,
    getRank,
    getUsersById,
} from '../../Store/Services/user-services';
import styleScaled from './style';
interface Props {
  color: any;
  // makeCall?: any;
  // getCall?: any;
  language: object;
}
const Rank: FC<Props> = (props) =>
{
    const { color } = props;
    const styles = styleScaled(color);
    const [data, setData] = useState<any>([]);
    const [dataPoint, setDataPoint] = useState<any>([]);
    const [handle, setHandle] = useState(false);

    useEffect(() =>
    {
    // getData();
    }, []);

    const getData = () =>
    {
        const array = [];
        for (let i = 1; i < 30; i++)
        {
            array.push({
                id: i,
                name: `Nguyễn Văn ${i}`,
                point: 101 - i,
            });
        }
        setData(array);
    };
    const quearyData = async () =>
    {
        const tmpAllArchivements: any = await getRank();
        // console.log(tmpAllArchivements[0].data.gate1.basic);
        const gate: any = [];
        const topic: any = [];
        const array: any = [];
        const arrayTotal: any = [];
        const result: any = [];
        tmpAllArchivements.forEach((x, i) => gate.push(Object.keys(x.data)));
        tmpAllArchivements.forEach((x, i) =>
            gate
                .flat()
                .forEach((y, i2) => topic.push(Object.keys(x.data[gate.flat()[i2]]))),
        );
        // console.log(topic.flat());

        tmpAllArchivements.forEach((x, i) =>
            gate.flat().forEach((y, i2) => array.push(x.data[gate.flat()[i2]])),
        );
        topic.flat().forEach((x, i) => arrayTotal.push(array[i][x]));
        arrayTotal.flat().forEach((x, i) => result.push(JSON.parse(x)));

        const initialValue = 0;
        const sumWithInitial = result
            .flat()
            .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                initialValue,
            );
        const total = tmpAllArchivements.map((x, i) => ({
            id: x.id,
            point: sumWithInitial,
        }));
        setDataPoint(total);
        console.log(sumWithInitial, result);
        const promise = tmpAllArchivements.map((item: any) =>
            getUsersById(item.id),
        );
        Promise.all(promise).then((data) =>
        {
            const array: any = [];
            data.forEach((d) =>
            {
                array.push(d);
            });
            setData(array);
        });
    };

    useEffect(() =>
    {
        quearyData();
    }, []);
    return (
        <ImageBackground
            style={{ width: '100%' }}
            source={require('../../Assets/Images/backgound.jpg')}
        >
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.viewBtn}>
                        <TouchableOpacity
                            style={!handle ? styles.btn2 : styles.btn}
                            onPress={() => setHandle(false)}
                        >
                            <Image
                                style={{ width: 25, height: 25, marginRight: 5 }}
                                source={require('../../Assets/Images/rank/friendship-64.png')}
                            />
                            <Text style={!handle ? styles.textBtn2 : styles.textBtn}>
                Bạn bè
                            </Text>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 10 }} />
                        <TouchableOpacity
                            style={handle ? styles.btn2 : styles.btn}
                            onPress={() => setHandle(true)}
                        >
                            <Image
                                style={{ width: 25, height: 25, marginRight: 5 }}
                                source={require('../../Assets/Images/rank/world-64.png')}
                            />
                            <Text style={handle ? styles.textBtn2 : styles.textBtn}>
                Thế giới
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewContent}>
                        <View style={styles.viewTop}>
                            <View style={styles.second}>
                                <View style={styles.secondAvatar}>
                                    {data[1]?.avatar !== '' && data[1]?.avatar !== undefined && (
                                        <FastImage
                                            style={{
                                                height: 80,
                                                width: 80,
                                                borderRadius: 99,
                                                borderWidth: 0.1,
                                                overflow: 'hidden',
                                            }}
                                            source={{
                                                uri: data[1]?.avatar,
                                            }}
                                        />
                                    )}
                                </View>
                                <Text style={styles.Stt2}>#2</Text>
                                <Text style={styles.name}>{data[1]?.name}</Text>
                                <Text style={styles.point2}>{data[1]?.point}</Text>
                            </View>
                            <View style={styles.first}>
                                <View style={styles.firstAvatar}>
                                    {data[0]?.avatar !== '' && data[0]?.avatar !== undefined && (
                                        <FastImage
                                            style={{
                                                height: 90,
                                                width: 90,
                                                borderRadius: 99,
                                                borderWidth: 0.1,
                                                overflow: 'hidden',
                                            }}
                                            source={{
                                                uri: data[0]?.avatar,
                                            }}
                                        />
                                    )}
                                </View>
                                <Text style={styles.Stt2}>#1</Text>
                                <Text style={styles.name}>{data[0]?.name}</Text>
                                <Text style={styles.point2}>{dataPoint[0]?.point}</Text>
                            </View>
                            <View style={styles.third}>
                                <View style={styles.thirdAvatar}>
                                    {data[2]?.avatar !== '' && data[2]?.avatar !== undefined && (
                                        <FastImage
                                            style={{
                                                height: 70,
                                                width: 70,
                                                borderRadius: 99,
                                                borderWidth: 0.1,
                                                overflow: 'hidden',
                                            }}
                                            source={{
                                                uri: data[2]?.avatar,
                                            }}
                                        />
                                    )}
                                </View>
                                <Text style={styles.Stt2}>#3</Text>
                                <Text style={styles.name}>{data[2]?.name}</Text>
                                <Text style={styles.point2}>{data[2]?.point}</Text>
                            </View>
                        </View>
                        <View style={styles.viewRank}>
                            {data.map(
                                (item, index) =>
                                    index >= 0 && (
                                        <View key={index}>
                                            <View style={styles.row}>
                                                <View style={styles.viewLeft}>
                                                    <Text style={styles.Stt}>#{index + 1}</Text>
                                                </View>
                                                <View style={styles.viewMid}>
                                                    <View style={styles.avatar}>
                                                        {item.avatar !== '' && item.avatar !== undefined && (
                                                            <FastImage
                                                                style={{
                                                                    height: 30,
                                                                    width: 30,
                                                                    borderRadius: 99,
                                                                    borderWidth: 0.1,
                                                                    overflow: 'hidden',
                                                                }}
                                                                source={{
                                                                    uri: item.avatar,
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                    <Text style={styles.nameRow}>{item.name}</Text>
                                                </View>
                                                <View style={styles.viewRight}>
                                                    <Text style={styles.Point}>
                                                        {dataPoint[index]?.point}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.viewHr}>
                                                <View style={styles.hr} />
                                            </View>
                                        </View>
                                    ),
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};
export default memo(Rank);
