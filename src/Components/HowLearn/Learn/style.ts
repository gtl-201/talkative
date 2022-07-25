import { SHADOW_7, SHADOW_5, SHADOW_0, SHADOW_1 } from './../../../Utils/Values/shadows';
import { ScaledSheet } from 'react-native-size-matters';
import { SHADOW_2, SHADOW_3, SIZES } from '../../../Utils/Values';

const styleScaled = (Color: any) =>
{
    return ScaledSheet.create({
        bgColor: {
            backgroundColor: Color.BG,
            // backgroundColor: 'pink',
            flex: 1,
        },
        container: {
            // flexDirection: "row",
            // justifyContent: "space-between",
            flex: 1,
            alignItems: 'center',
            width: '100%',
            paddingVertical: '8@ms',
            paddingHorizontal: '12@ms',
            // borderRadius: "40@ms",
            // ...SHADOW_3,
            alignSelf: 'center',
            zIndex: 1,
            marginTop: (SIZES.HEIGHT_STATUSBAR ?? 0) + 10,
            position: 'relative',
        },
       
    });
};
export default styleScaled;
