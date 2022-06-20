import React, { FC, useEffect, useReducer, useRef, useState } from 'react';
import SearchBar from '../../Components/Search/SearchBar';
import styleScaled from './style';
import { connect } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import { bindActionCreators } from 'redux';
import * as ControlAppActions from '../../Store/Actions/control-app-actions';
import * as PostAppActions from '../../Store/Actions/post-actions';
import { getAllUser } from '../../Store/Services/user-services';
import ListResultUser from '../../Components/Search/ListResultUser';
import { removeAccents } from '../../Utils/Helpers';
import { firebase } from '@react-native-firebase/auth';
import ListSelected from '../Search/ListSelected';
import { MessageService } from '../../Store/Services/message-service';

const NewGroup: FC<any> = (props) =>
{
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const { navigation, color, language, goBack } = props;
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

    const refRootUserList = useRef<Array<any>>([]);
    const refViewShot: any = useRef();

    useEffect(() =>
    {
        async function getAllData()
        {
            const dataUser = await getAllUser();
            refRootUserList.current = [...dataUser.filter((item) => item.id !== firebase.auth().currentUser?.uid)];
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
            resultUsers = [...refRootUserList.current.filter((item) => item.name !== undefined && item.name.toLowerCase().includes(value))];

            value = removeAccents(value);
            resultUsers = [...refRootUserList.current.filter((item) => item.nickname !== undefined && item.nickname.includes(value)), ...resultUsers];

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

    const getUserId = () =>
    {
        return [...userSelected].map((item: any) => item.id) ?? [];
    };

    const handleCreate = () =>
    {
        const users = userSelected.map((item: any) => item.id);
        users.push(firebase.auth().currentUser?.uid);
        MessageService.setConversation({
            users,
            isGroup: true,
            title: 'Conversation test',
            permission: { owner: firebase.auth().currentUser?.uid, admin: [] },
        })
            .then((e) =>
            {
                navigation.navigate('MessageGroup', { conversation: e.data()?.id, data: e.data() });
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
        PostAppDispatchs: bindActionCreators(PostAppActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGroup);
