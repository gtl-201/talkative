import { firebase } from '@react-native-firebase/auth';
import React, { FC, memo, useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserInfor } from '../../Models';
import {
    getAchievements,
    getRank,
    getUsersById,
    UserServices,
} from '../../Store/Services/user-services';
import { SIZES } from '../../Utils/Values';
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
    const [dataTopic, setDataTopic] = useState<any>([]);
    const [dataGate, setDataGate] = useState<any>([]);
    const [userInfor, setUserInfor] = useState<UserInfor>();
    const [dataPoint,setDataPoint] = useState(0);
    useEffect(() =>
    {
        async function fetchUserInfor()
        {
            const userData = await UserServices.getUidUserInfor(`${firebase.auth().currentUser?.uid}`);
            setUserInfor(userData);
        }

        fetchUserInfor();
    }, []);
    // console.log('----------',dataTopic);

    const quearyData = async () =>
    {
        const tmpAllArchivements: any = await getAchievements();
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
        ),
        setDataTopic(array);
        const totalGate: any = {};
        console.log(array,"-=-=-=-=-=");
        
        let totalPoint = 0;
        array.forEach((x, i) =>
        {
            if (totalGate[x.gate])
            {
                totalGate[x.gate] += x.point;
            }
            else
            {
                totalGate[x.gate] = x.point;
            }
        });
        
        array.forEach((x, i) =>
        {
            totalPoint += x.point;
        });
        setDataPoint(totalPoint);
        const result: any = Object.keys(totalGate).map((x) => ({
            gate: x,
            point: totalGate[x],
        }));
        setDataGate(result);
    };

    useEffect(() =>
    {
        quearyData();
    }, []);

    const renderPer = (value) =>
    {
        const per = value / 4 / 3;
        const color =
      per > 0 && per <= 25
          ? 'red'
          : per > 25 && per <= 50
              ? 'orange'
              : per > 50 && per <= 75
                  ? '#f1c500'
                  : 'green';
        return (
            <CircularProgress
                value={per}
                radius={(SIZES.WIDTH_WINDOW * 0.25) / 1.3}
                progressValueColor={color}
                duration={500}
                activeStrokeColor={color}
                // inActiveStrokeColor={'#5C8AEA'}
                // subtitleColor={'#fff0'}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={20}
                activeStrokeWidth={20}
                valueSuffix={'%'}
                valueSuffixStyle={{fontSize: 40,fontWeight: '500',lineHeight: 75}}
                progressValueStyle={{fontWeight: '500'}}
            />
        );
    };
    const renderPerTopic = (value) =>
    {
        const per = value / 4;
        const color =
      per > 0 && per <= 25
          ? 'red'
          : per > 25 && per <= 50
              ? 'orange'
              : per > 50 && per <= 75
                  ? '#f1c500'
                  : 'green';
        return (
            <CircularProgress
                value={per}
                radius={(SIZES.WIDTH_WINDOW * 0.25) / 2}
                progressValueColor={color}
                duration={500}
                activeStrokeColor={color}
                // inActiveStrokeColor={'#5C8AEA'}
                titleColor={'#fff0'}
                subtitleColor={'#fff0'}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={18}
                activeStrokeWidth={18}
                valueSuffix={'%'}
                valueSuffixStyle={{fontSize: 22,fontWeight: '500',lineHeight: 50}}
                progressValueStyle={{fontWeight: '500',fontSize: 22}}
            />
        );
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <View>
                        <View style={styles.row}>
                            <View style={styles.viewLeft}>
                                <Text style={styles.Stt}>#</Text>
                            </View>
                            <View style={styles.viewMid}>
                                <View style={styles.avatar}>
                                    {userInfor?.avatar !== '' && userInfor?.avatar !== undefined && (
                                        <FastImage
                                            style={{
                                                height: 30,
                                                width: 30,
                                                borderRadius: 99,
                                                borderWidth: 0.1,
                                                overflow: 'hidden',
                                            }}
                                            source={{
                                                uri: userInfor?.avatar,
                                            }}
                                        />
                                    )}
                                </View>
                                <Text style={styles.nameRow}>{userInfor?.name}</Text>
                                {userInfor?.id === firebase.auth().currentUser?.uid && (
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
                                <Text style={styles.Point}>{dataPoint}</Text>
                            </View>
                        </View>
                        <View style={styles.viewHr}>
                            <View style={styles.hr} />
                        </View>
                    </View>
                    {dataGate.map((item,index)=>(
                        <View
                            key={index}
                            style={{ marginTop: 20, alignItems: 'center',marginBottom: 30 }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginBottom: 10,
                                    textTransform: 'uppercase',
                                }}
                            >
                                {item.gate}
                            </Text>

                            {renderPer(item.point)}
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginBottom: 10,
                                    marginTop: 25,
                                }}
                            >
            Percentage in topics
                            </Text>
                        
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-evenly',
                                    width: '100%',
                                }}
                            >
                                {dataTopic.map((x,i)=> x.gate === item.gate && (
                                    <View key={i}>
                                        {renderPerTopic(x.point)}
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                textAlign: 'center',
                                                marginTop: 5,
                                            }}
                                        >
                                            {x.topic}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};
export default memo(Rank);
