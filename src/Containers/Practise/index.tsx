import React, { FC, useRef } from 'react';
import { bindActionCreators } from 'redux';
import * as Auths from '../../Store/Actions/auth-actions';
import { connect } from 'react-redux';
import { UserInfor } from '../../Models';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import ViewShot from 'react-native-view-shot';
import * as ControllAppActions from '../../Store/Actions/control-app-actions';
import styleScaled from './style';
import TTSComponent from '../../Components/Practise/Tts';
import Header from '../../Components/BaseComponents/Header';

interface practiseProp {
    navigation: DrawerNavigationProp<any, any>;
    userInfor: UserInfor;
    setBackgroundScreenDrawer: (image: string) => void;
    color: object;
    language: object;
}

const Practises: FC<any> = ({ navigation, userInfor, setBackgroundScreenDrawer, color, language }: practiseProp) =>
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
                title={language.PRACTISE}
                iconSize={35}
                shadow={false}
                iconRightType="FontAwesome"
                onPressLeft={() => navigation.openDrawer()}
                
            />
            <TTSComponent
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
        setBackgroundScreenDrawer: bindActionCreators(ControllAppActions.setBackgroundScreenDrawer, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Practises);
