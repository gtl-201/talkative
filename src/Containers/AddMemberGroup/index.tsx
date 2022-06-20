import { firebase } from '@react-native-firebase/firestore';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ListResultUser from '../../Components/Search/ListResultUser';
import ListSelected from '../../Components/Search/ListSelected';
import SearchBar from '../../Components/Search/SearchBar';
import * as ControlAppActions from '../../Store/Actions/control-app-actions';
import firestore from '@react-native-firebase/firestore';
import { removeAccents } from '../../Utils/Helpers';
import styleScaled from './style';
import { getAllUser, UserServices } from '../../Store/Services/user-services';
import { MessageService } from '../../Store/Services/message-service';

const AddGroupMember = (props: any) =>
{
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const {
        navigation,
        color,
        language,
        goBack,
        route: { params },
    } = props as any;

    const styles = styleScaled(color);
    const [userList, setUserList] = useState<any>([]);
    const [userSelected, setUserSelected] = useState<any>([
        // {
        //     gender: 'CUSTOM',
        //     id: 'XGx7kglSavQKyghgHf1Rh1uvruB2',
        //     name: 'Cửu Long Chân Nhân',
        //     nickname: 'chan_nhan',
        //     thumbnail:
        //         'https://firebasestorage.googleapis.com/v0/b/spearker-d3cc4.appspot.com/o/images%2Fthumbnails%2FXGx7kglSavQKyghgHf1Rh1uvruB2.jpg?alt=media&token=5ad2b306-a554-46e8-a5f5-12c7299eb359',
        // },
    ]);
    // console.log(userList);

    const refRootUserList = useRef<Array<any>>([]);
    const refViewShot: any = useRef();

    useEffect(() =>
    {
        const promises = params.data.users.map((item: any) =>
        {
            return new Promise((res) =>
            {
                UserServices.getUidUserLiteInfor(item).then((message) =>
                {
                    return res(message);
                });
            });
        });

        // Now with the list of promises we have to use the Promise api
        // to wait for them all to finish.
        Promise.all(promises).then((results) =>
        {
            // do stuff with results
            // setUserSelected(results);
            // console.log(results);
        });
    }, [params.data]);

    useEffect(() =>
    {
        async function getAllData()
        {
            const dataUser = await getAllUser();
            refRootUserList.current = [...dataUser.filter((item) => firebase.auth().currentUser?.uid !== item.id)];
        }

        getAllData();
    }, []);

    const filterUser = (value: string) =>
    {
        if (value === '')
        {
            setUserList([]);
        }
        else
        {
            let resultUsers = [];
            resultUsers = [...refRootUserList.current.filter((item: any) => item.name !== undefined && item.name.toLowerCase().includes(value))];

            value = removeAccents(value);
            resultUsers = [...refRootUserList.current.filter((item: any) => item.nickname !== undefined && item.nickname.includes(value)), ...resultUsers];

            resultUsers = resultUsers.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
            const selected = getUserId();

            const rs = resultUsers.filter((item) => ![...selected].includes(item.id));
            setUserList(rs);
        }
    };

    const handleDeselected = (id: string) =>
    {
        const re = userSelected.filter((item: any) => item.id !== id);
        setUserSelected(re);
        forceUpdate();
    };

    const handleSelect = (item: any) =>
    {
        const re = userSelected;
        re.push(item);
        const u = userList.filter((i: any) => i !== item);
        setUserList(u);
        setUserSelected(re);
        forceUpdate();
    };

    const getUserId = () => [...[...userSelected].map((item: any) => item.id), ...params.data.users] ?? [];

    const handleCreate = () =>
    {
        const users = [...userSelected.map((item: any) => item.id), ...params.data.users];

        firestore()
            .collection('Conversation')
            .doc(params.id)
            .update({ users })
            .then(() =>
            {
                MessageService.getConversation(params.id).then((conversation) =>
                {
                    navigation.navigate('MessageGroup', { data: conversation, conversation: params.id });
                });
            })
            .catch((err) => console.error(err));
    };

    return (
        <ViewShot
            ref={refViewShot}
            style={styles.container as any}
            options={{ result: 'base64', quality: 0.5 }}
        >
            <SearchBar
                language={language}
                filterUser={filterUser}
                color={color}
                navigation={navigation}
                onGoBack={goBack}
            />
            {userSelected.length > 0 && (
                <ListSelected
                    color={color}
                    data={userSelected}
                    mode="update"
                    language={language}
                    onDeselected={handleDeselected}
                    onCreate={handleCreate}
                />
            )}

            {/* List user */}
            {userList.length > 0 && (
                <ListResultUser
                    color={color}
                    data={userList}
                    navigation={navigation}
                    isCanSelect
                    onSelect={handleSelect}
                />
            )}
        </ViewShot>
    );
};

function mapStateToProps(state: any)
{
    return {
        userInfor: state.user.userInfor,
        color: state.controlApp.settings.color.SEARCH,
        language: state.controlApp.settings.language,
    };
}

function mapDispatchToProps(dispatch: any)
{
    return {
        setBackgroundScreenDrawer: bindActionCreators(ControlAppActions.setBackgroundScreenDrawer, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupMember);
