import React, { Component, memo } from 'react';
import { Dimensions, RefreshControl, ScrollView, View } from 'react-native';

import { MessageService } from '../../../Store/Services/message-service';
import Member from '../../../Components/Message/Member';
import NewMessage from '../../../Components/Message/NewMessage';
import Button from '../../../Components/BaseComponents/Button';
import Icon from '../../../Components/BaseComponents/Icon';
import { moderateScale } from 'react-native-size-matters';

interface Props {
    navigation: any;
    color: any;
    language: any;
    userInfor: any;
    isShowHeader: (val: boolean) => void;
}

interface State {
    list: any;
    usersId: string[];
    userInfors: any;
    reFreshing: boolean;
    mode: string | 'add' | 'list';
}
class PersonalList extends Component<Props, State>
{
    state = {
        list: [],
        usersId: [],
        userInfors: [],
        reFreshing: false,
        mode: 'list',
    };

    async componentDidMount()
    {
        await this.getAll();
    }

    componentDidCatch()
    {
        // console.log('catch');
    }

    componentDidUpdate()
    {
        // console.log('update');
    }

    getAll = async () =>
    {
        const { userInfor } = this.props;

        await MessageService.getUserConversation('user').then(async (e) =>
        {
            const promises = e.map((item: any) =>
            {
                return new Promise((res) =>
                {
                    MessageService.getNewestMessage(item.id).then((message) =>
                    {
                        return res({
                            ...item,
                            message: message.text,
                            messageState: message?.notifiState,
                        });
                    });
                });
            });

            // Now with the list of promises we have to use the Promise api
            // to wait for them all to finish.
            Promise.all(promises).then((results) =>
            {
                // do stuff with results
                console.log(results);
                this.setState({ list: results });
            });

            const data = e.map((con: any) =>
            {
                const tmp = con.users.filter((id: string) => id !== userInfor.id);
                return tmp[0];
            });
            this.setState({ usersId: data });
            await MessageService.getTargetUsers(data).then((users) =>
            {
                this.setState({ userInfors: users });
            });
        });
    };

    onRefresh = async () =>
    {
        this.setState({ reFreshing: true });
        await this.getAll();
        setTimeout(() =>
        {
            this.setState({ reFreshing: false });
        }, 200);
    };

    render(): React.ReactNode
    {
        const { navigation, color } = this.props;
        return (
            <View style={{ flex: 1 }}>
                {this.state.mode === 'list'
                    ? (
                            <ScrollView
                                style={{
                                    flex: 1,
                                    width: Dimensions.get('screen').width,
                                    height: Dimensions.get('screen').height,
                                }}
                                refreshControl={(
                                    <RefreshControl
                                        refreshing={this.state.reFreshing}
                                        onRefresh={this.onRefresh.bind(this)}
                                    />
                                )}
                                contentContainerStyle={{
                                    paddingHorizontal: 13,
                                    paddingVertical: 16,
                                }}
                            >
                                {this.state.userInfors.length > 0 &&
                            this.state.usersId.length > 0 &&
                            this.state.usersId.map((userId, index) =>
                            {
                                const userInfors: any = this.state.userInfors.find((e: any) => e.id === userId);
                                return (
                                    <Member
                                        key={index}
                                        data={userInfors}
                                        id={this.state.list[index]}
                                        navigation={navigation}
                                        color={color}
                                    />
                                );
                            })}
                            </ScrollView>
                        )
                    : (
                            <NewMessage
                                navigation={navigation}
                                color={color}
                                goBack={() =>
                                {
                                    this.setState({ mode: 'list' });
                                    this.props.isShowHeader(true);
                                }}
                            />
                        )}
                <Button
                    type={'round'}
                    style={{
                        position: 'absolute',
                        right: 20,
                        bottom: 100,
                    }}
                    onPress={() =>
                    {
                        if (this.state.mode === 'list')
                        {
                            this.setState({ mode: 'add' });
                            this.props.isShowHeader(false);
                        }
                        else
                        {
                            this.setState({ mode: 'list' });
                            this.props.isShowHeader(true);
                        }
                    }}
                >
                    <Icon
                        type="MaterialIcons"
                        name={this.state.mode === 'add' ? 'clear' : 'add'}
                        size={moderateScale(28, 0.3)}
                        color={color.TXT_TITLE}
                    />
                </Button>
            </View>
        );
    }
}

export default memo(PersonalList);
