import { ScaledSheet } from 'react-native-size-matters';
const styleScaled = (Color: any) =>
{
    return ScaledSheet.create({
        container: {
            // alignItems: 'center',
            width: 'auto',
            overflow: 'visible',
        },
        containerItem: {
            width: '50@vs',
            flexDirection: 'row',
            marginVertical: '12@vs',
            position: 'relative',
            overflow: 'visible',
            marginLeft: 16,
        },
        avatar: {
            borderRadius: '8@ms',
            width: '46@vs',
            height: '46@vs',
            backgroundColor: Color.BG_AVATAR,
        },
        viewName: {
            marginHorizontal: '12@s',
            flex: 1,
            justifyContent: 'center',
        },
        txtNickname: {
            fontSize: '18@ms0.3',
            fontWeight: 'bold',
            color: Color.TXT_RESULT,
        },
        txtName: {
            fontSize: '15@ms0.3',
            color: Color.TXT_RESULT,
        },
    });
};
export default styleScaled;
