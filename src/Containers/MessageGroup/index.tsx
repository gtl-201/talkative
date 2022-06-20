/* eslint-disable react/no-did-update-set-state */
/* eslint-disable multiline-ternary */
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Dimensions, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import 'dayjs/locale/vi';

import Modal from 'react-native-modal';

import { connect } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import { bindActionCreators } from 'redux';
import styleScaled from './style';
import Header from '../../Components/BaseComponents/Header';
import * as ControlAppActions from '../../Store/Actions/control-app-actions';
import { GiftedChat, Send, Avatar } from 'react-native-gifted-chat';
import Icon from '../../Components/BaseComponents/Icon';
import { MessageService } from '../../Store/Services/message-service';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/storage';
import { SHADOW_2 } from '../../Utils/Values';
import Button from '../../Components/BaseComponents/Button';
import { ShowToast } from '../../Utils/Helpers';
import Toast from 'react-native-toast-message';
import { UserServices } from '../../Store/Services/user-services';
import AvatarFirstChar from '../../Components/BaseComponents/AvatarFirstChar';
import FastImage from 'react-native-fast-image';
import ModalConfirm from '../../Components/BaseComponents/ModalConfirm';

interface State {
    messages: any;
    conversationId: string;
    recipient: any;
    mode: string;
    isVisible: boolean;
    isVisibleList: boolean;
    nameTmp: string;
    listUser: any[];
    data: any;
}
class MessageGroup extends Component<any, State>
{
    refModalConfirm = React.createRef();
    refModalConfirmLeave = React.createRef();
    state = {
        messages: [],
        conversationId: '',
        recipient: [],
        mode: 'read',
        isVisible: false,
        isVisibleList: false,
        nameTmp: '',
        data: {} as any,
        listUser: [] as any[],
    };
    // Tts.speak(txt);
    // https://github.com/ak1394/react-native-tts

    async componentDidMount()
    {
        const { conversation } = this.props.route.params;

        const { data } = this.props.route.params;

        this.setState({ data });
        if (conversation)
        {
            MessageService.getConversation(conversation).then((response) =>
            {
                const uidRecipient = response.users.filter((user: string) => user !== firebase.auth().currentUser?.uid);
                this.setState({ recipient: uidRecipient });
            });
            this.setState({ conversationId: conversation });
            setTimeout(() =>
            {
                this.getAll();
                this.initSession();
                this.getAllUsers();
            }, 300);
        }
    }

    getAllUsers()
    {
        MessageService.getConversation(this.state.conversationId).then((response) =>
        {
            const promises = response.users.map((user: any) =>
            {
                return new Promise((res) =>
                {
                    UserServices.getUidUserLiteInfor(user ?? '').then((ress) =>
                    {
                        return res(ress);
                    });
                });
            });

            Promise.all(promises).then((value) =>
            {
                this.setState({ listUser: value }, this.forceUpdate);
            });
        });
    }

    initSession()
    {
        const { conversationId } = this.state;
        const doc = firestore().collection('Messages').where('conversation', '==', conversationId);
        const un = doc.onSnapshot(
            (_docSnapshot) =>
            {
                this.getAll(); // ...
            },
            (err) =>
            {
                console.error(err);
            },
        );
        return un;
    }

    componentWillUnmount()
    {
        this.initSession();
    }

    componentDidUpdate(nextProps: any)
    {
        if (nextProps.route !== this.props.route)
        {
            this.setState({ mode: 'read', recipient: nextProps.route.params.data.users });
            this.getAllUsers();
        }
    }

    shouldComponentUpdate(next: any, state: any)
    {
        if (next !== this.props)
        {
            return true;
        }
        if (state !== this.state)
        {
            return true;
        }
        return false;
    }

    getAll()
    {
        const { conversationId } = this.state;
        MessageService.getMessages(conversationId).then((messages) => this.setState({ messages }));
    }

    onChangeName = () =>
    {
        const { language } = this.props;
        firestore()
            .collection('Conversation')
            .doc(this.state.conversationId)
            .update({ title: this.state.nameTmp })
            .then(() =>
            {
                MessageService.getConversation(this.state.conversationId).then((conversation) =>
                {
                    this.setState({ data: conversation, isVisible: false });
                    ShowToast('success', language.SUCCESS, language.UPDATE_SUCCESS, {
                        onPress: () =>
                        {
                            Toast.hide();
                        },
                        visibilityTime: 3000,
                    });
                });
            });
    };

    onRemoveMember = (id: string) =>
    {
        const { language } = this.props;

        const newList = [...this.state.recipient, firebase.auth().currentUser?.uid].filter((i: any) => i !== id);
        console.log(newList, 'llllllllll');

        firestore().collection('Conversation').doc(this.state.conversationId).update({ users: newList });
        MessageService.getConversation(this.state.conversationId).then((conversation) =>
        {
            const array = [...this.state.listUser];

            this.setState({ listUser: array.filter((item) => item.id !== id) });
            this.setState({ data: conversation, isVisible: false });
            ShowToast('success', language.SUCCESS, language.UPDATE_SUCCESS, {
                onPress: () =>
                {
                    Toast.hide();
                },
                visibilityTime: 3000,
            });
        });
    };

    onLeave = () =>
    {
        this.refModalConfirmLeave.current.show();
    };

    onRemove = () =>
    {
        this.refModalConfirm.current.show();
    };

    render(): React.ReactNode
    {
        const { navigation, color, userInfor, language } = this.props;
        const { conversationId, recipient, data } = this.state;

        const styles = styleScaled(color) as any;

        return (
            <ViewShot
                style={styles.container}
                options={{ result: 'base64', quality: 0.5 }}
            >
                <Header
                    iconLeftType={'MaterialIcons'}
                    iconLeft={'arrow-back'}
                    title={data?.title ?? ''}
                    iconRightType={'MaterialIcons'}
                    iconRight={this.state.mode === 'read' ? 'menu' : 'clear'}
                    titleAlignment={'center'}
                    onPressRight={() =>
                    {
                        if (this.state.mode === 'read')
                        {
                            this.setState({ mode: 'settings' });
                        }
                        else
                        {
                            this.setState({ mode: 'read' });
                        }
                    }}
                    onPressLeft={() => navigation.goBack()}
                />
                {this.state.mode === 'read' ? (
                    <View
                        style={{
                            flex: 1,
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').height,
                        }}
                        onTouchStart={() => Keyboard.dismiss()}
                    >
                        <GiftedChat
                            // renderChatEmpty={() => (
                            //     <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', transform: [{ rotateX: '180deg' }] }}>
                            //         <Text>Empty</Text>
                            //     </View>
                            // )}
                            locale="vi"
                            messages={this.state.messages}
                            placeholder="Nhập tin nhắn"
                            user={{
                                _id: userInfor.id,
                                name: userInfor.name,
                                avatar: userInfor.avatar,
                            }}
                            renderAvatar={(e) => (
                                <Avatar
                                    {...e}
                                    showAvatarForEveryMessage
                                />
                            )}
                            renderSend={(e) => (
                                <Send {...e}>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            height: '100%',
                                            marginRight: 10,
                                        }}
                                    >
                                        <Icon
                                            name="send"
                                            type="ionicon"
                                            size={24}
                                            color={'blue'}
                                        />
                                    </View>
                                </Send>
                            )}
                            renderLoading={() => (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transform: [{ rotateX: '180deg' }],
                                    }}
                                >
                                    <ActivityIndicator
                                        color={'blue'}
                                        animating
                                    />
                                </View>
                            )}
                            alwaysShowSend
                            showAvatarForEveryMessage
                            showUserAvatar
                            onSend={(text: any) =>
                            {
                                text[0].conversation = conversationId;
                                text[0].recipient = recipient;
                                MessageService.setMessages(text[0]);
                                this.getAll();
                            }}
                        />
                    </View>
                ) : (
                    <ScrollView
                        style={{ width: '100%' }}
                        contentContainerStyle={{
                            flex: 1,
                            // justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {firebase.auth().currentUser?.uid === this.state.data.permission.owner && (
                            <Button
                                style={{ width: '90%', marginTop: 10 }}
                                onPress={() => this.setState({ isVisible: true })}
                            >
                                <Text>{language.UPDATE_GROUP_NAME}</Text>
                            </Button>
                        )}
                        <Button
                            style={{ width: '90%', marginTop: 10 }}
                            onPress={() => this.setState({ isVisibleList: true })}
                        >
                            <Text>{language.MEMBER_LIST}</Text>
                        </Button>
                        {firebase.auth().currentUser?.uid === this.state.data.permission.owner && (
                            <Button
                                style={{ width: '90%', marginTop: 10 }}
                                onPress={() =>
                                    navigation.navigate('AddGroupMember', {
                                        data: data,
                                        id: this.state.conversationId,
                                    })
                                }
                            >
                                <Text>{language.ADD_MEMBER}</Text>
                            </Button>
                        )}
                        {firebase.auth().currentUser?.uid === this.state.data.permission.owner ? (
                            <Button
                                style={{ width: '90%', marginTop: 10, backgroundColor: 'red' }}
                                onPress={this.onRemove}
                            >
                                <Text style={{ color: 'red', fontWeight: 'bold' }}>{language.DELETE}</Text>
                            </Button>
                        ) : (
                            <Button
                                style={{ width: '90%', marginTop: 10, backgroundColor: 'red' }}
                                onPress={this.onLeave}
                            >
                                <Text style={{ color: 'red', fontWeight: 'bold' }}>{language.LEAVE}</Text>
                            </Button>
                        )}
                    </ScrollView>
                )}
                <Modal
                    animationIn={'fadeInUp'}
                    animationInTiming={200}
                    animationOutTiming={200}
                    animationOut={'fadeOutDown'}
                    backdropTransitionInTiming={200}
                    backdropTransitionOutTiming={200}
                    backdropColor={'black'}
                    backdropOpacity={0.3}
                    swipeDirection={'down'}
                    style={styles.modal}
                    isVisible={this.state.isVisible}
                    hasBackdrop
                    hideModalContentWhileAnimating
                    useNativeDriver
                    statusBarTranslucent
                    onBackdropPress={() => this.setState({ isVisible: false })}
                >
                    <View style={{ width: '100%', backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                        <View style={{ width: '100%', backgroundColor: 'white', padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 }}>Tên nhóm:</Text>
                            <TextInput
                                style={{ width: '70%', color: color.TXT_CONTENT, fontWeight: 'bold', fontSize: 20 }}
                                placeholder={'Tên nhóm'}
                                defaultValue={data.title}
                                onChangeText={(val) => this.setState({ nameTmp: val })}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                style={{ width: '48%' }}
                                onPress={() => this.setState({ isVisible: false })}
                            >
                                <Text>{language.CANCEL}</Text>
                            </Button>
                            <Button
                                style={{ width: '48%' }}
                                onPress={() => this.onChangeName()}
                            >
                                <Text>{language.CONFIRM}</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationIn={'fadeInUp'}
                    animationInTiming={200}
                    animationOutTiming={200}
                    animationOut={'fadeOutDown'}
                    backdropTransitionInTiming={200}
                    backdropTransitionOutTiming={200}
                    backdropColor={'black'}
                    backdropOpacity={0.3}
                    swipeDirection={'down'}
                    style={styles.modal}
                    isVisible={this.state.isVisibleList}
                    hasBackdrop
                    hideModalContentWhileAnimating
                    useNativeDriver
                    statusBarTranslucent
                    onBackdropPress={() => this.setState({ isVisibleList: false })}
                >
                    <View style={{ width: '100%', backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 22 }}>List</Text>

                        {this.state.listUser.map((user) =>
                        {
                            return (
                                <Pressable
                                    key={user.id}
                                    style={{
                                        paddingVertical: 20,
                                        paddingHorizontal: 16,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: color.BG_CARD,
                                        borderRadius: 10,
                                        borderWidth: 0,
                                        marginBottom: 10,
                                    }}
                                    // onPress={() =>
                                    // {
                                    //     navigation.navigate('MessageView', { conversation: id, data });
                                    // }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {user?.thumbnail ? (
                                            <FastImage
                                                style={{
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: 22.5,
                                                    borderWidth: 0.1,
                                                    overflow: 'hidden',
                                                }}
                                                source={{
                                                    uri: user?.thumbnail,
                                                }}
                                            />
                                        ) : (
                                            <AvatarFirstChar
                                                style={{
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: 22.5,
                                                    borderWidth: 0.1,
                                                    overflow: 'hidden',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                text={user?.name ?? '?'}
                                                colorObj={color}
                                            />
                                        )}
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey' }}>{user?.name ?? ''}</Text>
                                            {/* <Text style={{ ...(id?.messageState && { fontWeight: 'bold' }), fontSize: 12, color: 'grey' }}>{id?.message ?? ''}</Text> */}
                                        </View>
                                    </View>
                                    <View>
                                        {user.id === data.permission.owner && (
                                            // <Pressable onPress={() => this.onRemoveMember(user.id)}>
                                            <Icon
                                                name="crown"
                                                type="FontAwesome5"
                                                size={24}
                                                color={'red'}
                                            />
                                            // </Pressable>
                                        )}
                                        {firebase.auth().currentUser?.uid === data.permission.owner
                                            ? firebase.auth().currentUser?.uid !== user.id && (
                                                <Pressable onPress={() => this.onRemoveMember(user.id)}>
                                                    <Icon
                                                        name="close"
                                                        type="ionicon"
                                                        size={24}
                                                        color={'red'}
                                                    />
                                                </Pressable>
                                            )
                                            : data.permission.admin.includes(firebase.auth().currentUser?.uid) &&
                                              !data.permission.admin.includes(user.id) &&
                                              user.id !== data.permission.owner && (
                                                <Pressable onPress={() => this.onRemoveMember(user.id)}>
                                                    <Icon
                                                        name="close"
                                                        type="ionicon"
                                                        size={24}
                                                        color={'red'}
                                                    />
                                                </Pressable>
                                            )}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </Modal>
                <ModalConfirm
                    ref={this.refModalConfirm}
                    title={language.CONFIRM}
                    textAction={language.DELETE}
                    description={language.DESCRIPTION_DELETE_GROUP}
                    onConfirm={() =>
                    {
                        const { language, navigation } = this.props;

                        firestore().collection('Conversation').doc(this.state.conversationId).delete();
                        ShowToast('success', language.SUCCESS, language.REMOVE_GROUP, {
                            onPress: () =>
                            {
                                Toast.hide();
                            },
                            visibilityTime: 3000,
                        });
                        navigation.goBack();
                    }}
                />
                <ModalConfirm
                    ref={this.refModalConfirmLeave}
                    title={language.CONFIRM}
                    textAction={language.LEAVE}
                    description={language.DESCRIPTION_LEAVE_GROUP}
                    onConfirm={() =>
                    {
                        const { language, navigation } = this.props;

                        const newList = [...this.state.recipient];
                        firestore().collection('Conversation').doc(this.state.conversationId).update({ users: newList });
                        ShowToast('success', language.SUCCESS, language.LEAVE_SUCCESS, {
                            onPress: () =>
                            {
                                Toast.hide();
                            },
                            visibilityTime: 3000,
                        });
                        navigation.goBack();
                    }}
                />
            </ViewShot>
        );
    }
}

function mapStateToProps(state: any)
{
    return {
        userInfor: state.user.userInfor,
        color: state.controlApp.settings.color.ABOUT,
        language: state.controlApp.settings.language,
    };
}

function mapDispatchToProps(dispatch: any)
{
    return {
        setBackgroundScreenDrawer: bindActionCreators(ControlAppActions.setBackgroundScreenDrawer, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageGroup);
