import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView } from 'react-native';
import CountAction from '../../Components/Profile/CountAction';
import ListCall from '../../Components/Profile/HistoryCall';
import Infor from '../../Components/Profile/Infor';
// import ListNewsPost from '../../Components/Profile/ListNewsPost';
import { bindActionCreators } from 'redux';
import * as Auths from '../../Store/Actions/auth-actions';
import { connect } from 'react-redux';
import { UserInfor } from '../../Models';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import ViewShot from 'react-native-view-shot';
import * as ControllAppActions from '../../Store/Actions/control-app-actions';
import { useFocusEffect } from '@react-navigation/native';
import styleScaled from './style';
import { UserServices } from '../../Store/Services/user-services';

interface ProfileProps {
    navigation: DrawerNavigationProp<any, any>;
    userInfor: UserInfor;
    setBackgroundScreenDrawer: (image: string) => void;
    color: object;
    language: object;
}

const Profile: FC<any> = ({ navigation, userInfor, setBackgroundScreenDrawer, color, language }: ProfileProps) =>
{
    const styles = styleScaled(color);
    const refViewShot = useRef();

    // const viewPostMap = useCallback(() =>
    // {
    //     navigation.navigate('UserMap', {
    //         posts: userInfor?.posts,
    //         nickname: userInfor?.nickname,
    //         own: true,
    //     });
    // }, [userInfor]);

    useFocusEffect(
        React.useCallback(() =>
        {
            setTimeout(() =>
            {
                refViewShot.current.capture().then((image) =>
                {
                    setBackgroundScreenDrawer(image);
                });
            }, 1000);
        }, []),
    );

    const [caller, setCaller] = useState<any>(0);
    const [callee, setCallee] = useState<any>(0);

    const setCallerCallee = async () =>
    {
        setCaller(await UserServices.getUserMeetingCaller('get'));
        setCallee(await UserServices.getUserMeetingCallee('get'));
    };
    useEffect(() =>
    {
        setCallerCallee();
    }, []);

    useFocusEffect(
        React.useCallback(() =>
        {
            BackHandler.addEventListener('hardwareBackPress', () => true);
            return () => BackHandler.removeEventListener('hardwareBackPress', () => true);
        }, []),
    );

    return (
        <ViewShot
            ref={refViewShot}
            style={styles.container}
            options={{ result: 'base64', quality: 0.5 }}
        >
            <ScrollView>
                <Infor
                    navigation={navigation}
                    color={color}
                    userInfor={userInfor}
                    language={language}
                />

                {/* view count */}
                <CountAction
                    color={color}
                    totalCall={caller.length + callee.length}
                    makeCall={caller.length}
                    getCall={callee.length}
                    language={language}
                />

                <ListCall
                    color={color}
                    language={language}
                    makeCall={caller}
                    getCall={callee}
                />

                {/* <ListNewsPost
                viewPostMap={viewPostMap}
                color={color}
                navigation={navigation}
                posts={userInfor ? userInfor.posts : []}
                language={language}
            /> */}
            </ScrollView>
        </ViewShot>
    );
};

function mapStateToProps(state: any)
{
    return {
        userInfor: state.user.userInfor,
        color: state.controlApp.settings.color.PROFILE,
        language: state.controlApp.settings.language,
    };
}

function mapDispatchToProps(dispatch: any)
{
    return {
        setUser: bindActionCreators(Auths.setUser, dispatch),
        setLoading: bindActionCreators(Auths.setLoading, dispatch),
        setBackgroundScreenDrawer: bindActionCreators(ControllAppActions.setBackgroundScreenDrawer, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
