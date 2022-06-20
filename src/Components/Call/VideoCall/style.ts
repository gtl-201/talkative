import { SHADOW_3, SIZES } from "../../../Utils/Values";
import { ScaledSheet } from "react-native-size-matters";
import { scale } from "react-native-size-matters";

const style = (Color: any) => {
  return ScaledSheet.create({
    container: {
      // paddingTop: (SIZES.HEIGHT_STATUSBAR ?? 20) + 20,
      width: "100%",
      // paddingTop: SIZES.HEIGHT_STATUSBAR,
      backgroundColor: Color.BG,
      zIndex: 1,
      // marginTop: -50,
      flex: 1,
    },
    header: {
      position: "absolute",
      top: 0,
    },
    avatar: {
      width: "100%",
      height: "100%",
      backgroundColor: "pink",
      // zIndex: 10,
      // marginTop: -40
    },
    btn: {
      backgroundColor: "#3d3f3f",
      padding: "5@vs",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 30,
      width: 55,
      height: 55,
    },
    txtBtn: {
      color: Color.IC_WHITE,
      fontSize: "19@ms0.3",
      fontWeight: "bold",
      // marginLeft: 10
    },
    nameAinfo: {
      position: "absolute",
      width: "100%",
      top: 100,
    },
    name: {
      paddingTop: (SIZES.HEIGHT_STATUSBAR ?? 20) + 20,
      color: Color.TITLE,
      fontSize: "18@ms0.7",
      fontWeight: "bold",
      width: "100%",
      textAlign: "center",
    },
    imagePreview: {
      width: SIZES.WIDTH_WINDOW,
      height: SIZES.HEIGHT_SCREEN,
      opacity: 0.5,
      backgroundColor: '#666',
      justifyContent: 'center',
      alignItems:'center',
      // marginVertical: "15@vs",
      // borderRadius: "5@ms",
      alignSelf: "center",
    },
    imgCon:{
      width: SIZES.WIDTH_WINDOW,
      height: SIZES.HEIGHT_SCREEN,
      backgroundColor:'#66666666',
      position: 'absolute',
      top: 0,
      zIndex: -1,
    },
    info: {
      // color: Color.SEARCHBAR_TXT_SEARCH,
      fontSize: "14@ms0.3",
      fontWeight: "bold",
      width: "100%",
      textAlign: "center",
    },
    bottomContainer: {
      backgroundColor: "#272929",
      opacity: 0.9,
      position: "absolute",
      bottom: 0,
      width: "100%",
      paddingVertical: 20,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      ...SHADOW_3,
    },
    flexRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    btnRed: {
      backgroundColor: "#f94332",
      padding: "5@vs",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 30,
      width: 55,
      height: 55,
    },
    video: {
      width: "100%",
      height: "100%",
      transform: [{rotateX: '180deg'}],
    },
    videoLocal: {
      width: 100,
      height: 130,
      backgroundColor: "green",
      position: "absolute",
      top: (SIZES.HEIGHT_STATUSBAR ?? 0) + 60,
      zIndex: 10,
      left: 20,
      borderRadius: 5,
      transform: [{rotateX: '180deg'}],
    },
  });
};
export default style;
