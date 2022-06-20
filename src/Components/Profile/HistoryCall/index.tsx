import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, { FC, memo, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import CardListItem from '../CardListItem';

interface Props {
    color: any;
    makeCall?: any;
    getCall?: any;
    language: object;
}
const HistoryCall: FC<Props> = (props) =>
{
    const { color, language } = props;
    const styles = styleScaled(color);

    const [currentTab, setCurrentTab] = useState(0);
    return (
        <View style={styles.container}>
            <View style={styles.flexRowBetween}>
                <Text
                    style={currentTab === 0 ? styles.textTabActive : styles.textTab}
                    onPress={() => setCurrentTab(0)}
                >
                    {language.MAKE_call}
                </Text>
                <Text
                    style={currentTab === 1 ? styles.textTabActive : styles.textTab}
                    onPress={() => setCurrentTab(1)}
                >
                    {language.HAVE_call}
                </Text>
            </View>

            {currentTab === 0
                ? (
                        <CardListItem
                            color={color}
                            data={props.makeCall}
                            title={language.Make_call}
                            language={language}
                            caller={true}
                        />
                    )
                : (
                        <CardListItem
                            color={color}
                            data={props.getCall}
                            title={language.Have_call}
                            language={language}
                            caller={false}
                        />
                    )}
        </View>
    );
};
export default memo(HistoryCall);
