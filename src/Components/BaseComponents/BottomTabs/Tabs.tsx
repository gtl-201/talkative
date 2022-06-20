import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

import PropTypes from 'prop-types';

import Icon from '../Icon';
import { moderateScale } from 'react-native-size-matters';

export type dataBottomTabs = {
    key: number;
    handleClick?: (data?: dataBottomTabs) => any;
    icon: string;
    activeIcon?: string;
    iconType?: string;
    component: React.ComponentType<any> | React.ReactElement | null | undefined;
    title?: string;
};

export type Props = {
    data?: dataBottomTabs[];
    handleChangeTab?: (_key: number) => void;
    currentTabIndex?: number;
    layout?: number;
    textSize?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl';
    /**
     * color of header
     * but use for bottomTabs
     */
    color: any;
};

const stylesBuilder = (color: any) =>
    StyleSheet.create({
        bottomTabShadowAndroid: {
            borderTopColor: '#dadada',
            borderTopWidth: 1,
            elevation: 4,
            shadowColor: '#000',

            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0,
            shadowRadius: 4.65,
        },
        bottomTabShadowIos: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: -2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 1,
        },
        bottomTabs: {
            bottom: 0,
            flexDirection: 'row',
            height: 60,
            position: 'absolute',
            width: '100%',
            zIndex: 100,
        },
        container: {
            height: '100%',
            // paddingVertical: 20,
            position: 'relative',
            width: '100%',
            flex: 1,
        },
        h20: { height: 20 },
        home: {
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: color.BG,
        },
        selectHome: {
            alignItems: 'center',
            backgroundColor: color.BG_ACTIVE,
            height: '100%',
            justifyContent: 'center',
        },
    });

const BottomTabs: React.FC<Props> = ({ data, handleChangeTab, currentTabIndex, layout, textSize = 'xl', color }) =>
{
    const styles = stylesBuilder(color);
    const [selectedTabs, setSelectedTabs] = useState(0);

    useEffect(() =>
    {
        if (currentTabIndex !== undefined)
        {
            setSelectedTabs(currentTabIndex);
        }
    }, [currentTabIndex]);

    const handleChooseTabs = (key: number) =>
    {
        setSelectedTabs(key);

        const selectedTab = data?.find((e) => e.key === key);

        selectedTab && selectedTab.handleClick && selectedTab.handleClick(selectedTab);

        if (handleChangeTab)
        {
            handleChangeTab(key);
        }
    };

    const renderComponent = () =>
    {
        return (
            <>
                {data?.map((item: dataBottomTabs) =>
                {
                    const displayScreen = StyleSheet.create({
                        viewLayout: {
                            display: item.key === selectedTabs ? 'flex' : 'none',
                            flex: 1,
                            height: '90%',
                        },
                    });

                    return (
                        <View
                            key={item.key}
                            style={displayScreen.viewLayout}
                        >
                            {item?.component}
                        </View>
                    );
                })}
            </>
        );
    };

    const Layout = (): JSX.Element =>
    {
        return (
            <View style={[styles.bottomTabs, { backgroundColor: 'white' }]}>
                {data?.map((layout: dataBottomTabs, index) =>
                {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={
                                selectedTabs === layout.key
                                    ? {
                                            ...styles.selectHome,
                                            width: Dimensions.get('window').width / data.length,
                                        }
                                    : {
                                            ...styles.home,
                                            width: Dimensions.get('window').width / data.length,
                                        }
                            }
                            onPress={() => handleChooseTabs(layout.key)}
                        >
                            {selectedTabs === layout.key
                                ? (
                                        <Icon
                                            type={layout.iconType as any}
                                            name={layout.icon}
                                            size={moderateScale(28, 0.3)}
                                            color={'white'}
                                        />
                                    )
                                : (
                                        <Icon
                                            type={layout.iconType as any}
                                            name={layout.icon}
                                            size={moderateScale(28, 0.3)}
                                            color={'black'}
                                        />
                                    )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderComponent()}

            <View style={styles.h20}>
                <Layout />
            </View>
        </View>
    );
};

BottomTabs.propTypes = {
    data: PropTypes.any,
    color: PropTypes.any,
};

export default BottomTabs;
