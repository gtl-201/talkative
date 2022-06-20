import { ScaledSheet } from "react-native-size-matters";
import { SHADOW_3, SHADOW_5, SIZES } from "../../../Utils/Values";

const styleScaled = (Color: any) => {
  return ScaledSheet.create({
    container: {
      flexDirection: "row",
      // flex:1,
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingVertical: "8@ms",
      paddingHorizontal: "12@ms",
      // borderRadius: "40@ms",
      // ...SHADOW_3,
      backgroundColor: Color.BG,
      alignSelf: "center",
      zIndex: 1,
      marginTop: SIZES.HEIGHT_PADDINGTOP,
    },
    AppName: {
      fontSize: "20@ms0.6",
      fontWeight: "bold",
      color: Color.TXT_TITLE,
      marginBottom: "6@vs",
      letterSpacing: 2,
      paddingRight: 10,
    },
    touchAvatar: {
      paddingRight: 30,
      paddingVertical: 3,
    },
  });
};
export default styleScaled;
