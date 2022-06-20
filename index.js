/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, Text, TextInput, TouchableOpacity, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { TouchableOpacity as TouchableOpacityGesture } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import { insertNotifications } from './src/Store/Services/db-service';

import notifee, { EventType } from '@notifee/react-native';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
};
TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false,
};
TouchableOpacity.defaultProps = {
    ...(TouchableOpacity.defaultProps || {}),
    activeOpacity: 0.8,
};
TouchableOpacityGesture.defaultProps = {
    ...(TouchableOpacityGesture.defaultProps || {}),
    activeOpacity: 0.8,
};

messaging().setBackgroundMessageHandler(async ({ messageId, notification, sentTime, data }) =>
{
    console.log(data);
    await insertNotifications([
        {
            id: messageId,
            title: notification.title,
            body: notification.body,
            time: sentTime,
            data: data,
        },
    ]);
});

notifee.onBackgroundEvent(async ({ type, detail }) =>
{
    const { notification, pressAction } = detail;
    console.log(JSON.stringify(detail, null, 2)); // <- this console log doesn't fire at all on iOS while working on Android
    if (type === EventType.DELIVERED)
    {
        console.log(notification); // <- the same for this console log
        // do something
        AppRegistry.registerComponent(appName, () => App);
    }
    else if (type === EventType.ACTION_PRESS && pressAction?.id === 'mark-as-read')
    {
        await notifee.cancelNotification(notification?.id ?? '');
    }
});

// Create a group
notifee.createChannelGroup({
    id: 'message',
    name: 'Message',
});

// Assign the group to the channel
notifee.createChannel({
    id: 'messages',
    name: 'New Messages',
    groupId: 'message',
});

AppRegistry.registerComponent(appName, () => App);
