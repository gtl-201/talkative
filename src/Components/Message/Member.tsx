import React, { FC, memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import AvatarFirstChar from '../BaseComponents/AvatarFirstChar';

interface Props {
    data: any;
    color: any;
    navigation: any;
    id: any;
    type: 'personal' | 'group';
}

const Member: FC<any> = (props: Props) =>
{
    const { data, color, navigation, id, type } = props;

    if (data === undefined)
    {
        return <></>;
    }

    if (type === 'group')
    {
        return (
            <Pressable
                style={{
                    paddingVertical: 20,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor: color.BG_CARD,
                    borderRadius: 10,
                    borderWidth: 0,
                    marginBottom: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,

                    elevation: 2,
                }}
                onPress={() =>
                {
                    navigation.navigate('MessageGroup', { conversation: id, data });
                }}
            >
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
                    text={data?.title ?? '?'}
                    colorObj={color}
                />

                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey' }}>{data?.title ?? ''}</Text>
                    <Text style={{ ...(id?.messageState && { fontWeight: 'bold' }), fontSize: 12, color: 'grey' }}>{id?.message ?? ''}</Text>
                </View>
            </Pressable>
        );
    }

    return (
        <Pressable
            style={{
                paddingVertical: 20,
                paddingHorizontal: 16,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: color.BG_CARD,
                borderRadius: 10,
                borderWidth: 0,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 2,
            }}
            onPress={() =>
            {
                navigation.navigate('MessageView', { conversation: id, data });
            }}
        >
            {data?.avatar
                ? (
                        <FastImage
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: 22.5,
                                borderWidth: 0.1,
                                overflow: 'hidden',
                            }}
                            source={{
                                uri: data?.avatar,
                            }}
                        />
                    )
                : (
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
                            text={data?.name ?? '?'}
                            colorObj={color}
                        />
                    )}
            <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey' }}>{data?.name ?? ''}</Text>
                <Text style={{ ...(id?.messageState && { fontWeight: 'bold' }), fontSize: 12, color: 'grey' }}>{id?.message ?? ''}</Text>
            </View>
        </Pressable>
    );
};

export default memo(Member);
