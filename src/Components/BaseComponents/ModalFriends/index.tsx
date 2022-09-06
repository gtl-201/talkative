/* eslint-disable react/display-name */
import React, {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import Modal from 'react-native-modal';
import styleScaled from './style';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from '../Icon';
import { connect } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import {
    acceptRequestFriends,
    cancelFriends,
    cancelRequestFriends,
    getAllUsers,
    getUsersById,
    removeRequestFriends,
    sendRequestFriends,
    updateFriend,
} from '../../../Store/Services/user-services';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

const ModalFriends = forwardRef(({ url, color, count,language }, ref) =>
{
    const styles = styleScaled(color);
    const [visible, setVisible] = useState(false);
    const [handle, setHandle] = useState('all');
    const [dataListFriends, setDataListFriends] = useState<any>([]);
    const [dataCall, setDataCall] = useState<any>([]);
    const [dataSent, setDataSent] = useState<any>([]);
    const [data, setData] = useState<any>([]);
    const [dataImage, setDataImage] = useState<any>([]);

    async function getAllData()
    {
        const dataAll = await getAllUsers();
        const dataUser: any = await getUsersById(
            `${firebase.auth().currentUser?.uid}`,
        );
        if (dataUser.request === undefined)
        {
            await updateFriend({ request: [] });
        }
        if (dataUser.friends === undefined)
        {
            await updateFriend({ friends: [] });
        }
        if (dataUser.requestSent === undefined)
        {
            await updateFriend({ requestSent: [] });
        }
        if (
            dataUser.request !== undefined &&
      dataUser.friends !== undefined &&
      dataUser.requestSent !== undefined
        )
        {
            setDataCall(
                dataUser.request[0] === '' && dataUser.request.length === 1
                    ? []
                    : dataUser.request,
            );
            setDataListFriends(
                dataUser.friends[0] === '' && dataUser.friends.length === 1
                    ? []
                    : dataUser.friends,
            );
            setDataSent(
                dataUser.requestSent[0] === '' && dataUser.requestSent.length === 1
                    ? []
                    : dataUser.requestSent,
            );

            const userList = [
                ...dataAll.filter(
                    (item) =>
                        item.id !== firebase.auth().currentUser?.uid &&
            !dataUser.friends.find((x) => x.id === item.id) &&
            !dataUser.request.find((x) => x.id === item.id),
                ),
            ];
            setData(userList);
        }
    }
    useEffect(() =>
    {
        getAllData();
    }, [count]);

    const handleSendRequest = async (id) =>
    {
        const sendRequest = dataSent.concat(id);
        const request = dataCall.concat([
            {
                id: firebase.auth().currentUser?.uid,
                name: firebase.auth().currentUser?.displayName,
            },
        ]);
        const res = await sendRequestFriends(id, sendRequest, request);
        if (res)
        {
            getAllData();
        }
    };
    const handleCancelRequest = async (id, type) =>
    {
        if (type === 'cancel')
        {
            const rs = await getUsersById(id);
            const arrayRequestSent = dataSent.filter((x: any) => x !== id);
            const arrayRequest = rs?.request.filter(
        (x: any) => x.id !== firebase.auth().currentUser?.uid
      );
            const res = await cancelRequestFriends(
                id,
                arrayRequest,
                arrayRequestSent,
            );
            if (res)
            {
                getAllData();
            }
        }
        else
        {
            const array = data.filter((x: any) => x.id !== id);
            setData(array);
        }
    };
    const handleAcceptRequest = async (item) =>
    {
        const rs = await getUsersById(item.id);
        const arrayRequestSent = rs?.requestSent.filter(
      (x: any) => x !== firebase.auth().currentUser?.uid
    );
        const arrayRequest = dataCall.filter((x: any) => x.id !== item.id);
        const res = await acceptRequestFriends(
            item.id,
            item.name,
            arrayRequest,
            arrayRequestSent,
        );
        if (res)
        {
            getAllData();
        }
    };
    const handleRemoveRequest = async (item) =>
    {
        const rs = await getUsersById(item.id);
        const arrayRequestSent = dataCall.filter((x: any) => x.id !== item.id);
        const arrayRequest = rs?.requestSent.filter(
      (x: any) => x !== firebase.auth().currentUser?.uid
    );
        const res = await removeRequestFriends(
            item.id,
            arrayRequest,
            arrayRequestSent,
        );
        if (res)
        {
            getAllData();
        }
    };
    const handleCancelFriends = async (item) =>
    {
        const rs = await getUsersById(item.id);
        const yourFriends = rs?.friends.filter(
      (x: any) => x.id !== firebase.auth().currentUser?.uid
    );
        const myFriends = dataListFriends.filter((x: any) => x.id !== item.id);
        const res = await cancelFriends(item.id, myFriends, yourFriends);
        if (res)
        {
            getAllData();
        }
    };
    useImperativeHandle(ref, () => ({
        show()
        {
            setVisible(true);
        },
        hide()
        {
            setVisible(false);
        },
    }));

    const close = useCallback(() => setVisible(false), []);
    const navigation = useNavigation();

    const openProfile = (userId, userName) =>
    {
        close();
        navigation.navigate('ProfileOther', { userId, userName });
    };

    const getImage = async () =>
    {
        const dataAll = await getAllUsers();
        dataAll.map((item, index) =>
            getUsersById(item.id).then((data) =>
                setDataImage((c) => c.concat({ image: data.avatar, id: data.id })),
            ),
        );
    };
    useEffect(() =>
    {
        getImage();
    }, []);

    const listFriends = () =>
    {
        return dataListFriends.map((item, index) => (
            <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => openProfile(item.id, item.name)}
            >
                <View style={styles.row}>
                    <View style={{ width: '25%' }}>
                        {dataImage.find((x) => x.id === item.id)?.image !== ''
                            ? (
                                    <FastImage
                                        style={{
                                            height: 70,
                                            width: 70,
                                            borderRadius: 99,
                                            borderWidth: 0.1,
                                            overflow: 'hidden',
                                        }}
                                        source={{
                                            uri: dataImage.find((x) => x.id === item.id)?.image,
                                        }}
                                    />
                                )
                            : (
                                    <View style={styles.avatar} />
                                )}
                    </View>
                    <View style={{ marginLeft: 10, width: '75%' }}>
                        <View style={{ height: '40%' }}>
                            <Text
                                numberOfLines={2}
                                style={{ fontSize: 15, fontWeight: 'bold' }}
                            >
                                {item.name}
                            </Text>
                        </View>
                        <View style={styles.viewBtn2}>
                            <TouchableOpacity
                                style={styles.btn5}
                                onPress={() => handleCancelFriends(item)}
                            >
                                <Text style={styles.textBtn3}>{language.UNFRIEND}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        ));
    };
    const callFriends = () =>
    {
        return dataCall.map((item, index) => (
            <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => openProfile(item.id, item.name)}
            >
                <View style={styles.row}>
                    <View style={{ width: '25%' }}>
                        {dataImage.find((x) => x.id === item.id)?.image !== ''
                            ? (
                                    <FastImage
                                        style={{
                                            height: 70,
                                            width: 70,
                                            borderRadius: 99,
                                            borderWidth: 0.1,
                                            overflow: 'hidden',
                                        }}
                                        source={{
                                            uri: dataImage.find((x) => x.id === item.id)?.image,
                                        }}
                                    />
                                )
                            : (
                                    <View style={styles.avatar} />
                                )}
                    </View>
                    <View style={{ marginLeft: 10, width: '75%' }}>
                        <View style={{ height: '40%' }}>
                            <Text
                                numberOfLines={2}
                                style={{ fontSize: 15, fontWeight: 'bold' }}
                            >
                                {item.name}
                            </Text>
                        </View>
                        <View style={styles.viewBtn2}>
                            <TouchableOpacity
                                style={styles.btn4}
                                onPress={() => handleAcceptRequest(item)}
                            >
                                <Text style={styles.textBtn2}>{language.ACCEPT}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btn3}
                                onPress={() => handleRemoveRequest(item)}
                            >
                                <Text style={styles.textBtn3}>{language.DELETE2}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        ));
    };
    const addFriends = () =>
    {
        return data.map((item, index) => (
            <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => openProfile(item.id, item.name)}
            >
                <View style={styles.row}>
                    <View style={{ width: '25%' }}>
                        {item?.avatar
                            ? (
                                    <FastImage
                                        style={{
                                            height: 70,
                                            width: 70,
                                            borderRadius: 99,
                                            borderWidth: 0.1,
                                            overflow: 'hidden',
                                        }}
                                        source={{
                                            uri: item?.avatar,
                                        }}
                                    />
                                )
                            : (
                                    <View style={styles.avatar} />
                                )}
                    </View>
                    <View style={{ marginLeft: 10, width: '75%' }}>
                        <View style={{ height: '40%' }}>
                            <Text
                                numberOfLines={2}
                                style={{ fontSize: 15, fontWeight: 'bold' }}
                            >
                                {item.name}
                            </Text>
                        </View>
                        <View style={styles.viewBtn2}>
                            <TouchableOpacity
                                style={styles.btn4}
                                disabled={dataSent.find((x) => x === item.id) ? true : false}
                                onPress={() => handleSendRequest(item.id)}
                            >
                                <Text style={styles.textBtn2}>
                                    {dataSent.find((x) => x === item.id) ? language.SENT : language.ADDFRIEND}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btn3}
                                onPress={() =>
                                    handleCancelRequest(
                                        item.id,
                                        dataSent.find((x) => x === item.id) ? 'cancel' : 'remove',
                                    )
                                }
                            >
                                <Text style={styles.textBtn3}>
                                    {dataSent.find((x) => x === item.id) ? language.CANCEL2 : language.REMOVE}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        ));
    };
    return (
        <Modal
            isVisible={visible}
            animationIn={'fadeInUp'}
            animationInTiming={400}
            animationOutTiming={400}
            animationOut={'fadeOutDown'}
            backdropTransitionInTiming={400}
            backdropTransitionOutTiming={400}
            backdropColor={'black'}
            backdropOpacity={1}
            hasBackdrop={false}
            // swipeDirection={'down'}
            style={styles.modal}
            hideModalContentWhileAnimating
            useNativeDriver
            statusBarTranslucent
            // onSwipeComplete={() => setVisible(false)}
        >
            <View style={styles.containerModal}>
                <View style={styles.modalContent}>
                    <View>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search..."
                        />
                    </View>
                    <View style={styles.viewBtn}>
                        <TouchableOpacity
                            style={handle === 'all' ? styles.btn2 : styles.btn}
                            onPress={() => setHandle('all')}
                        >
                            <Text style={handle === 'all' ? styles.textBtn2 : styles.textBtn}>
                {language.ALL}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 10 }} />
                        <TouchableOpacity
                            style={handle === 'call' ? styles.btn2 : styles.btn}
                            onPress={() => setHandle('call')}
                        >
                            <Text
                                style={handle === 'call' ? styles.textBtn2 : styles.textBtn}
                            >
                {language.INVITATION}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 10 }} />
                        <TouchableOpacity
                            style={handle === 'add' ? styles.btn2 : styles.btn}
                            onPress={() => setHandle('add')}
                        >
                            <Text style={handle === 'add' ? styles.textBtn2 : styles.textBtn}>
                            {language.ADDFRIEND}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.hr} />
                    <View style={styles.viewScroll}>
                        <ScrollView>
                            {handle === 'all'
                                ? listFriends()
                                : handle === 'call'
                                    ? callFriends()
                                    : addFriends()}
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.btnClose}
                    onPress={close}
                >
                    <Icon
                        name="close"
                        style={styles.icClose}
                        type={'FontAwesome'}
                    />
                </TouchableOpacity>
            </View>
        </Modal>
    );
});

function mapStateToProps(state: any)
{
    return {
        color: state.controlApp.settings.color.MODAL_IMAGE,
    };
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(
    ModalFriends,
);
