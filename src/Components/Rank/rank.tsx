import React, { FC, memo, useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
    const [handle, setHandle] = useState(false);

    useEffect(() =>
    {
        getData();
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
                                <View style={styles.secondAvatar} />
                                <Text style={styles.Stt2}>#2</Text>
                                <Text style={styles.name}>{data[1]?.name}</Text>
                                <Text style={styles.point2}>{data[1]?.point}</Text>
                            </View>
                            <View style={styles.first}>
                                <View style={styles.firstAvatar} />
                                <Text style={styles.Stt2}>#1</Text>
                                <Text style={styles.name}>{data[0]?.name}</Text>
                                <Text style={styles.point2}>{data[0]?.point}</Text>
                            </View>
                            <View style={styles.third}>
                                <View style={styles.thirdAvatar} />
                                <Text style={styles.Stt2}>#3</Text>
                                <Text style={styles.name}>{data[2]?.name}</Text>
                                <Text style={styles.point2}>{data[2]?.point}</Text>
                            </View>
                        </View>
                        <View style={styles.viewRank}>
                            {data.map(
                                (item, index) =>
                                    index > 2 && (
                                        <>
                                            <View style={styles.row}>
                                                <View style={styles.viewLeft}>
                                                    <Text style={styles.Stt}>#{index + 1}</Text>
                                                </View>
                                                <View style={styles.viewMid}>
                                                    <View style={styles.avatar} />
                                                    <Text style={styles.nameRow}>{item.name}</Text>
                                                </View>
                                                <View style={styles.viewRight}>
                                                    <Text style={styles.Point}>{item.point}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.viewHr}>
                                                <View style={styles.hr} />
                                            </View>
                                        </>
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
