import { Dimensions } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SHADOW_2, SHADOW_3, SHADOW_5, SIZES } from '../../Utils/Values';

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
            fontSize: '21@ms0.5',
            fontWeight: 'bold',
            color: Color.TITLE_TXT,
            marginBottom: '4@vs',
            marginTop: '10@vs',
            letterSpacing: 1,
            width: '100%',
            textAlign: 'center',
        },
        content: {
            fontSize: '15@ms0.5',
            fontWeight: 'bold',
            color: Color.TITLE_TXT,
            // marginBottom: '6@vs',
            letterSpacing: 1,
            // width: '70%',
            textAlign: 'left',
        },
        subContent:{
            fontSize: '15@ms0.5',
            // fontWeight: '1',
            color: Color.TITLE_TXT,
            // marginBottom: '6@vs',
            letterSpacing: 1,
            // width: '70%',
            textAlign: 'left',
        },
        btnTxt: {
            fontSize: '17@ms0.5',
            color: '#FFFF',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: 1,
            textAlign: 'center',
            paddingVertical: 7,
        },
        disabled:{
            // opacity: 0.6,
            backgroundColor: Color.ON_SURFACE_VARIANT,
        },
        containerBtnNext: {
            width: SIZES.WIDTH_WINDOW,
            paddingVertical: 10,
            borderTopWidth: 2,
            borderTopColor: Color.ON_SURFACE_VARIANT,
            justifyContent: 'center',
            // alignItems: 'center',
        },
        btnNext: {
            width: '95%',
            backgroundColor: '#39e75f',
            borderRadius: 5,
            marginLeft: '2.5%',
            opacity: 1,
            // marginBottom: -5,
        },
        cardBox: {
            width: '100%',
            borderWidth: 2,
            borderColor: Color.ON_SURFACE_VARIANT,
            marginVertical: 10,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderRadius: 10,
            backgroundColor: Color.BG,
            ...SHADOW_3,
        },
        cardChoosed:{
            backgroundColor: '#bfe6ff',
            borderColor: '#59bfff',
        },
        processBar: {
            width: '100%',
            borderRadius: 15,
            height: 20,
            backgroundColor: Color.ON_SURFACE_VARIANT,
            flexDirection: 'row',
            // marginLeft: 20,
        },
        percent: {
            backgroundColor: '#39e75f',
            height: 20,
            // width: '20%',
            borderRadius: 15,
            alignItems: 'center',
            ...SHADOW_2,
        },
        subPercent:{
            backgroundColor: '#ffff',
            height: 7,
            opacity: 0.4,
            // width: '20%',
            borderRadius: 5,
            marginTop: 4,
            marginLeft: -1,
        },
        scrollViewContainer: {
            flex: 1,
            width: SIZES.WIDTH_WINDOW - (SIZES.WIDTH_WINDOW * 0.08),
        },
    });
};
export default styleScaled;