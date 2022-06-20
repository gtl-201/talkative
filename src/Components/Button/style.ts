import { SHADOW_3, SIZES } from "../../Utils/Values";
import { ScaledSheet } from "react-native-size-matters";

const style = (Color: any) => {
  return ScaledSheet.create({
    btn: {
      padding: "5@vs",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 30,
      width: 55,
      height: 55,
    },
    txtBtn: {
      fontSize: "19@ms0.3",
      fontWeight: "bold",
      // marginLeft: 10
    },
  });
};
export default style;
