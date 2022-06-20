import React, { FC, memo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../BaseComponents/Icon';
import styleScaled from './style';
import { connect } from 'react-redux';

interface Props {
    color: any;
    navigation: DrawerNavigationProp<any>;
}

const SearchBar: FC<Props> = (props, language) =>
{
    const { color, navigation } = props;
    const styles = styleScaled(color);
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.touchAvatar}
                onPress={() => navigation.openDrawer()}
            >
                <Icon
                    type={'MaterialIcons'}
                    name={'notes'}
                    size={moderateScale(30, 0.5)}
                    color={color.INFOR_IC_MENU}
                />
            </TouchableOpacity>
            <Text style={styles.AppName}>{language.Speaker}</Text>
        </View>
    );
};

function mapStateToProps(state: any)
{
    return {
        color: state.controlApp.settings.color.HEADER,
    };
}

export default connect(mapStateToProps)(SearchBar);
