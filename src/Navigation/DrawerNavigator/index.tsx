import React, { FC, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './custom-drawer-content';
import AppStackNavigator from '../DrawerStackNavigator';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import styleScaled from './style';
import Icon from '../../Components/BaseComponents/Icon';
import CustomBottomDrawerItem from '../../Components/CustomDrawerItem/custom-bottom-drawer-item';
import { SIZES } from '../../Utils/Values';
import { connect } from 'react-redux';
import CustomTopDrawerItem from '../../Components/CustomDrawerItem/custom-top-drawer-item';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { insertNotifications } from '../../Store/Services/db-service';

import firestore, { firebase } from '@react-native-firebase/firestore';

const Drawer = createDrawerNavigator();

const DrawerNavigator: FC<any> = (props) =>
{
    const { progressDrawer, userInfor, color, language, navigation } = props;
    const styles = styleScaled(color);

    const messageNotifee = () =>
    {
        const ref = firestore().collection('Messages');
        ref.onSnapshot((snapShot) =>
        {
            ref.where('recipient', 'array-contains', firebase.auth().currentUser?.uid)
                .get()
                .then((recipient) =>
                {
                    const data: any = [];
                    recipient.forEach((e) =>
                    {
                        if (e.exists)
                        {
                            data.push(e.data());
                        }
                    });

                    const tmp = data.filter((item: any) =>
                    {
                        return item.notifiState === true;
                    });

                    if (tmp.length !== 0)
                    {
                        ref.doc(tmp[0].id)
                            .get()
                            .then((snap) =>
                            {
                                if (snap.exists && snap?.data()?.notifiState)
                                {
                                    ref.doc(tmp[0].id).update({ notifiState: false });
                                }
                            });

                        notifee
                            .displayNotification({
                                title: '<p style="color: #4caf50;"><b>Bạn có tin nhắn mới từ Speaker nè</span></p></b></p> &#128576;',
                                subtitle: '&#129395;',
                                body: 'Hãy vào xem ngay nào &#127881;!',
                                android: {
                                    channelId: 'messages',
                                    color: '#4caf50',
                                    actions: [
                                        {
                                            title: '<b>Xem</b> &#128111;',
                                            pressAction: { id: 'seen', launchActivity: 'MainActivity' },
                                        },
                                        {
                                            title: '<p style="color: #f44336;"><b>Bỏ qua</b> &#128557;</p>',
                                            pressAction: { id: 'mark-as-read' },
                                        },
                                    ],
                                },
                            })
                            .then((a) => {});
                    }
                });
        });
    };

    useEffect(() =>
    {
        messageNotifee();
        notifee.onForegroundEvent(async ({ type, detail }) =>
        {
            if (type === EventType.ACTION_PRESS && detail?.pressAction?.id)
            {
                console.log('User pressed an action with the id: ', detail.pressAction.id);
                if (detail.pressAction.id === 'mark-as-read')
                {
                    await notifee.cancelNotification(detail.notification?.id ?? '');
                }
                else if (detail.pressAction.id === 'seen')
                {
                    navigation.navigate('Message');
                    await notifee.cancelNotification(detail.notification?.id ?? '');
                }
            }
        });
    }, []);

    useEffect(() =>
    {
        return notifee.onForegroundEvent(async ({ type, detail }) =>
        {
            if (type === EventType.PRESS)
            {
                navigation.navigate('Message');
            }
        });
    }, []);

    async function onDisplayNotification(messageId: string, title: string, body: string, data: any)
    {
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        await notifee.displayNotification({
            title: title,
            body: body,
            data: data,
            id: messageId,
            android: {
                channelId,
                smallIcon: 'ic_notification',
            },
            ios: {
                foregroundPresentationOptions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
            },
        });
    }

    useEffect(() =>
    {
        messaging().onNotificationOpenedApp(async ({ messageId, data }) =>
        {
            navigation.navigate('Message');
        });

        messaging()
            .getInitialNotification()
            .then(async (remoteMessage) =>
            {
                if (remoteMessage)
                {
                    navigation.navigate('Message');
                }
            });

        return messaging().onMessage(async ({ messageId, notification, sentTime, data }) =>
        {
            await insertNotifications([
                {
                    id: messageId,
                    title: notification?.title,
                    body: notification?.body,
                    time: sentTime,
                    data: data,
                },
            ]);
            onDisplayNotification(messageId ?? '', notification?.title ?? '', notification?.body ?? '', data);
        });
    }, []);

    const translateX = Animated.interpolateNode(progressDrawer, {
        inputRange: [0, 1],
        outputRange: [0, SIZES.WIDTH_WINDOW],
    });

    const opacity = Animated.interpolateNode(progressDrawer, {
        inputRange: [0, 0.7, 1],
        outputRange: [0, 0, 1],
    });

    return (
        <>
            <View style={styles.containerHeader}>
                <Animated.View style={[styles.viewHeader, { opacity: opacity, transform: [{ translateX: translateX }] }]}>
                    <CustomTopDrawerItem
                        color={color}
                        navigation={navigation}
                        userInfor={userInfor}
                    />
                </Animated.View>
            </View>

            <View style={styles.containerDrawer}>
                <Drawer.Navigator
                    initialRouteName="Screens"
                    drawerType={'slide'}
                    overlayColor="transparent"
                    drawerStyle={styles.drawerStyle}
                    sceneContainerStyle={styles.sceneContainerStyle}
                    drawerContent={(props) =>
                    {
                        return (
                            <CustomDrawerContent
                                {...props}
                                color={color}
                                language={language}
                            />
                        );
                    }}
                >
                    <Drawer.Screen
                        name="Screens"
                        options={{ swipeEnabled: false }}
                    >
                        {(props) =>
                        {
                            return (
                                <AppStackNavigator
                                    {...props}
                                    progress={progressDrawer}
                                />
                            );
                        }}
                    </Drawer.Screen>
                </Drawer.Navigator>
            </View>

            <View style={styles.containerBottom}>
                <Animated.View style={[styles.viewBottom, { opacity: opacity, transform: [{ translateX: translateX }] }]}>
                    <CustomBottomDrawerItem
                        navigation={navigation}
                        titleLogout={language.LOGOUT}
                        titleSettings={language.SETTING}
                        color={color}
                        icon={(
                            <Icon
                                type={'MaterialIcons'}
                                name="settings"
                                color={color.IC}
                                size={26}
                            />
                        )}
                        titleStyle={styles.txtBottom}
                    />
                </Animated.View>
            </View>
        </>
    );
};

function mapStateToProps(state: any)
{
    return {
        progressDrawer: state.controlApp.progressDrawer,
        userInfor: state.user.userInfor,
        color: state.controlApp.settings.color.DRAWER,
        language: state.controlApp.settings.language,
    };
}

export default connect(mapStateToProps)(DrawerNavigator);
