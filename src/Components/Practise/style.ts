import { scale, ScaledSheet } from 'react-native-size-matters';
import { SHADOW_3, SIZES } from '../../Utils/Values';

const styleScaled = (Color: any) =>
{
    return ScaledSheet.create({
        rate: {
            // flexDirection: 'row',
            position: 'absolute',
            bottom: 10,
            left: 10,
        },
        pitch: {
            // flexDirection: 'row',
            position: 'absolute',
            bottom: 10,
            right: 10,
        },
        container: {
            // top: SIZES.WIDTH_WINDOW - scale(37),
            // position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'flex-start',
            alignItems: 'center',
            // marginBottom: 20,
            flex: 1,
            // backgroundColor: 'pink',
            width: SIZES.WIDTH_WINDOW,
        },
        textInput: {
            // with: SIZES.WIDTH_WINDOW * 0.9,
            marginTop: 10,
            marginHorizontal: 15,
            ...SHADOW_3,
            paddingVertical: 20,
            paddingHorizontal: 30,
            color: Color.INFOR_IC_MENU,
            borderWidth: 2,
            borderColor: Color.IC_EMPTY,
            borderRadius: 10,
            backgroundColor: Color.BG,
            fontSize: '16@ms0.3',
        },
        btnBig: {
            // width: "90%",
            flexDirection: 'row',
            backgroundColor: '#5C8AEA',
            // paddingVertical: '12@vs',
            // paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8@ms',
            // marginBottom: '15@vs',
            padding: '10@vs',
            ...SHADOW_3,
            marginTop: 10,
        },
        btnBig2: {
            flexDirection: 'row',
            backgroundColor: '#5C8AEA',
            justifyContent: 'space-between',
            alignItems: 'center',
            // borderRadiusTop: '8@ms',
            ...SHADOW_3,
            marginTop: 10,
            textAlign: 'center',
            borderRadius: '8@ms',
            padding: '10@vs',
            width: SIZES.WIDTH_WINDOW * 0.8,
        },
        borderLeft: {
            borderBottomLeftRadius: 5,
            borderTopLeftRadius: 5,
        },
        borderRight: {
            borderBottomRightRadius: '8@ms',
            borderTopRightRadius: '8@ms',
        },
        txtBigBtn: {
            color: Color.BG_BTN_CURRENT_LOCATION,
            fontSize: '19@ms0.3',
            fontWeight: 'bold',
            marginLeft: 10,
        },
        txtBigBtn2: {
            color: '#202124',
            fontSize: '19@ms0.3',
            fontWeight: 'bold',
            // marginLeft: 10,
        },
    });
};
export default styleScaled;
