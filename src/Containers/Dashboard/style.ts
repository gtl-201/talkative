import { ScaledSheet } from "react-native-size-matters";
import { SIZES } from "../../Utils/Values";

const styleScaled = (Color: any) => {
  return ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.BG,
      paddingBottom: "10@vs",
      marginTop: -SIZES.HEIGHT_STATUSBAR,
    },
  });
};
export default styleScaled;
