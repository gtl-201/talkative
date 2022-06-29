import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import { useFocusEffect } from '@react-navigation/native';
import { bindActionCreators } from 'redux';

import Header from '../../Components/BaseComponents/Header';
import * as ControlAppActions from '../../Store/Actions/control-app-actions';
import styleScaled from './style';

import { EventOnAddStream, MediaStream, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
import GettingCall from '../../Components/Call/VideoCall/gettingCall';
import VideoCallComponent from '../../Components/Call/VideoCall';
import VideoCallUtils from '../../Utils/VideoCall';
// import { event } from "react-native-reanimated";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../Components/BaseComponents/Icon';
import InCallManager from 'react-native-incall-manager';
import moment from 'moment';
import { ShowToast } from '../../Utils/Helpers';
import SoundRecorder from 'react-native-sound-recorder';
import SoundPlayer from 'react-native-sound-player';
import { MMKV } from 'react-native-mmkv';
import HowLearn from '../../Components/HowLearn/index';
import { UserServices } from '../../Store/Services/user-services';

// import {AudioRecorder, AudioUtils} from 'react-native-audio';

const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

const VideoCall: FC<any> = (props) =>
{
    const { userInfor, navigation, setBackgroundScreenDrawer, color, language, route, onCall, onHangup } = props;
    const styles = styleScaled(color);
    const refViewShot: any = useRef();
    const [showHowLearn, setShowHowLearn] = useState<boolean>(true);
    useEffect(() =>
    {
        async function fetchUserInfor()
        {
            const userData = await UserServices.getUidUserInfor(auth().currentUser?.uid ?? '');
            userData !== undefined &&
                userData.howKnowWe !== undefined &&
                userData.level !== undefined &&
                userData.whyLearn !== undefined &&
                userData.purpose !== undefined &&
                setShowHowLearn(false);
            console.log(userData);
            
        }

        fetchUserInfor();
    }, []);
    return (
        <ViewShot
            ref={refViewShot}
            style={[styles.container, { flex: 1 }]}
            options={{ result: 'base64', quality: 0.5 }}
        >
            {!showHowLearn
                ? (
                        <>
                            <Header
                                iconLeftType={'MaterialIcons'}
                                iconLeft={'notes'}
                                title={language.Speaker}
                                iconSize={35}
                                shadow={false}
                                iconRightType="FontAwesome"
                                // iconRight={switchIc}
                                headerRight
                                onPressLeft={() => navigation.openDrawer()}
                            />
                        </>
                    )
                : (
                        <HowLearn
                            color={color}
                            language={language}
                            navigation={navigation}
                            userInfor={userInfor}
                            onFinish={()=>setShowHowLearn(false)}
                        />
                    )}
        </ViewShot>
    );
};

function mapStateToProps(state: any)
{
    return {
        color: state.controlApp.settings.color.HOWLEARN,
        userInfor: state.user.userInfor,
        language: state.controlApp.settings.language,
    };
}

function mapDispatchToProps(dispatch: any)
{
    return {
        setBackgroundScreenDrawer: bindActionCreators(ControlAppActions.setBackgroundScreenDrawer, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoCall);
