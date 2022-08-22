import React, { FC, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import { bindActionCreators } from 'redux';
import * as ControlAppActions from '../../../Store/Actions/control-app-actions';
import styleScaled from './style';
// Component
// import Header from '../../../Components/BaseComponents/Header';
import PassLock from '../../../Components/HowLearn/PassLock/index';

const PassLockC: FC<any> = (props) =>
{
    const { navigation, setBackgroundScreenDrawer, color, language, route } = props;
    const styles = styleScaled(color);
    const refViewShot: any = useRef();
    console.log(route.params);

    return (
        <ViewShot
            ref={refViewShot}
            style={[styles.container, { flex: 1 }]}
            options={{ result: 'base64', quality: 0.5 }}
        >
            {/* <Header title={language.QUEST} /> */}
            <PassLock
                color={color}
                language={language}
                navigation={navigation}
                gate={route.params.gate}
                round={route.params.round}
                level={route.params.level}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(PassLockC);
