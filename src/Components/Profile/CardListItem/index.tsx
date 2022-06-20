import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { FC, memo, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';

interface Props {
    color: any;
    // makeCall?: any;
    // getCall?: any;
    language: object;
    data: any;
    title: string;
    caller?: boolean;
}

const CardListItem: FC<Props> = (props) =>
{
    const { color, language, caller } = props;
    const styles = styleScaled(color);
    const navigation = useNavigation();

    const [showMakeCall, setShowMakeCall] = useState(true);
    const toggleMakeCall = () =>
    {
        setShowMakeCall(!showMakeCall);
    };

    // const [nameCallee, setNameCallee] = useState('');
    const renderMakeCall = ({ item, index }) =>
    {
        const totalTime =
            moment.duration(moment(item.end * 1000).diff(moment(item.start * 1000))).asHours() >= 1
                ? moment.duration(moment(item.end * 1000).diff(moment(item.start * 1000))).asHours() + ' h'
                : moment.duration(moment(item.end * 1000).diff(moment(item.start * 1000))).asMinutes() >= 1
                    ? moment.duration(moment(item.end * 1000).diff(moment(item.start * 1000))).asMinutes() + ' m'
                    : moment.duration(moment(item.end * 1000).diff(moment(item.start * 1000))).asSeconds() + ' s';

        return (
            <>
                {props.data && props.data.length !== 0 && (
                    <TouchableOpacity
                        key={index}
                        style={styles.borderBt}
                        onPress={() =>
                        {
                            navigation.navigate('ProfileOther', { userId: caller ? item.idCallee : item.idCaller });
                        }}
                    >
                        <View style={styles.flexRow}>
                            <Text style={styles.textTitle1}>{caller ? language.CALLEE : language.CALLER}: </Text>
                            <Text style={styles.textTitle}>{caller ? item.nameCallee ?? '' : item.nameCaller ?? ''}</Text>
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={styles.textTitle1}>{language.START_TIME}: </Text>
                            <Text style={styles.textTitle}>{moment(item.start * 1000).format('DD/MM/YYYY HH:mm:ss')}</Text>
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={styles.textTitle1}>{language.END_TIME}: </Text>
                            <Text style={styles.textTitle}>{moment(item.end * 1000).format('DD/MM/YYYY HH:mm:ss')}</Text>
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={styles.textTitle1}>{language.TOTAL_TIME_CALL}: </Text>
                            <Text style={styles.textTitle}>{totalTime}</Text>
                            {/* Math.abs(item.end * 1000 - item.start * 1000) / 36e5 */}
                        </View>
                    </TouchableOpacity>
                )}
            </>
        );
    };

    const dataResort = props.data
        ? props.data.sort((a: any, b: any) =>
        {
            return new Date(b.start) - new Date(a.start); // ascending
        })
        : [];

    return (
        <View style={styles.container}>
            <View style={styles.containerCount}>
                <TouchableOpacity
                    style={{ alignItems: 'center', width: Dimensions.get('window').width * 0.9 }}
                    onPress={() => toggleMakeCall()}
                >
                    <Text style={styles.textCount}>
                        🐉🐍🐢 {props.data.length} {props.title} 🐢🐍🐉
                    </Text>
                    {!showMakeCall && props.data.length !== 0 && (
                        <Icon
                            type={'MaterialIcons'}
                            name={'keyboard-arrow-down'}
                            size={moderateScale(35, 0.5)}
                            color={'black'}
                        />
                    )}
                </TouchableOpacity>

                <FlatList
                    data={showMakeCall ? dataResort : []}
                    keyExtractor={(_item: any, index: number) => index.toString()}
                    renderItem={renderMakeCall}
                    // contentContainerStyle={}
                    style={{ height: 'auto' }}
                />
            </View>
        </View>
    );
};
export default memo(CardListItem);
