import React, { FC, memo, useEffect } from 'react';
import { Dimensions, FlatList, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';

import styleScaled from './style';
import { IMAGE } from '../../../Utils/Values';
import FastImage from 'react-native-fast-image';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';

const ListSelectedUser: FC<any> = (props) =>
{
    const { color, onDeselected, onCreate, language } = props;
    const styles = styleScaled(color);

    const [data, setData] = React.useState(props.data);

    useEffect(() =>
    {
        setData(props.data);
    }, [props.data]);

    const onPressItem = (userId: string) =>
    {
        onDeselected && onDeselected(userId);
    };

    const renderItem = ({ item }: any) =>
    {
        return (
            <TouchableOpacity
                style={styles.containerItem}
                onPress={() => onPressItem(item.id)}
            >
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', position: 'absolute', top: -5, zIndex: 100, right: -10 }}>
                    <Icon
                        type={'MaterialIcons'}
                        name={'clear'}
                        size={moderateScale(18, 0.5)}
                        color={color.SEARCHBAR_IC_ADD}
                    />
                </View>
                {item.thumbnail
                    ? (
                            <FastImage
                                style={[styles.avatar]}
                                source={{
                                    uri: item.thumbnail,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={'cover'}
                            />
                        )
                    : (
                            <View style={[styles.avatar]}>
                                <Image
                                    style={styles.avatar}
                                    source={IMAGE.EMPTY_AVATAR}
                                    resizeMode={'cover'}
                                />
                            </View>
                        )}
            </TouchableOpacity>
        );
    };

    const keyExtractor = (item: any) => item.id;

    return (
        <View style={{ width: Dimensions.get('window').width }}>
            <View style={{ position: 'relative', paddingHorizontal: 16, paddingVertical: 20 }}>
                <Text style={{ color: color.TXT_TITLE, fontWeight: 'bold' }}>{language.LIST_MEMBER}:</Text>
                <Pressable
                    style={{ position: 'absolute', top: 20, right: 16 }}
                    onPress={onCreate}
                >
                    <Text style={{ color: 'blue', fontWeight: 'bold' }}>{props.mode === 'create' ? language.CREATE : language.ADD}</Text>
                </Pressable>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
                data={data}
                style={{ width: Dimensions.get('window').width }}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.container, { width: '100%' }]}
                horizontal
            />
        </View>
    );
};

export default memo(ListSelectedUser);
