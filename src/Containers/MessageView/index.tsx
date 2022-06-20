/* eslint-disable multiline-ternary */
import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, Keyboard, Pressable, Switch, Text, View } from 'react-native';

import 'dayjs/locale/vi';

import { connect } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import { bindActionCreators } from 'redux';
import styleScaled from './style';
import Header from '../../Components/BaseComponents/Header';
import * as ControlAppActions from '../../Store/Actions/control-app-actions';
import { GiftedChat, Send, Avatar, MessageText } from 'react-native-gifted-chat';
import Icon from '../../Components/BaseComponents/Icon';
import { MessageService } from '../../Store/Services/message-service';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/storage';
import Tts from 'react-native-tts';

interface State {
    messages: any;
    conversationId: string;
    recipient: any;
    mode: string;
}

class MessageView extends Component<any, State>
{
    tts = Tts;
    state = {
        messages: [],
        conversationId: '',
        recipient: [],
        mode: 'read',
    };
    // Tts.speak(txt);
    // https://github.com/ak1394/react-native-tts

    async componentDidMount()
    {
        const { conversation, conversationObject } = this.props.route.params;

        this.tts.setDefaultLanguage('en-IE');
        this.tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact');

        if (conversation)
        {
            // UserServices.getUidUserInfor();
            MessageService.getConversation(conversation.id).then((response) =>
            {
                const uidRecipient = response.users.filter((user: string) => user !== firebase.auth().currentUser?.uid);
                this.setState({ recipient: uidRecipient });
            });
            this.setState({ conversationId: conversation.id });
            this.getAll();
            this.initSession();
        }
        else
        {
            console.log('no id available');

            const uidRecipient = conversationObject.find((user: string) => user !== firebase.auth().currentUser?.uid);
            this.setState({ recipient: [uidRecipient] });
            this.createNewConversation();
        }
    }

    createNewConversation = async (): Promise<void> =>
    {
        const { conversationObject } = this.props.route.params;
        let data: any = [];
        await firebase
            .firestore()
            .collection('Conversation')
            .where('users', 'array-contains', conversationObject[0])
            .get()
            .then((docRef) =>
            {
                data = docRef.docs.map((doc) => doc.data()).filter((item) => item.users.includes(conversationObject[1]) && !item.isGroup);
            })
            .catch((error) => console.error('Error adding document: ', error));

        if (data.length > 0)
        {
            this.setState({ conversationId: data[0].id });
        }
        else
        {
            await firebase
                .firestore()
                .collection('Conversation')
                .add({
                    users: conversationObject,
                })
                .then((docRef) =>
                {
                    docRef.update({ id: docRef.id });
                    this.setState({ conversationId: docRef.id });
                })
                .catch((error) => console.error('Error adding document: ', error));
        }
        this.initSession();
    };

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

    getAll()
    {
        const { conversationId } = this.state;

        MessageService.getMessages(conversationId).then((messages) => this.setState({ messages }));
    }

    render(): React.ReactNode
    {
        const { navigation, color, userInfor } = this.props;
        const { data } = this.props.route.params;
        const { conversationId, recipient } = this.state;

        const styles = styleScaled(color) as any;

        return (
            <ViewShot
                style={styles.container}
                options={{ result: 'base64', quality: 0.5 }}
            >
                <Header
                    iconLeftType={'MaterialIcons'}
                    iconLeft={'arrow-back'}
                    title={data.name ?? ''}
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
                            renderMessageText={(props) =>
                            {
                                return (
                                    <Pressable
                                        onPress={() =>
                                        {
                                            this.tts.speak(props.currentMessage?.text);
                                        }}
                                    >
                                        <MessageText {...props} />
                                    </Pressable>
                                );
                            }}
                            alwaysShowSend
                            showAvatarForEveryMessage
                            showUserAvatar
                            onSend={(text: any) =>
                            {
                                // console.log(conversationId);

                                text[0].conversation = conversationId;
                                text[0].recipient = recipient;
                                console.log(text[0]);

                                MessageService.setMessages(text[0]);
                                this.getAll();
                            }}
                        />
                    </View>
                ) : (
                    <View>{recipient.length > 1}</View>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageView);
