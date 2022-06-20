import { SHADOW_3 } from './../../../Utils/Values/shadows';
import { ScaledSheet, verticalScale } from "react-native-size-matters";
import { SIZES } from "../../../Utils/Values";
import { Dimensions } from 'react-native';

const styleScaled = (Color: any) => {
  return ScaledSheet.create({
    container: {
      width: SIZES.WIDTH_WINDOW,
      height: SIZES.WIDTH_WINDOW * 1.15,
      justifyContent: "flex-end",
    },
    routerButton: {
      width: "46@ms",
      height: "46@ms",
      backgroundColor: Color.INFOR_BG_ROUTERBUTTON,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "25@ms",
      position: "absolute",
      top: SIZES.HEIGHT_PADDINGTOP + verticalScale(15),
    },
    containerInfor: {
      bottom: SIZES.WIDTH_WINDOW * 0.15 + verticalScale(60),
      width: SIZES.WIDTH_WINDOW * 0.75,
      alignSelf: "center",
    },
    textNickname: {
      color: Color.INFOR_TXT_INFOR,
      fontSize: "30@ms0.3",
      fontWeight: "bold",
      marginBottom: "10@vs",
    },
    textName: {
      color: Color.INFOR_TXT_INFOR,
      fontSize: "18@ms0.3",
    },
    textDob: {
      color: Color.INFOR_TXT_INFOR,
      fontSize: "18@ms0.3",
      marginBottom: "10@vs",
    },
    textDescription: {
      color: Color.INFOR_TXT_INFOR,
      fontSize: "15@ms0.3",
    },
    textTag: {
      color: Color.INFOR_TXT_LIGHT_TAG,
      fontSize: "15@ms0.3",  
      backgroundColor: Color.IC_EMPTY,
      ...SHADOW_3,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      alignItems:'center',
      justifyContent: 'center',
      marginVertical: 5,
      marginHorizontal: 3,
    },
    tagContainer:{
      width: Dimensions.get('window').width,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      marginTop: -60, paddingTop: 15,
      paddingHorizontal: 15,
      zIndex: 2,
    },
    allCall:{
     

    },
    icContainer:{
      // marginRight: 5
      // paddingRight: 5,
    },
  });
};
export default styleScaled;
