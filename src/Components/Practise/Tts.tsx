import React, { FC, memo, useEffect, useState } from 'react';
import { Keyboard, Slider, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../BaseComponents/Icon';
import styleScaled from './style';
import Tts from 'react-native-tts';
// import { ShowToast } from '../../Utils/Helpers';
import { SIZES } from '../../Utils/Values';
import Modal from 'react-native-modal';

interface Props {
    color: any;
    // makeCall?: any;
    // getCall?: any;
    language: object;
}

const TtsComponent: FC<Props> = (props) =>
{
    const { color, language } = props;
    const styles = styleScaled(color);
    const [txtSpeech, setTxtSpeech] = useState('');
    const [rate, setRate] = useState<number>(0.5);
    const [pitch, setPitch] = useState<number>(1.2);

    useEffect(() =>
    {
        Tts.setDefaultLanguage('en-IE');
        Tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact');
    }, []);

    useEffect(() =>
    {
        Tts.setDefaultRate(rate);
    }, [rate]);
    useEffect(() =>
    {
        Tts.setDefaultPitch(pitch);
    }, [pitch]);

    const Speach = (txt: string) =>
    {
        Tts.speak(txt);
        // Tts.speak(txt, {
        //     androidParams: {
        //         KEY_PARAM_PAN: -1,
        //         KEY_PARAM_VOLUME: 10,
        //         KEY_PARAM_STREAM: 'STREAM_MUSIC',
        //     },
        // });
        // https://github.com/ak1394/react-native-tts
    };

    const [invisibleModal, setInvisibleModal] = useState(false);
    return (
        <View
            style={styles.container}
            onTouchStart={() => Keyboard.dismiss()}
        >
            <TouchableOpacity
                style={styles.btnBig}
                onPress={() => Speach(txtSpeech)}
            >
                <Icon
                    type={'MaterialIcons'}
                    name={'volume-up'}
                    size={moderateScale(20, 0.5)}
                    color={'white'}
                />
            </TouchableOpacity>
            <TextInput
                // maxLength={15}
                returnKeyType={'done'}
                placeholder={'enter text to phone speak'}
                placeholderTextColor={color.TXT_PLACE_HOLDER}
                style={styles.textInput}
                multiline
                onChangeText={(txt) =>
                {
                    setTxtSpeech(txt);
                }}
            />
            <TouchableOpacity
                style={[styles.btnBig, { position: 'absolute', left: 15, bottom: 10 }]}
                onPress={() => setInvisibleModal(true)}
            >
                <Icon
                    type={'MaterialIcons'}
                    name={'settings'}
                    size={moderateScale(20, 0.5)}
                    color={'white'}
                />
            </TouchableOpacity>
            <Modal
                animationIn={'fadeInUp'}
                animationInTiming={200}
                animationOutTiming={200}
                animationOut={'fadeOutDown'}
                backdropTransitionInTiming={200}
                backdropTransitionOutTiming={200}
                backdropColor={'black'}
                backdropOpacity={0.6}
                // hasBackdrop={true}
                style={{ marginVertical: 0, marginHorizontal: 0 }}
                isVisible={invisibleModal}
                statusBarTranslucent
                onBackdropPress={() => setInvisibleModal(false)}
                // hideModalContentWhileAnimating
                // onSwipeComplete={() => setVisible(false)}
                // swipeDirection={"down"}
                // useNativeDriver
            >
                <View
                    style={{ width: SIZES.WIDTH_WINDOW, justifyContent: 'center', alignItems: 'center' }}
                    // onTouchStart={() => setInvisibleModal(false)}
                >
                    <View style={styles.btnBig2}>
                        <Text style={{ width: SIZES.WIDTH_WINDOW * 0.2 }}>
                            {language.RATE}
                            {'\n'}
                            {rate}
                        </Text>
                        <Slider
                            style={{ width: SIZES.WIDTH_WINDOW * 0.55 }}
                            minimumValue={0.01}
                            maximumValue={0.99}
                            value={rate}
                            onSlidingComplete={setRate}
                        />
                    </View>

                    <View style={styles.btnBig2}>
                        <Text style={{ width: SIZES.WIDTH_WINDOW * 0.2 }}>
                            {language.PITCH}
                            {'\n'}
                            {pitch}
                        </Text>
                        <Slider
                            style={{ width: SIZES.WIDTH_WINDOW * 0.55 }}
                            minimumValue={0.2}
                            maximumValue={3.0}
                            value={pitch}
                            onSlidingComplete={setPitch}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.btnBig}
                        onPress={() =>
                        {
                            setRate(0.5);
                            setPitch(1.2);
                        }}
                    >
                        <Text style={styles.txtBigBtn2}>{language.SETDEFAULT}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};
export default memo(TtsComponent);
