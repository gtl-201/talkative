import React, { FC, memo, useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    getAchievements,
    getRank,
    getUsersById,
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

    const renderPer = (value) =>
    {
        const per = value / 4;
        const color =
      per > 0 && per <= 25
          ? 'red'
          : per > 25 && per <= 50
              ? 'orange'
              : per > 50 && per <= 75
                  ? 'yellow'
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
            />
        );
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: 10,
                        }}
                    >
            Percentage of correct answers at Gate 1
                    </Text>

                    {renderPer(100)}
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
                        }}
                    >
                        <View>
                        {renderPer(150)}
                            <Text
                                style={{
                                    fontSize: 18,
                                    textAlign: 'center',
                                    marginTop: 5,
                                }}
                            >
                basic
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
export default memo(Rank);
