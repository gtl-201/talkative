/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { DrawerContentScrollView } from '@react-navigation/drawer';
import React, { FC, useCallback, useEffect, useState } from 'react';
import CustomDrawerItem from '../../Components/CustomDrawerItem/custom-drawer-item';
import Icon from '../../Components/BaseComponents/Icon';
import { MENU } from '../../Utils/Values';
import styleScaled from './style';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import * as ControlApp from '../../Store/Actions/control-app-actions';

const CustomDrawerContent: FC<any> = (props) =>
{
    const [currentIndex, setCurrentIndex] = useState(0);
    const { progress, navigation, color, language, updateDrawerAction } = props;

    const styles = styleScaled(color);

    useEffect(() =>
    {
        progress && updateDrawerAction(progress);
    }, [progress]);

    const renderItem = useCallback(
        (item, index) => (
            <CustomDrawerItem
                key={item.name}
                color={color}
                title={language[item.name.toUpperCase()]}
                icon={(
                    <Icon
                        type={item.icon_type}
                        name={item.icon}
                        color={color.IC}
                        size={item.icon_size}
                    />
                )}
                titleStyle={{
                    color: color.TXT_TITLE,
                    fontSize: index === currentIndex ? 21 : 17,
                    fontWeight: index === currentIndex ? 'bold' : 'normal',
                }}
                onPress={() =>
                {
                    navigation.navigate(item.name);
                    setCurrentIndex(index);
                }}
            />
        ),
        [currentIndex, language],
    );

    return (
        <DrawerContentScrollView
            {...props}
            scrollEnabled={false}
            contentContainerStyle={styles.container}
        >
            {MENU.map(renderItem)}
        </DrawerContentScrollView>
    );
};

function mapDispatchToProps(dispatch: Dispatch<AnyAction>)
{
    return {
        updateDrawerAction: bindActionCreators(ControlApp.updateDrawer, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(CustomDrawerContent);
