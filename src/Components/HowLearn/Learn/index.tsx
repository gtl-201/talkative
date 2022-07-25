import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View, Animated, Image, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import { getAchievements, getQuest, updateArchivement } from '../../../Store/Services/user-services';
import { SIZES } from '../../../Utils/Values';
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
    const getAllQuest = async () =>
    {
        const allQuest = await getQuest(gate, round, level);
        // console.log(allRightVi.flat());
        // setListRightEn(allRightEn.flat());
        // setListRightVi(allRightVi.flat());
        // setDataQuest(allQuest);
        console.log(allQuest);
        
    };
    useEffect(() =>
    {
        getAllQuest();
    }, []);

    return <></>;
};

export default memo(Learn);
