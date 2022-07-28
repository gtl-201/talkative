import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View, Animated, Image, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import { getAchievements, getQuest, updateArchivement } from '../../../Store/Services/user-services';
import { SHADOW_3, SHADOW_7, SIZES } from '../../../Utils/Values';
// import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';

import SoundPlayer from 'react-native-sound-player';

interface Props {
    color: any;
    language: any;
    navigation: any;
    gate: string;
    round: string;
    level: string;
}

const Learn: FC<Props> = (props) =>
{
    // const navigation = useNavigation();
    const { color, language, navigation, gate, round, level } = props;
    const styles = styleScaled(color);

    Tts.setDefaultVoice('com.apple.ttsbundle.siri_male_en-US_compact');
    // console.log(gate, round, '?????');
    const [dataLearn, setDataLearn] = useState<any>();
    const getAllLearn = async () =>
    {
        const allLearn = await getQuest(gate, round, level);
        console.log(allLearn);
        allLearn.sort((a, b) =>
        {
            const keyA = parseInt(a.type);
            const keyB = parseInt(b.type);
            // Compare the 2 dates
            if (keyA < keyB)
            {
                return -1;
            }
            if (keyA > keyB)
            {
                return 1;
            }
            return 0;
        });
        setDataLearn(allLearn);
    };

    useEffect(() =>
    {
        getAllLearn();
    }, []);
    const [typeList, setTypeList] = useState(false);
    return (
        <View style={{ position: 'relative', flex: 1 }}>
            {/* <Text>hello</Text> */}
            <View style={{ position: 'absolute', zIndex: 999, bottom: 55, right: 25 }}>
                <TouchableOpacity
                    style={{ padding: 7, borderRadius: 30, ...SHADOW_7, backgroundColor: color.ON_SURFACE_VARIANT }}
                    onPress={() =>
                    {
                        setTypeList(!typeList);
                    }}
                >
                    <Icon
                        type={'MaterialIcons'}
                        name={typeList ? 'segment' : 'layers'}
                        size={moderateScale(35)}
                        color={color.TITLE_TXT}
                    />
                </TouchableOpacity>
            </View>
            <FlatList
                data={dataLearn}
                keyExtractor={({ item, index }) => index}
                // contentContainerStyle={{ flex: 1 }}
                renderItem={({ item, index }) =>
                {
                    console.log(item, '++++++++++++++++++++++');

                    return (
                        <>
                            <View style={{ width: SIZES.WIDTH_WINDOW, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={typeList ? styles.cardBoxResult2 : styles.cardBoxResult}>
                                    {typeList && item.pic && (
                                        <Image
                                            source={{ uri: item.pic }}
                                            resizeMode={'cover'}
                                            style={{ width: SIZES.WIDTH_WINDOW - 25, height: 200 }}
                                        />
                                    )}
                                    <TouchableOpacity
                                        activeOpacity={0.2}
                                        style={typeList ? { width: SIZES.WIDTH_WINDOW - 25 } : styles.left}
                                        onPress={() =>
                                        {
                                            Tts.setDefaultLanguage('en-IE');
                                            Tts.speak(item.rightEn);
                                        }}
                                    >
                                        <Text style={[styles.subTitle2, typeList && { marginVertical: 0, textAlign: 'center' }, { color: 'red' }]}>{item.rightEn}</Text>

                                        {item.noun && (
                                            <Text
                                                style={[styles.subTitle, typeList && { marginVertical: 0, textAlign: 'center' }, { textTransform: 'lowercase', color: '#3cd184' }]}
                                            >
                                                {item.noun}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={typeList ? { width: SIZES.WIDTH_WINDOW - 25 } : styles.right}
                                        activeOpacity={0.2}
                                        onPress={() =>
                                        {
                                            Tts.setDefaultLanguage('vi-VN');
                                            Tts.speak(item.rightVi);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.subTitle,
                                                typeList
                                                    ? { marginVertical: 0, textAlign: 'center', textTransform: 'capitalize' }
                                                    : { textAlign: 'right', textTransform: 'capitalize' },
                                            ]}
                                        >
                                            {item.rightVi}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    );
                }}
            />
        </View>
    );
};

export default memo(Learn);
