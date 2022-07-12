import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { SHADOW_3, SIZES } from '../../../Utils/Values';

const style = (Color: any) =>
{
    return ScaledSheet.create({
        modal: {
            marginVertical: 0,
            marginHorizontal: 0,
        },
        btnClose: {
            width: '40@ms',
            height: '40@ms',
            backgroundColor: Color.BG_BTN_CLOSE,
            borderRadius: '25@ms',
            justifyContent: 'center',
            alignItems: 'center',
            top: SIZES.HEIGHT_STATUSBAR + moderateScale(35),
            right: '25@ms',
            position: 'absolute',
        },
        icClose: {
            fontSize: '25@ms0.3',
            color: Color.IC_CLOSE,
        },
        containerModal: {
            height: SIZES.HEIGHT_SCREEN,
            width: SIZES.WIDTH_WINDOW,
            alignItems: 'center',
            margin: 0,
            backgroundColor: Color.BG,
        },
        modalContent: {
            width: SIZES.WIDTH_WINDOW * 0.9,
            backgroundColor: 'white',
            borderRadius: 10,
            marginTop: SIZES.HEIGHT_SCREEN * 0.2,
            marginBottom: SIZES.HEIGHT_SCREEN * 0.2,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 5,
        },
        textInput: {
            backgroundColor: '#c4c4c440',
            borderRadius: 50,
            paddingHorizontal: 15,
            height: 40,
        },
        btn: {
            paddingHorizontal: 15,
            paddingVertical: 5,
            backgroundColor: '#c4c4c4',
            borderRadius: 20,
            ...SHADOW_3,
            flexDirection: 'row',
        },
        btn2: {
            paddingHorizontal: 15,
            paddingVertical: 5,
            backgroundColor: '#5C8AEA',
            borderRadius: 20,
            ...SHADOW_3,
            flexDirection: 'row',
        },
        viewBtn: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            marginTop: 20,
        },
        textBtn: {
            fontSize: 16,
            color: 'white',
        },
        textBtn2: {
            color: 'white',
            fontSize: 16,
        },
        textBtn3: {
            color: 'black',
            fontSize: 16,
        },
        hr: {
            height: 1,
            backgroundColor: 'gray',
            opacity: 0.6,
            marginVertical: 20,
        },
        row: {
            height: 100,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
        },
        avatar: {
            backgroundColor: '#c4c4c4',
            height: 70,
            width: 70,
            borderRadius: 99,
        },
        btn3: {
            width: '45%',
            height: 35,
            backgroundColor: '#c1c1c180',
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        btn4: {
            width: '45%',
            height: 35,
            backgroundColor: '#5C8AEA',
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        btn5: {
            width: '100%',
            height: 35,
            backgroundColor: '#c1c1c180',
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        viewBtn2: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingRight: 2,
        },
        viewScroll: {
            maxHeight: SIZES.HEIGHT_SCREEN * 0.45,
        },
    });
};
export default style;
