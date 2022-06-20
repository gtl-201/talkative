/* eslint-disable multiline-ternary */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, View } from 'react-native';

import { MessageService } from '../../../Store/Services/message-service';
import Button from '../../../Components/BaseComponents/Button';
import Icon from '../../../Components/BaseComponents/Icon';
import { moderateScale } from 'react-native-size-matters';
import NewGroup from '../../../Components/Message/NewGroup';
import Member from '../../../Components/Message/Member';

interface Props {
    navigation: any;
    color: any;
    // userInfor: any;
    isShowHeader: (val: boolean) => void;
}

const PersonalList: FunctionComponent<Props> = (props: Props) =>
{
    const { navigation, color } = props;

    const [list, setList] = useState([]);
    // const [usersId, setUsersId] = useState([]);
    // const [userInfor, setUserInfor] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [mode, setMode] = useState('list');

    React.useEffect(() =>
    {
        const unsubscribe = navigation.addListener('focus', () =>
        {
            getAll();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    useEffect(() =>
    {
        getAll();
    }, []);

    const getAll = async () =>
    {
        // const { userInfor } = props;

        await MessageService.getUserConversation('group').then(async (e) =>
        {
            console.log('eeeeeee', e);

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
                const rs = results.filter((result) => result?.isGroup);
                // setState({ list: rs.length > 0 ? rs : e }, forceUpdate);
                setList(rs.length > 0 ? rs : e);
            });
        });
        // render();
    };

    const onRefresh = async () =>
    {
        console.error('refresh ne');

        setRefreshing(true);
        await getAll();

        setTimeout(() =>
        {
            setRefreshing(false);
        }, 200);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {mode === 'list' ? (
                <ScrollView
                    style={{
                        flex: 1,
                        width: Dimensions.get('screen').width,
                        height: Dimensions.get('screen').height,
                    }}
                    refreshControl={(
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh.bind(this)}
                        />
                    )}
                    contentContainerStyle={{
                        paddingHorizontal: 13,
                        paddingVertical: 16,
                    }}
                >
                    {list.length > 0 &&
                        list.map((data: any, index) =>
                        {
                            return (
                                <Member
                                    key={index}
                                    data={data}
                                    id={data.id}
                                    navigation={navigation}
                                    color={color}
                                    type={'group'}
                                />
                            );
                        })}
                </ScrollView>
            ) : (
                <NewGroup
                    navigation={navigation}
                    color={color}
                    goBack={() =>
                    {
                        setMode('list');
                        props.isShowHeader(true);
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
                    if (mode === 'list')
                    {
                        // setState({ mode: 'add' });
                        setMode('add');
                        props.isShowHeader(false);
                    }
                    else
                    {
                        // setState({ mode: 'list' });
                        setMode('list');
                        props.isShowHeader(true);
                    }
                }}
            >
                <Icon
                    type="MaterialIcons"
                    name={mode === 'add' ? 'clear' : 'add'}
                    size={moderateScale(28, 0.3)}
                    color={color.TXT_TITLE}
                />
            </Button>
        </View>
    );
};

export default PersonalList;
