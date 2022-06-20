import React, { FC, memo, useCallback, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styleScaled from './style';
import Icon from '../../BaseComponents/Icon';
import { moderateScale, scale } from 'react-native-size-matters';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import ModalContact from '../ModalContact';
// import { UserInfor } from '../../../Models';
import { ShowToast } from '../../../Utils/Helpers';
import { firebase } from '@react-native-firebase/storage';

interface Props {
    color: any;
    isFollowed: boolean;
    navigation: DrawerNavigationProp<any>;
    userInfor: any;
    language: object;
}

const BottomButton: FC<Props> = (props) =>
{
    const { color, language, isFollowed, navigation, userInfor } = props;
    const styles = styleScaled(color);
    // const refModalContact = useRef();

    // const showModalContact = useCallback(() =>
    // {
    //     refModalContact.current.show();
    // }, []);

    const onFollowingPress = useCallback(() => ShowToast('info', language.LET_ME_TELL_YOU, 'Updating'), []);

    const onFollowPress = useCallback(() => ShowToast('info', language.LET_ME_TELL_YOU, language.SAME_REPORT_BTN), []);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={styles.touchButton}
                    // onPress={showModalContact}
                    onPress={() =>
                    {
                        navigation.navigate('MessageView', {
                            conversationObject: [firebase.auth().currentUser.uid, userInfor.id],
                            data: userInfor,
                        });
                    }}
                >
                    <Icon
                        type={'MaterialIcons'}
                        name={'chat'}
                        size={moderateScale(23, 0.3)}
                        color={color.BOTTOMBUTTON_IC_BOTTOM}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.touchButton, { marginLeft: scale(15) }]}
                    onPress={onFollowingPress}
                >
                    <Icon
                        type={'MaterialIcons'}
                        name={'call'}
                        size={moderateScale(23, 0.3)}
                        color={color.BOTTOMBUTTON_IC_BOTTOM}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                    styles.touchButton,
                    {
                        backgroundColor: isFollowed ? color.BOTTOMBUTTON_BG_BIGBUTTON_UNFOLLOW : color.BOTTOMBUTTON_BG_BIGBUTTON_FOLLOW,
                    },
                ]}
                onPress={onFollowPress}
            >
                <Icon
                    type={'MaterialCommunityIcons'}
                    name={isFollowed ? 'eye-minus' : 'eye-plus'}
                    size={moderateScale(23, 0.3)}
                    color={isFollowed ? color.BOTTOMBUTTON_IC_EYEMINUS : color.BOTTOMBUTTON_IC_EYEPLUS}
                />
                <Text
                    style={[
                        styles.textBigButton,
                        {
                            color: isFollowed ? color.BOTTOMBUTTON_TXT_BIGBUTTON_UNFOLLOW : color.BOTTOMBUTTON_TXT_BIGBUTTON_FOLLOW,
                        },
                    ]}
                >
                    {isFollowed ? language.UNFOLLOW : language.FOLLOW}
                </Text>
            </TouchableOpacity>

            {/* <ModalContact
                ref={refModalContact}
                language={language}
                color={color}
                userInfor={userInfor}
            /> */}
        </View>
    );
};
export default memo(BottomButton);
