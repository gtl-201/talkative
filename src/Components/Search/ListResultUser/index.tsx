import React, { FC, memo, useCallback } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

import styleScaled from './style';
import { GENDER, IMAGE, SHADOW_2 } from '../../../Utils/Values';
import FastImage from 'react-native-fast-image';
import { getColorGender, getIconGender } from '../../../Utils/Helpers';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import { firebase } from '@react-native-firebase/auth';

const ListResultUser: FC<any> = (props) =>
{
    const { color, data, navigation, onSelect, isCanSelect } = props;
    const styles = styleScaled(color);

    const onPressItem = (user: any) =>
    {
        if (isCanSelect)
        {
            onSelect && onSelect(user);
        }
        else
        {
            navigation.navigate('ProfileOther', { userId: user.id });
        }
    };

    const renderItem = ({ item }) =>
    {
        return (
            <TouchableOpacity
                style={styles.containerItem}
                onPress={() => onPressItem(item)}
            >
                {item.thumbnail
                    ? (
                            <FastImage
                                style={[styles.avatar, { ...SHADOW_2 }]}
                                source={{
                                    uri: item.thumbnail,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={'cover'}
                            />
                        )
                    : (
                            <View style={[styles.avatar, { ...SHADOW_2 }]}>
                                <Image
                                    style={styles.avatar}
                                    source={IMAGE.EMPTY_AVATAR}
                                    resizeMode={'cover'}
                                />
                            </View>
                        )}

                <View style={styles.viewName}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={styles.txtNickname}
                    >
                        {item.nickname}
                        <Icon
                            type={'MaterialCommunityIcons'}
                            name={getIconGender(item.gender || GENDER.CUSTOM)}
                            size={moderateScale(20, 0.3)}
                            color={getColorGender(item.gender || GENDER.CUSTOM)}
                        />
                    </Text>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={styles.txtName}
                    >
                        {item.name}
                    </Text>
                </View>
                {!isCanSelect && (
                    <TouchableOpacity
                        style={{
                            // backgroundColor: 'red',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() =>
                        {
                            console.log(item);
                            navigation.navigate('MessageView', {
                                conversationObject: [firebase.auth().currentUser?.uid ?? '', item.id],
                                data: item,
                            });
                        }}
                    >
                        <Icon
                            type={'MaterialIcons'}
                            name={'message'}
                            size={moderateScale(30, 0.5)}
                            color={color.SEARCHBAR_IC_ADD}
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const keyExtractor = useCallback((item) => item.id, []);

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            data={data}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
        />
    );
};

export default memo(ListResultUser);
