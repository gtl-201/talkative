import React, { FC, memo } from 'react';
import styleScaled from './style';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../Containers/Home2';
import Animated from 'react-native-reanimated';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import Profile from '../../Containers/Profile';
import BackgroundScreen from '../../Containers/BackgroundScreen';
import About from '../../Containers/About';
import Statistics from '../../Containers/Statistics';
import Feedback from '../../Containers/Feedback';
import Notification from '../../Containers/Notification';
import Setting from '../../Containers/Setting';
import Message from '../../Containers/Message';
import MessageView from '../../Containers/MessageView';
import MessageGroup from '../../Containers/MessageGroup';
import VideoCall from '../../Containers/Call/VideoCall';
import Practise from '../../Containers/Practise';
import AddGroupMember from '../../Containers/AddMemberGroup';

const Stack = createStackNavigator();

const AppStackNavigator: FC<any> = (props) =>
{
    const { progress } = props;
    const styles = styleScaled(null);
    const isDraweOpen = useIsDrawerOpen();

    const scale = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.73],
    });

    const backgroundScreen = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.85],
    });

    const translateX = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, 85],
    });

    const translateXContainer = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, -85],
    });

    const borderRadius = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, 30],
    });

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scale }, { translateX: translateXContainer }] }]}>
            <Animated.View style={[styles.containerDrawer, { transform: [{ scale: backgroundScreen }] }]}>{isDraweOpen && <BackgroundScreen />}</Animated.View>

            <Animated.View
                style={[
                    styles.containerStack,
                    {
                        borderRadius: borderRadius,
                        transform: [{ translateX: translateX }],
                    },
                ]}
            >
                <Stack.Navigator
                    initialRouteName={'Home'}
                    screenOptions={{
                        header: () => null,
                        gestureEnabled: false,
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={Home}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                    />
                    <Stack.Screen
                        name="Statistics"
                        component={Statistics}
                    />
                    <Stack.Screen
                        name="Feedback"
                        component={Feedback}
                    />
                    <Stack.Screen
                        name="About"
                        component={About}
                    />
                    <Stack.Screen
                        name="Message"
                        component={Message}
                    />
                    <Stack.Screen
                        name="Notification"
                        component={Notification}
                    />
                    <Stack.Screen
                        name="Setting"
                        component={Setting}
                    />
                    <Stack.Screen
                        name="MessageView"
                        component={MessageView}
                    />
                    <Stack.Screen
                        name="MessageGroup"
                        component={MessageGroup}
                    />
                    <Stack.Screen
                        name="VideoCall"
                        component={VideoCall}
                    />
                    <Stack.Screen
                        name="Practise"
                        component={Practise}
                    />
                    <Stack.Screen
                        name="AddGroupMember"
                        component={AddGroupMember}
                    />
                </Stack.Navigator>
            </Animated.View>
        </Animated.View>
    );
};

export default memo(AppStackNavigator);
