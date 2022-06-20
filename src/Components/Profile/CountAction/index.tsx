import React, { FC, memo } from 'react';
import { Text, View } from 'react-native';
import styleScaled from './style';
import { numberHelpers } from '../../../Utils/Helpers';

interface Props {
    color: any;
    totalCall?: number;
    makeCall?: number;
    getCall?: number;
    language: object;
}

const CountAction: FC<Props> = (props) =>
{
    const { color, language } = props;
    const styles = styleScaled(color);

    return (
        <View style={styles.container}>
            <View style={styles.containerCount}>
                {/* follow */}
                <View style={styles.viewCount}>
                    <Text style={styles.textCount}>{props.totalCall}</Text>
                    <Text style={styles.textTitle}>{language.Call}</Text>
                </View>

                <View style={styles.viewStroke} />

                {/* notice */}
                <View style={styles.viewCount}>
                    <Text style={styles.textCount}>{props.makeCall}</Text>
                    <Text style={styles.textTitle}>{language.Make_call}</Text>
                </View>

                <View style={styles.viewStroke} />

                {/* share */}
                <View style={styles.viewCount}>
                    <Text style={styles.textCount}>{props.getCall}</Text>
                    <Text style={styles.textTitle}>{language.Have_call}</Text>
                </View>
            </View>
        </View>
    );
};
export default memo(CountAction);
