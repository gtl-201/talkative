import React, { FC, memo } from 'react';
import { Text, View, ViewStyle } from 'react-native';

interface Props {
    text: string;
    style: ViewStyle;
    fontSize: number;
    colorObj: any;
}

enum colors {
    'blue',
    'green',
    'red',
    'orange',
    'yellow',
    'brown',
}

function getRandomEnumValue<T>(anEnum: T): T[keyof T]
{
    // save enums inside array
    const enumValues = Object.keys(anEnum) as Array<keyof T>;

    // Generate a random index (max is array length)
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    // get the random enum value

    const randomEnumKey = enumValues[randomIndex];
    return anEnum[randomEnumKey];
    // if you want to have the key than return randomEnumKey
}

const AvatarFirstCharacter: FC<any> = (props: Props) =>
{
    const { text, style, fontSize, colorObj } = props;

    const color = getRandomEnumValue(colors);
    return (
        <View style={{ ...style, backgroundColor: Number.isInteger(color) ? 'green' : color }}>
            <Text style={{ fontWeight: 'bold', fontSize: fontSize ?? 19, color: colorObj.TXT_CONTENT_2 }}>{text[0].toUpperCase()}</Text>
        </View>
    );
};

export default memo(AvatarFirstCharacter);
