import { ScaledSheet } from 'react-native-size-matters';
import { SHADOW_2, SHADOW_3, SIZES } from '../../../Utils/Values';

const styleScaled = (Color: any) =>
{
    return ScaledSheet.create({
        container: {
            // flex: 1,
            // height: 'auto',
            backgroundColor: Color.BG,
            // marginTop: SIZES.HEIGHT_STATUSBAR,
            alignItems: 'center',
        },
        btnBig: {
            // width: "90%",
            flexDirection: 'row',
            backgroundColor: '#5C8AEA',
            paddingVertical: '12@vs',
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8@ms',
            marginBottom: '15@vs',
            ...SHADOW_3,
        },
        txtBigBtn: {
            color: 'white',
            fontSize: '19@ms0.3',
            fontWeight: 'bold',
            marginLeft: 10,
        },
        txtBigBtn2: {
            color: 'white',
            fontSize: '19@ms0.3',
            fontWeight: 'bold',
            marginLeft: 10,
        },
    });
};
export default styleScaled;
