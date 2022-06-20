import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
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
import EmptyView from '../../Components/BaseComponents/EmptyView';
import { firebase } from '@react-native-firebase/auth';

const NewMessage: FC<any> = (props) =>
{
    const { navigation, color, language, goBack } = props;
    const styles = styleScaled(color);
    const [userList, setUserList] = useState<any>([]);

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

    const filterUser = useCallback((value) =>
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

            setUserList(resultUsers);
        }
    }, []);

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
            {/* List user */}
            {userList.length > 0
                ? (
                        <ListResultUser
                            color={color}
                            data={userList}
                            navigation={navigation}
                        />
                    )
                : <EmptyView description={language.NO_RESULTS} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewMessage);
