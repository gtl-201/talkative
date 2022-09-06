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
import Rank from '../../Components/Rank/rank';
// import Rank from '../../Components/Dashboard/dashboard';
import Header from '../../Components/BaseComponents/Header';

interface ProfileProps {
  navigation: DrawerNavigationProp<any, any>;
  userInfor: UserInfor;
  setBackgroundScreenDrawer: (image: string) => void;
  color: object;
  language: object;
}

const RankContainer: FC<any> = ({
    navigation,
    userInfor,
    setBackgroundScreenDrawer,
    color,
    language,
}: ProfileProps) =>
{
    const styles = styleScaled(color);
    const refViewShot = useRef();

    return (
        <ViewShot
            ref={refViewShot}
            style={styles.container}
            options={{ result: 'base64', quality: 0.5 }}
        >
            <Header
                iconLeftType={'MaterialIcons'}
                iconLeft={'notes'}
                title={language.RANK}
                iconSize={35}
                shadow={false}
                iconRightType="FontAwesome"
                onPressLeft={() => navigation.openDrawer()}
            />
            <Rank
                color={color}
                language={language}
            />
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
        setBackgroundScreenDrawer: bindActionCreators(
            ControllAppActions.setBackgroundScreenDrawer,
            dispatch,
        ),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RankContainer);
