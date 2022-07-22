import React, { useState } from 'react';
import { Image, Pressable, StyleProp, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../BaseComponents/Icon';
import { moderateScale, scale } from 'react-native-size-matters';
import styleScaled from './style';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { IMAGE } from '../../../Utils/Values';

import Header from '../../../Components/BaseComponents/Header';
import Button from '../../Button';
import { firebase } from '@react-native-firebase/auth';

interface VideoCallProps {
    color?: any;
    hangup?: any;
    join?: any;
}

function VideoCall({ color, hangup, join }: VideoCallProps)
{
    const navigation = useNavigation();
    const styles = styleScaled(color);

    const joinCall = () =>
    {
        join();
    };

    const hangupCall = () =>
    {
        hangup();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{firebase.auth().currentUser?.displayName}</Text>
            <Text style={styles.info}>{firebase.auth().currentUser?.phoneNumber}</Text>
            <View style={styles.imgCon}>
                <Image
                    resizeMode="contain"
                    resizeMethod="scale"
                    style={[styles.imagePreview]}
                    source={firebase.auth().currentUser?.photoURL !== null ? { uri: firebase.auth().currentUser?.photoURL } : IMAGE.EMPTY_AVATAR}
                />
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.flexRow}>
                    <Button
                        type={'MaterialIcons'}
                        colorIc={color.IC_WHITE}
                        bgColor={'#01961a'}
                        icon={'call'}
                        onPressIc={() => joinCall()}
                    />

                    <Button
                        type={'MaterialIcons'}
                        colorIc={color.IC_WHITE}
                        bgColor={'#f94332'}
                        icon={'call-end'}
                        onPressIc={() => hangupCall()}
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
