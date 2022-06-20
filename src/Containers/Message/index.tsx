/* eslint-disable react/jsx-closing-bracket-location */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import { bindActionCreators } from 'redux';

import Header from '../../Components/BaseComponents/Header';
import * as ControlAppActions from '../../Store/Actions/control-app-actions';
import styleScaled from './style';
import Group from './components/Group';
import Personal from './components/Personal';
import { Text } from 'react-native';
import BottomTabs from '../../Components/BaseComponents/BottomTabs/Tabs';

interface State {
    list: any;
    usersId: string[];
    userInfors: any;
    reFreshing: boolean;
    isShowHeader: boolean[];
    activeTitle: string;
    key: number;
}
class MessageList extends Component<any, State>
{
    state = {
        list: [],
        usersId: [],
        userInfors: [],
        reFreshing: false,
        isShowHeader: [true, true],
        activeTitle: '',
        key: 0,
    };

    componentDidMount()
    {
        this.setState({ activeTitle: this.props.language.MESSAGE });
    }

    render(): React.ReactNode
    {
        const { navigation, color, language, colorBottom, userInfor } = this.props;
        const styles = styleScaled(color);
        return (
            <ViewShot
                style={styles.container as any}
                options={{ result: 'base64', quality: 0.5 }}>
                {this.state.isShowHeader[this.state.key] && (
                    <Header
                        iconLeftType={'MaterialIcons'}
                        iconLeft={'notes'}
                        title={this.state.activeTitle}
                        onPressLeft={() => navigation.openDrawer()} />
                )}
                <BottomTabs
                    color={colorBottom}
                    data={[
                        {
                            key: 0,
                            handleClick: (data: any) => this.setState({ activeTitle: language.MESSAGE, key: data.key }),

                            icon: 'message',

                            iconType: 'MaterialIcons',

                            component: (
                                <Personal
                                    navigation={navigation}
                                    userInfor={userInfor}
                                    color={color}
                                    language={language}
                                    isShowHeader={(val) => this.setState({ isShowHeader: [val, this.state.isShowHeader[1]] }, this.forceUpdate)}
                                />
                            ),
                            title: language.MESSAGE,
                        },
                        {
                            key: 1,
                            handleClick: (data: any) => this.setState({ activeTitle: language.GROUP, key: data.key }),

                            icon: 'group',

                            iconType: 'MaterialIcons',

                            component: (
                                <Group
                                    userInfor={userInfor}
                                    navigation={navigation}
                                    isShowHeader={(val) => this.setState({ isShowHeader: [this.state.isShowHeader[0], val] }, this.forceUpdate)}
                                    color={color}
                                    language={language}
                                />
                            ),
                            title: language.GROUP,
                        },
                    ]}
                />
            </ViewShot>
        );
    }
}

function mapStateToProps(state: any)
{
    return {
        userInfor: state.user.userInfor,
        color: state.controlApp.settings.color.MESSAGE,
        colorBottom: state.controlApp.settings.color.BOTTOM_TABS,
        language: state.controlApp.settings.language,
    };
}

function mapDispatchToProps(dispatch: any)
{
    return {
        setBackgroundScreenDrawer: bindActionCreators(ControlAppActions.setBackgroundScreenDrawer, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
