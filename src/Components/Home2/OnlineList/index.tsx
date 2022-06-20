import React, { FC, memo, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import { IMAGE } from '../../../Utils/Values';
import { UserServices } from '../../../Store/Services/user-services';
import { firebase } from '@react-native-firebase/storage';
import EmptyView from '../../BaseComponents/EmptyView';
import { MMKV } from 'react-native-mmkv';
import firestore from '@react-native-firebase/firestore';

interface Props {
    color: any;
    language: any;
    navigation: any;
    userInfor: any;
    onCallPerson?: () => void;
}

const SearchBar: FC<Props> = (props) =>
{
    const { color, language, navigation, userInfor, onCallPerson } = props;
    const styles = styleScaled(color);
    const [UserList, setUserList] = useState<any>([]);
    const [refreshList, setRefreshList] = useState(true);
    const cRef = firestore().collection('OnlineList');
    useEffect(() =>
    {
        const getList = cRef.onSnapshot(async (snapShot: any) =>
        {
            getOnlineList();
            setRefreshList(false);
        });
        return () =>
        {
            getList();
        };
    }, []);

    const getOnlineList = async () =>
    {
        // setRefreshList(true);
        const listOnline: any = await UserServices.getUidUserOnline();
        const promises =
            listOnline &&
            listOnline.map((uidOnline: any) =>
            {
                return new Promise((res) =>
                {
                    UserServices.getUidUserLiteInfor(uidOnline.id).then((message) =>
                    {
                        return res(message);
                    });
                });
            });

        // Now with the list of promises we have to use the Promise api
        // to wait for them all to finish.
        Promise.all(promises).then((results) =>
        {
            setUserList(results);
        });
        // setRefreshList(false);
    };

    const stores = new MMKV();
    const RenderOnlineList = (item: any) =>
    {
        // console.log('itemmmmmmmmmmmmmmmmm', item);

        return (
            <>
                {item.item.id !== firebase.auth().currentUser?.uid && (
                    <View style={styles.itemContainer}>
                        <View style={styles.LeftContainer}>
                            <Image
                                style={styles.avatar}
                                source={item.item.thumbnail ? { uri: item.item.thumbnail } : IMAGE.EMPTY_AVATAR}
                                resizeMode={'cover'}
                            />
                            <View style={styles.contentContainer}>
                                <Text style={styles.name}>{item.item.name ?? '??/'}</Text>
                                <Text style={styles.info}>{item.item.nickname ?? ''}</Text>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={async () =>
                                {
                                    if (onCallPerson)
                                    {
                                        await stores.set('idAnswer', item.item.id);
                                        // console.log(item.item.id);

                                        onCallPerson();
                                    }
                                }}
                            >
                                <Text style={styles.txtBtn}>
                                    <Icon
                                        type={'MaterialIcons'}
                                        name={'call'}
                                        size={moderateScale(30, 0.5)}
                                        color={color.SEARCHBAR_IC_ADD}
                                    />
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() =>
                                {
                                    navigation.navigate('MessageView', {
                                        conversationObject: [firebase.auth().currentUser.uid, item.item.id],
                                        data: item.item,
                                    });
                                }}
                            >
                                <Text style={styles.txtBtn}>
                                    <Icon
                                        type={'MaterialIcons'}
                                        name={'chat'}
                                        size={moderateScale(30, 0.5)}
                                        color={color.LIST_TAG_TXT_ITEM}
                                    />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </>
        );
    };

    return (
        <View style={styles.bgColor}>
            <View style={styles.container}>
                <Text style={styles.title}>{language?.OnlineList}</Text>
                <FlatList
                    data={UserList || []}
                    renderItem={(item) => RenderOnlineList(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={(
                        <>{UserList.length === 0 && refreshList === false && (
                            <EmptyView
                                color={color}
                                description={language.NO_USER_ONLINE}
                            />
                        )}
                        </>
                    )}
                    refreshing={refreshList}
                    onRefresh={getOnlineList}
                />
            </View>
        </View>
    );
};

export default memo(SearchBar);
