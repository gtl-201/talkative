import { SHADOW_3, SIZES } from '../../../Utils/Values';
import { ScaledSheet } from 'react-native-size-matters';

const style = (Color: any) =>
{
    return ScaledSheet.create({
        container: {
            width: '100%',
            paddingTop: SIZES.HEIGHT_STATUSBAR,
            zIndex: 10,
        },
        colorBg: {
            backgroundColor: Color.BG,
        },
        shadow: {
            ...SHADOW_3,
        },
        headerView: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: '2@vs',
        },
        txtHeader: {
            flex: 1,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '18@ms0.3',
            color: Color.TXT,
        },
        txtHeader2: {
            fontSize: '20@ms0.3',
            fontWeight: 'bold',
            color: Color.TXT,
            marginBottom: '6@vs',
            letterSpacing: 1,
            paddingRight: 10,
            paddingLeft: 10,
            // textAlign: 'right',
            // backgroundColor: 'red',
            // alignSelf: 'center',
            maxWidth: '70%',
        },
        button: {
            width: '38@ms1',
            height: '38@ms1',
            borderRadius: '25@ms1',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
export default style;
