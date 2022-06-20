import { mediaDevices } from "react-native-webrtc";
export default class Utils {
  static async getStream(calleeId: string) {
    let isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();
    // console.log('sourceInfos: ',sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (
        sourceInfo.kind == "videoinput" &&
        sourceInfo.facing == (isFront ? "front" : "environment")
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 60,
        facingMode: isFront ? "user" : "environment",
        deviceId: videoSourceId,
      },
      calleeId,
    });
    // .then(stream => {
    //     // Got stream!
    //     console.log('stream is:',stream)
    // })
    // .catch(error => {
    //     // Log error
    //     console.error('this err at stream: ',error)
    // });
    if (typeof stream !== "boolean") {
      return stream;
    }
    return null;
  }
}
