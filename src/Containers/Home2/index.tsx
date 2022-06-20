import React, { FC, useEffect, useRef, useState } from 'react';
import { AppState, BackHandler, Dimensions, StatusBar, View } from 'react-native';
import { LIGHT } from '../../Utils/Themes';
import styleScaled from './style';
// import {
//   useAnimatedScrollHandler,
//   useSharedValue,
// } from 'react-native-reanimated';
import { connect } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import { bindActionCreators } from 'redux';
import * as ControllAppActions from '../../Store/Actions/control-app-actions';
import * as PostActions from '../../Store/Actions/post-actions';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../Components/BaseComponents/Header';
import { UserServices } from '../../Store/Services/user-services';
import VideoCall from '../Call/VideoCall';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { MMKV } from 'react-native-mmkv';
// import OnlineList from '../../Components/Home2/OnlineList';

const Home: FC<any> = (props) =>
{
    const { navigation, userInfor, setBackgroundScreenDrawer, color, language, statusUpload, PostDispatchs, posts, MAP_STYLE, colorSet } = props;
    const styles = styleScaled(color);
    const refViewShot: any = useRef();
    const storage = new MMKV();
    const [switchIc, setSwitchIc] = useState<string>('toggle-off');
    useEffect(() =>
    {
        storage.set('switchIc', 'toggle-off');
        storage.getString('idAnswer');
    }, []);
    useEffect(() =>
    {
        console.log(storage.getString('idAnswer'), '>>');
    }, [storage.getString('idAnswer')]);

    useFocusEffect(
        React.useCallback(() =>
        {
            setTimeout(() =>
            {
                refViewShot.current.capture().then((image: any) =>
                {
                    setBackgroundScreenDrawer(image);
                });
            }, 1000);
        }, []),
    );

    useFocusEffect(
        React.useCallback(() =>
        {
            BackHandler.addEventListener('hardwareBackPress', () => true);
            return () => BackHandler.removeEventListener('hardwareBackPress', () => true);
        }, []),
    );
    const [calling, setCalling] = useState(false);
    const onCall = () =>
    {
        setCalling(true);
    };
    const onHangup = () =>
    {
        setCalling(false);
    };
    const updateStatus = () =>
    {
        const dataAddFireStore = {
            id: firebase.auth().currentUser?.uid,
        };
        firestore().collection('OnlineList').doc(firebase.auth().currentUser?.uid).set(dataAddFireStore);
    };
    useEffect(() =>
    {
        AppState.addEventListener('change', (status) =>
        {
            status === 'background'
                ? firestore()
                    .collection('OnlineList')
                    .doc(firebase.auth().currentUser?.uid ?? '')
                    .delete()
                : updateStatus();
        });
        updateStatus();
    }, []);

    return (
        <ViewShot
            ref={refViewShot}
            style={styles.container}
            options={{ result: 'base64', quality: 0.5 }}
        >
            <StatusBar
                backgroundColor="transparent"
                barStyle={colorSet === LIGHT ? 'dark-content' : 'light-content'}
                translucent
            />
            {calling === false && (
                <Header
                    iconLeftType={'MaterialIcons'}
                    iconLeft={'notes'}
                    title={language.Speaker}
                    iconSize={35}
                    shadow={false}
                    iconRightType="FontAwesome"
                    iconRight={switchIc}
                    headerRight
                    onPressLeft={() => navigation.openDrawer()}
                    onPressRight={() =>
                    {
                        if (storage.getString('switchIc') === 'toggle-on')
                        {
                            storage.set('switchIc', 'toggle-off');
                            setSwitchIc('toggle-off');
                        }
                        else
                        {
                            storage.set('switchIc', 'toggle-on');
                            setSwitchIc('toggle-on');
                        }
                    }}
                />
            )}

            <VideoCall
                isCallToIndex={false}
                navigation={navigation}
                onCall={() => onCall()}
                // readyGetRanCall={switchIc === 'toggle-on' ? true : false}
                onHangup={() => onHangup()}
            />
            {/* </View> */}
            {/* {calling === false && (
                <OnlineList
                    color={color}
                    language={language}
                    navigation={navigation}
                    userInfor={userInfor}
                    onCallPerson={() => console.log('hello from me ade leeee')}
                />
            )} */}
        </ViewShot>
    );
};

function mapStateToProps(state: any)
{
    return {
        userInfor: state.user.userInfor,
        color: state.controlApp.settings.color.HOME,
        colorSet: state.controlApp.settings.color,
        MAP_STYLE: state.controlApp.settings.color.MAP_STYLE,
        language: state.controlApp.settings.language,
        statusUpload: state.post.statusUpload,
        posts: state.post.posts,
    };
}

function mapDispatchToProps(dispatch: any)
{
    return {
        setBackgroundScreenDrawer: bindActionCreators(ControllAppActions.setBackgroundScreenDrawer, dispatch),
        PostDispatchs: bindActionCreators(PostActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
