import React, { useEffect, useState } from 'react';
import { Pressable, StyleProp, Text, TouchableOpacity, View, Image } from 'react-native';
import Icon from '../../BaseComponents/Icon';
import { moderateScale, scale } from 'react-native-size-matters';
import styleScaled from './style';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Button from '../../Button/';

import Header from '../../../Components/BaseComponents/Header';
import { IMAGE } from '../../../Utils/Values';
import { RTCView } from 'react-native-webrtc';
import { mediaDevices } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
interface VideoCallProps {
    color?: any;
    hangup?: any;
    localStream?: any;
    remoteStream?: any;
    hangupAndSave?: any;
}

function VideoCall({ color, hangup, localStream, remoteStream, hangupAndSave }: VideoCallProps)
{
    const navigation = useNavigation();
    const styles = styleScaled(color);

    const [cameraOn, setCameraOn] = useState(true);
    const [microOn, setMicroOn] = useState(true);
    const [speaker, setSpeaker] = useState(true);

    useEffect(() =>
    {
        InCallManager.setForceSpeakerphoneOn(true);
    }, []);

    const toggleSpeaker = () =>
    {
        setSpeaker(!speaker);
        speaker ? InCallManager.setForceSpeakerphoneOn(false) : InCallManager.setForceSpeakerphoneOn(true);
    };

    const turnCam = async () =>
    {
        localStream.getTracks().forEach((track: any) =>
        {
            if (track.kind === 'video')
            {
                track.enabled = !cameraOn;
            }
        });
        checkremoteCam();
    };

    const turnMic = () =>
    {
        localStream.getTracks().forEach((track: any) =>
        {
            if (track.kind === 'audio')
            {
                track.enabled = !microOn;
            }
        });
    };

    // useEffect(() => {
    //   console.log(remoteStream.getTracks, 'ummmmm')
    // }, [remoteStream])

    const checkremoteCam = async () =>
    {
        // remoteStream &&
        // remoteStream.getTracks().forEach((track: any) => {
        //   if (track.kind === 'video') {
        //     console.log(track.enabled, '_______________====');
        //   }
        // });
        // const sourceInfos = await mediaDevices.getUserMedia;
        // console.log(sourceInfos);
    };

    const switchCamera = async () =>
    {
        await setCameraOn(!cameraOn);
        turnCam();
    };

    const switchMicro = () =>
    {
        setMicroOn(!microOn);
        turnMic();
    };
    // console.log("remoteStream: ", remoteStream, '================= remote');
    // console.log("LOCAL stream: ", localStream, '================= local');

    const RTConlyLocalStream = (): JSX.Element =>
    {
        return (
            <RTCView
                streamURL={localStream.toURL()}
                objectFit={'cover'}
                style={styles.video}
                mirror
            />
        );
    };

    const RTC2P2Stream = (): JSX.Element =>
    {
        return (
            <>
                <RTCView
                    streamURL={remoteStream.toURL()}
                    objectFit={'cover'}
                    style={styles.video}
                    // ref={(ref)=>setRemoteStr(ref)}
                    mirror
                />
                <RTCView
                    streamURL={localStream.toURL()}
                    objectFit={'cover'}
                    style={styles.videoLocal}
                    mirror
                />
            </>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatar}>
                {localStream && !remoteStream && <RTConlyLocalStream />}
                {localStream && remoteStream && <RTC2P2Stream />}
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.flexRow}>
                    {speaker
                        ? (
                                <Button
                                    type={'MaterialIcons'}
                                    colorIc={color.IC_WHITE}
                                    icon={'volume-up'}
                                    onPressIc={() => toggleSpeaker()}
                                />
                            )
                        : (
                                <Button
                                    type={'MaterialIcons'}
                                    colorIc={color.IC_WHITE}
                                    icon={'phone-in-talk'}
                                    onPressIc={() => toggleSpeaker()}
                                />
                            )}

                    <Button
                        type={'MaterialIcons'}
                        colorIc={color.IC_WHITE}
                        icon={cameraOn ? 'videocam' : 'videocam-off'}
                        onPressIc={switchCamera}
                    />
                    <Button
                        type={'MaterialIcons'}
                        colorIc={color.IC_WHITE}
                        icon={microOn ? 'mic' : 'mic-off'}
                        onPressIc={switchMicro}
                    />
                    <Button
                        type={'MaterialIcons'}
                        colorIc={color.IC_WHITE}
                        bgColor={'#f94332'}
                        icon={'call-end'}
                        onPressIc={() =>
                        {
                            localStream && !remoteStream ? hangup() : localStream && remoteStream && hangupAndSave();
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

function mapStateToProps(state: any)
{
    return {
        color: state.controlApp.settings.color.VIDEOCALL,
    };
}

export default connect(mapStateToProps)(VideoCall);
