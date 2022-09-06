import { firebase } from '@react-native-firebase/auth';
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
    const { color,language } = props;
    const styles = styleScaled(color);
    const [data, setData] = useState<any>([]);
    const [dataPoint, setDataPoint] = useState<any>([]);
    const [handle, setHandle] = useState(false);
    const [dataListFriends, setDataListFriends] = useState<any>([]);
    const [dataListWorld, setDataListWorld] = useState<any>([]);


    const quearyData = async () =>
    {
        const tmpAllArchivements: any = await getRank();
        // const gate: any = [];
        const topic: any = [];
        const array: any = [];
        const arrayTotal: any = [];
        const result: any = [];

        const gate: any = tmpAllArchivements.map((x, i) => ({
            key: Object.keys(x.data),
            id: x.id,
        }));
        tmpAllArchivements.map((x, i) =>
        {
            gate.map(
                (y, i2) =>
                    x.id === y.id &&
          y.key.map((z, i3) =>
              topic.push({
                  key: Object.keys(x.data[z] ?? {}),
                  gate: z,
                  id: y.id,
              }),
          ),
            );
        });
        tmpAllArchivements.map((x, i) =>
        {
            gate.map(
                (y, i2) =>
                    x.id === y.id &&
          y.key.map((z, i3) =>
              topic.map(
                  (t, i4) =>
                      y.id === t.id &&
                z === t.gate &&
                t.key.map((k, i5) =>
                {
                    const initialValue = 0;
                    const sumWithInitial = x.data[z][k].reduce(
                        (previousValue, currentValue) =>
                            previousValue + currentValue,
                        initialValue,
                    );
                    array.push({ point: sumWithInitial, id: t.id });
                }),
              ),
          ),
            );
        });

        const total: any = {};

        array.forEach((x, i) =>
        {
            if (total[x.id])
            {
                total[x.id] += x.point;
            }
            else
            {
                total[x.id] = x.point;
            }
        });

        setDataPoint(total);
        const dataUser: any = await getUsersById(
            `${firebase.auth().currentUser?.uid}`,
        );
        const dataF =
      dataUser.friends[0] === '' && dataUser.friends.length === 1
          ? []
          : dataUser.friends;
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
            setDataListWorld(array.sort((a, b) => total[b.id] - total[a.id]));
            setDataListFriends(
                array
                    .filter((a) => dataF.find((b) => a.id === b.id) || a.id === firebase.auth().currentUser?.uid)
                    .sort((a, b) => total[b.id] - total[a.id]),
            );
            setData(
                array
                    .filter((a) => dataF.find((b) => a.id === b.id) || a.id === firebase.auth().currentUser?.uid)
                    .sort((a, b) => total[b.id] - total[a.id]),
            );
        });
    };

    useEffect(() =>
    {
        quearyData();
    }, []);

    const handleBtn = (val) =>
    {
        setHandle(val);
        val ? setData(dataListWorld) : setData(dataListFriends);
    };
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
                            onPress={() => handleBtn(false)}
                        >
                            <Image
                                style={{ width: 25, height: 25, marginRight: 5 }}
                                source={require('../../Assets/Images/rank/friendship-64.png')}
                            />
                            <Text style={!handle ? styles.textBtn2 : styles.textBtn}>
                {language.FRIEND}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 10 }} />
                        <TouchableOpacity
                            style={handle ? styles.btn2 : styles.btn}
                            onPress={() => handleBtn(true)}
                        >
                            <Image
                                style={{ width: 25, height: 25, marginRight: 5 }}
                                source={require('../../Assets/Images/rank/world-64.png')}
                            />
                            <Text style={handle ? styles.textBtn2 : styles.textBtn}>
                            {language.WORLD}
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
                                <Text style={styles.point2}>{dataPoint[data[1]?.id]}</Text>
                                {data[1]?.id === firebase.auth().currentUser?.uid && (
                                    <View
                                        style={{
                                            backgroundColor: '#42f54b',
                                            paddingHorizontal: 10,
                                            paddingVertical: 1,
                                            borderRadius: 30,
                                        }}
                                    >
                                        <Text style={styles.textYou}>You</Text>
                                    </View>
                                )}
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
                                <Text style={styles.point2}>{dataPoint[data[0]?.id]}</Text>
                                {data[0]?.id === firebase.auth().currentUser?.uid && (
                                    <View
                                        style={{
                                            backgroundColor: '#42f54b',
                                            paddingHorizontal: 10,
                                            paddingVertical: 1,
                                            borderRadius: 30,
                                        }}
                                    >
                                        <Text style={styles.textYou}>You</Text>
                                    </View>
                                )}
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
                                <Text style={styles.point2}>{dataPoint[data[2]?.id]}</Text>
                                {data[2]?.id === firebase.auth().currentUser?.uid && (
                                    <View
                                        style={{
                                            backgroundColor: '#42f54b',
                                            paddingHorizontal: 10,
                                            paddingVertical: 1,
                                            borderRadius: 30,
                                        }}
                                    >
                                        <Text style={styles.textYou}>You</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={styles.viewRank}>
                            {data.map(
                                (item, index) =>
                                    index >= 3 && (
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
                                                    {item.id === firebase.auth().currentUser?.uid && (
                                                        <View
                                                            style={{
                                                                backgroundColor: '#42f54b',
                                                                paddingHorizontal: 10,
                                                                paddingVertical: 1,
                                                                borderRadius: 30,
                                                                marginLeft: 5,
                                                            }}
                                                        >
                                                            <Text style={styles.textYou}>You</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <View style={styles.viewRight}>
                                                    <Text style={styles.Point}>{dataPoint[item.id]}</Text>
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
