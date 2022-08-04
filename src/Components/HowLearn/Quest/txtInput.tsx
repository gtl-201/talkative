import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View, Animated, Image, ImageBackground, Pressable, TextInput, TextInputProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale, scale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import { getAchievements, getQuest, updateArchivement } from '../../../Store/Services/user-services';
import { SHADOW_3, SHADOW_5, SIZES } from '../../../Utils/Values';
// import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';

import SoundPlayer from 'react-native-sound-player';

interface Props extends TextInputProps {
    color: any;
    language: any;
    onChangeText:(value: string)=>void;
    onBlur:(x: string)=>void;
}

const TxtInput: FC<Props> = (props) =>
{
    const { color, language } = props;
    const [txtAns, setTxtAns] = useState('');
    const [focusInput, setFocusInput] = useState(false);
    return (
        <TextInput
            {...props}
            style={[
                {
                    width: SIZES.WIDTH_WINDOW - 25,
                    ...SHADOW_5,
                    backgroundColor: color.BG,
                    borderWidth: 2,
                    borderRadius: 10,
                    fontSize: 20,
                    paddingHorizontal: 7,
                    paddingVertical: 10,
                    marginTop: 15,
                    borderColor: color.ON_SURFACE_VARIANT,
                },
                focusInput ? { borderColor: color.IC } : { borderColor: color.ON_SURFACE_VARIANT },
            ]}
            placeholder={language.ENTERWHATYOUHEAR}
            value={txtAns}
            onChangeText={(value) =>
            {
                props.onChangeText(value);
                setTxtAns(value);
            }}
            onFocus={() => setFocusInput(true)}
            onBlur={(x) => {
                props.onBlur(x);
                setFocusInput(false);
            }}
        />
    );
};

export default memo(TxtInput);
