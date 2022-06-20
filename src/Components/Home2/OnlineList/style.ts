import { Dimensions } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { SHADOW_3, SHADOW_5, SIZES } from '../../../Utils/Values';

const styleScaled = (Color: any) =>
{
    return ScaledSheet.create({
        bgColor: {
            backgroundColor: Color.BG,
            flex: 1,
        },
        container: {
            // flexDirection: "row",
            // justifyContent: "space-between",
            alignItems: 'center',
            width: '100%',
            paddingVertical: '8@ms',
            paddingHorizontal: '12@ms',
            // borderRadius: "40@ms",
            // ...SHADOW_3,
            alignSelf: 'center',
            zIndex: 1,
            // marginTop: SIZES.HEIGHT_PADDINGTOP
        },
        title: {
            fontSize: '24@ms0.5',
            fontWeight: 'bold',
            color: Color.TITLE_TXT,
            marginBottom: '6@vs',
            letterSpacing: 1,
            width: '100%',
            textAlign: 'center',
        },
        avatar: {
            backgroundColor: Color.SEARCHBAR_BG_AVATAR,
            width: '50@ms',
            height: '50@ms',
            borderRadius: '10@ms',
        },
        itemContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        contentContainer: {
            // width: '100%'
            marginLeft: 10,
        },
        LeftContainer: {
            flexDirection: 'row',
            width: '70%',
            alignItems: 'center',
        },
        buttonContainer: {
            flexDirection: 'row',
            // width: '30%',
            width: '30%',
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        btnBig: {
            // width: "90%",
            flexDirection: 'row',
            backgroundColor: Color.SEARCHBAR_IC_ADD,
            paddingVertical: '12@vs',
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8@ms',
            marginBottom: '15@vs',
            ...SHADOW_3,
        },
        txtBigBtn: {
            color: Color.BG_BTN_CURRENT_LOCATION,
            fontSize: '19@ms0.3',
            fontWeight: 'bold',
            marginLeft: 10,
        },
        btn: {
            // width: "90%",
            flexDirection: 'row',
            backgroundColor: Color.SEARCHBAR_BG_AVATAR,
            padding: '5@vs',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8@ms',
            ...SHADOW_3,
            marginLeft: 10,
        },
        txtBtn: {
            color: Color.SEARCHBAR_IC_ADD,
            fontSize: '19@ms0.3',
            fontWeight: 'bold',
            // marginLeft: 10
        },
        name: {
            color: Color.TITLE_TXT,
            fontSize: '18@ms0.3',
            fontWeight: 'bold',
        },
        info: {
            color: Color.SEARCHBAR_TXT_SEARCH,
            fontSize: '14@ms0.3',
            fontWeight: 'bold',
        },
    });
};
export default styleScaled;
