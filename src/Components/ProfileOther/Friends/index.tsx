import { firebase } from '@react-native-firebase/auth';
import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { acceptRequestFriends, cancelFriends, cancelRequestFriends, getAllUsers, getUsersById, removeRequestFriends, sendRequestFriends } from '../../../Store/Services/user-services';
import styleScaled from './style';

interface Props {
  color: any;
  language: object;
  userId: any;
  userName: any;
}

const Friends: FC<Props> = (props) =>
{
    const { color, language, userId,userName } = props;
    const styles = styleScaled(color);
    const [dataListFriends, setDataListFriends] = useState<any>([]);
    const [dataCall, setDataCall] = useState<any>([]);
    const [dataSent, setDataSent] = useState<any>([]);
    const [ListFriends, setListFriends] = useState<any>();
    const [Call, setCall] = useState<any>();
    const [Sent, setSent] = useState<any>();
    const [data, setData] = useState<any>([]);

    async function getAllData()
    {
        const dataUsers = await getAllUsers();
        const dataUser: any = await getUsersById(
            `${firebase.auth().currentUser?.uid}`,
        );
        const request = dataUser.request[0] === '' && dataUser.request.length === 1
            ? []
            : dataUser.request;
        setDataCall(request);
        setCall(request.find((x) => x.id === userId));

        const friends = dataUser.friends[0] === '' && dataUser.friends.length === 1
            ? []
            : dataUser.friends;
        setDataListFriends(friends);
        setListFriends(friends.find((x) => x.id === userId));

        const requestSent = dataUser.requestSent[0] === '' && dataUser.requestSent.length === 1
            ? []
            : dataUser.requestSent;
        setDataSent(requestSent);
        setSent(requestSent.find((x) => x === userId));
        const userList = [
            ...dataUsers.filter(
                (item) =>
                    item.id !== firebase.auth().currentUser?.uid &&
          !dataUser.friends.find((x) => x.id === item.id) &&
          !dataUser.request.find((x) => x.id === item.id),
            ),
        ];
        setData(userList);
    }
    useEffect(() =>
    {
        getAllData();
    }, []);
    const handleAcceptRequest = async () =>
    {
        const rs = await getUsersById(userId);
        const arrayRequestSent = rs?.requestSent.filter(
      (x: any) => x !== firebase.auth().currentUser?.uid
    );
        const arrayRequest = dataCall.filter((x: any) => x.id !== userId);
        const res = await acceptRequestFriends(
            userId,
            userName,
            arrayRequest,
            arrayRequestSent,
        );
        if (res)
        {
            getAllData();
        }
    };
    const handleRemoveRequest = async () =>
    {
        const rs = await getUsersById(userId);
        const arrayRequestSent = dataCall.filter((x: any) => x.id !== userId);
        const arrayRequest = rs?.requestSent.filter(
      (x: any) => x !== firebase.auth().currentUser?.uid
    );
        const res = await removeRequestFriends(
            userId,
            arrayRequest,
            arrayRequestSent,
        );
        if (res)
        {
            getAllData();
        }
    };
    const handleCancelFriends = async () =>
    {
        const rs = await getUsersById(userId);
        const yourFriends = rs?.friends.filter(
      (x: any) => x.id !== firebase.auth().currentUser?.uid
    );
        const myFriends = dataListFriends.filter((x: any) => x.id !== userId);
        const res = await cancelFriends(userId, myFriends, yourFriends);
        if (res)
        {
            getAllData();
        }
    };
    const handleSendRequest = async () =>
    {
        const sendRequest = dataSent.concat(userId);
        const request = dataCall.concat([{ id: firebase.auth().currentUser?.uid, name: firebase.auth().currentUser?.displayName }]);
        const res = await sendRequestFriends(userId,sendRequest,request);
        if (res)
        {
            getAllData();
        }
    };
    const handleCancelRequest = async () =>
    {
        
        const rs = await getUsersById(userId);
        const arrayRequestSent = dataSent.filter((x: any) => x !== userId);
        const arrayRequest = rs?.request.filter(
        (x: any) => x.id !== firebase.auth().currentUser?.uid
      );
        const res = await cancelRequestFriends(
            userId,
            arrayRequest,
            arrayRequestSent,
        );
        if (res)
        {
            getAllData();
        }
    };
    const handleAction = async () =>
    {
        ListFriends ? handleCancelFriends() : Sent ? handleCancelRequest() : handleSendRequest();
    };
    return (
        <View style={styles.container}>
            {!Call
                ? (
                        <>
                            {Sent && (
                                <Text style={{ color: color.TXT_COUNT, fontSize: 14,marginBottom: 5 }}>
                                    Bạn đã gửi một lời mời kết bạn
                                </Text>
                            )}
                            <TouchableOpacity
                                style={ListFriends || Sent ? styles.containerCount2 : styles.containerCount}
                                onPress={()=>handleAction()}
                            >
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                    {ListFriends ? 'Hủy kết bạn' : Sent ? 'Hủy lời mời' : 'Thêm bạn bè'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )
                : (
                        <>
                            <Text style={{ color: color.TXT_COUNT, fontSize: 14,marginBottom: 5 }}>
                                    Đã gửi một lời mời kết bạn
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={styles.containerCount3}
                                    onPress={()=>handleAcceptRequest()}
                                >
                                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                                    Chấp nhận
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.containerCount4}
                                    onPress={()=>handleRemoveRequest()}
                                >
                                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                                    Xóa
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
            }
        </View>
    );
};
export default memo(Friends);
