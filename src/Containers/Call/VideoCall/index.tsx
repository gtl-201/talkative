import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import { useFocusEffect } from '@react-navigation/native';
import { bindActionCreators } from 'redux';

import Header from '../../../Components/BaseComponents/Header';
import * as ControlAppActions from '../../../Store/Actions/control-app-actions';
import styleScaled from './style';

import { EventOnAddStream, MediaStream, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
import GettingCall from '../../../Components/Call/VideoCall/gettingCall';
import VideoCallComponent from '../../../Components/Call/VideoCall';
import VideoCallUtils from '../../../Utils/VideoCall';
// import { event } from "react-native-reanimated";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { moderateScale } from 'react-native-size-matters';
import Icon from '../../../Components/BaseComponents/Icon';
import InCallManager from 'react-native-incall-manager';
import moment from 'moment';
import { ShowToast } from '../../../Utils/Helpers';
import SoundRecorder from 'react-native-sound-recorder';
import SoundPlayer from 'react-native-sound-player';
import { MMKV } from 'react-native-mmkv';
import OnlineList from '../../../Components/Home2/OnlineList';

// import {AudioRecorder, AudioUtils} from 'react-native-audio';

const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

const VideoCall: FC<any> = (props) =>
{
    const { color2, userInfor, navigation, setBackgroundScreenDrawer, color, language, route, onCall, onHangup } = props;
    const styles = styleScaled(color);
    const refViewShot: any = useRef();

    const [staticIdCaller, setStaticIdCaller] = useState(undefined);
    const [inRing, setInRing] = useState(false);
    const [amCaller, setAmCaller] = useState(false);
    const ringBack = () =>
    {
        try
        {
            SoundPlayer.playUrl(
                'https://firebasestorage.googleapis.com/v0/b/spearker-d3cc4.appspot.com/o/audio%2FringCall%2FwaittingCall1.mp3?alt=media&token=ece0fa1f-0768-48bb-9190-14820c189c16',
            );
        }
        catch (error)
        {
            console.log(error);
        }
    };
    const ringTone = () =>
    {
        try
        {
            SoundPlayer.playUrl(
                'https://firebasestorage.googleapis.com/v0/b/spearker-d3cc4.appspot.com/o/audio%2FringCall%2FringTone1.mp3?alt=media&token=d2274cd0-f1e4-4cd5-b4ab-83d514951cec',
            );
        }
        catch (error)
        {
            console.log(error);
        }
    };

    const storage = new MMKV();
    useEffect(() =>
    {
        const cRef = firestore().collection('meet');
        // const URef = firestore().collection('meet').doc('chatId').collection('calling');

        const subcribe = cRef.onSnapshot(async (snapShot: any) =>
        {
            let offer: any = undefined;
            let answer: any = undefined;
            let staticId: any = undefined;
            let idAnswerAvaiable: any = undefined;
            let isRandomCall: any = true;

            await cRef.get().then((t) =>
            {
                t.forEach((z: any) =>
                {
                    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<');

                    console.log(z.get('answer'), 'answer');
                    console.log(z.get('offer')?.id, 'offer');
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>');

                    if (z.get('answer') === undefined)
                    {
                        console.log('answer');

                        offer = z.data();
                        // setIdCaller(z.data()?.offer?.id);
                        staticId = z.data()?.offer?.id;
                        // return false;
                    }
                    else if (
                        z.get('answer') !== undefined &&
                        z.get('offer') !== undefined &&
                        (z.data()?.offer?.id === firebase.auth().currentUser?.uid || z.data()?.answer?.id === firebase.auth().currentUser?.uid)
                    )
                    {
                        offer = z.data();
                        staticId = z.data()?.offer?.id;
                    }
                });
            });

            await cRef
                .doc(firebase.auth().currentUser?.uid)
                .get()
                .then((t) =>
                {
                    answer = t.data();
                });

            await cRef
                .where('isRand', '==', false)
                .get()
                .then((t) =>
                {
                    // idAnswerAvaiable = t.data()?.idAnswerIs;
                    let data: any = undefined;
                    // console.error(t.docs.length);

                    t && t.docs.length > 0 ? (isRandomCall = false) : (isRandomCall = true);
                    t && t.docs.length > 0 && (data = t.docs.filter((x) => x.data().idAnswerIs === firebase.auth().currentUser?.uid));
                    // const hie = t && t.docs.length > 0 && t.docs[0].data().idAnswerIs;
                    idAnswerAvaiable = data && data.length > 0 && (data[0].data().idAnswerIs ?? undefined);
                    // console.log(idAnswerAvaiable, '????????????????');
                    // console.log(data[0].data().idAnswerIs, '????????????????');
                });

            staticId !== undefined && setStaticIdCaller(staticId);

            if (!offer?.offer?.id && !answer?.answer?.id && !staticId)
            {
                hangup();
            }
            /// console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
            /// console.error(offer?.offer?.id ?? 'undifind', 'offer is');
            /// console.error(answer?.answer?.id ?? 'undifind', 'answer is');
            /// console.error(staticId ?? 'undifind', 'staticId is');
            /// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

            // Your call accepted by someone
            if (pc.current && !pc.current.remoteDescription && answer && answer.answer)
            {
                console.log('call accept');
                // startRecord(moment().unix().toString());
                pc.current.setRemoteDescription(new RTCSessionDescription(answer.answer));
                // InCallManager.stopRingtone();
                SoundPlayer.stop();
                setInRing(false);
                InCallManager.start({ media: 'music' });
            }

            // Some one call you
            // console.log(storage.getString('switchIc'), '6666666666666666666666660');
            if (
                offer &&
                offer.offer &&
                !connecting.current &&
                idAnswerAvaiable !== undefined &&
                idAnswerAvaiable !== '' &&
                idAnswerAvaiable === firebase.auth().currentUser?.uid &&
                isRandomCall === false
            )
            {
                console.log('call got each Person');

                onCall !== undefined && onCall();
                setGettingCall(true);
                // InCallManager.startRingtone('_BUNDLE_');
                ringTone();
                setInRing(true);
            }
            else if (offer && offer.offer && !connecting.current && storage.getString('switchIc') === 'toggle-on' && isRandomCall === true)
            {
                console.log('call got RANDOM');

                onCall !== undefined && onCall();
                setGettingCall(true);
                // InCallManager.startRingtone('_BUNDLE_');
                ringTone();
                setInRing(true);
            }
        });

        return () =>
        {
            subcribe();
        };
    }, []);

    useFocusEffect(
        React.useCallback(() =>
        {
            setTimeout(() =>
            {
                refViewShot.current.capture().then((image: any) =>
                {
                    setBackgroundScreenDrawer(image);
                });
            }, 1000);
        }, []),
    );
    useFocusEffect(
        React.useCallback(() =>
        {
            BackHandler.addEventListener('hardwareBackPress', () => true);
            return () => BackHandler.removeEventListener('hardwareBackPress', () => true);
        }, []),
    );

    const startRecord = (fileName: string) =>
    {
        // , {
        //     quality: SoundRecorder.QUALITY_MAX,
        //     format: SoundRecorder.FORMAT_AAC_ADTS,
        // }
        console.log(SoundRecorder.PATH_DOCUMENT, 'doc');
        console.log(SoundRecorder.PATH_LIBRARY, 'lib');
        console.log(SoundRecorder.PATH_CACHE, 'cache');

        SoundRecorder.start('/storage/emulated/0/Android/data/com.speaker' + '/' + fileName + '.mp3').then(() =>
        {
            console.log('started recording');
        });
    };
    const stopRecord = () =>
    {
        console.log(SoundRecorder.PATH_DOCUMENT, 'doc');
        console.log(SoundRecorder.PATH_LIBRARY, 'lib');
        console.log(SoundRecorder.PATH_CACHE, 'cache');

        SoundRecorder.stop().then((result) =>
        {
            console.log('stopped recording, audio file saved at: ' + result.path);
        });
    };

    const [localStream, setLocalStream] = useState<MediaStream | null>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
    const [gettingCall, setGettingCall] = useState(false);
    const pc = useRef<RTCPeerConnection>();
    const connecting = useRef(false);

    const setupWebRtc = async () =>
    {
        pc.current = new RTCPeerConnection(configuration);

        // get audio and stream for call
        const stream = await VideoCallUtils.getStream();
        if (stream)
        {
            setLocalStream(stream);
            pc.current.addStream(stream);
        }

        // get remote stream one it is avaiable
        pc.current.onaddstream = (event: EventOnAddStream) =>
        {
            setRemoteStream(event.stream);
        };
    };

    const create = async () =>
    {
        console.log('====================CREATE====================');
        setAmCaller(true);
        // InCallManager.startRingtone('_BUNDLE_');
        ringBack();
        setInRing(true);
        onCall !== undefined && onCall();
        console.log('calling');
        connecting.current = true;
        // document for call
        const cRef = firestore().collection('meet').doc(firebase.auth().currentUser?.uid);

        // setup webRtc
        await setupWebRtc();

        if (pc.current)
        {
            const offer = await pc.current.createOffer();
            pc.current.setLocalDescription(offer);
            if (storage.getString('idAnswer') !== undefined && storage.getString('idAnswer') !== '')
            {
                const cWidthOffer = {
                    offer: {
                        type: offer.type,
                        sdp: offer.sdp,
                        id: firebase.auth().currentUser?.uid,
                        name: firebase.auth().currentUser?.displayName,
                    },
                    idAnswerIs: storage.getString('idAnswer'),
                    isRand: false,
                };

                cRef.set(cWidthOffer).then((snap) => {});
            }
            else
            {
                const cWidthOffer = {
                    offer: {
                        type: offer.type,
                        sdp: offer.sdp,
                        id: firebase.auth().currentUser?.uid,
                        name: firebase.auth().currentUser?.displayName,
                    },
                    isRand: true,
                };

                cRef.set(cWidthOffer).then((snap) => {});
            }
        }
        // exchange ICE candidates between the caller and callee
        collectIceCandidates(cRef, 'caller', 'callee');
        // setTimeout(() =>
        // {
        //     // if (inRing)
        //     // {
        //     //     ShowToast('info', language.WARNNING, language.NO_ONE_ACCEPT_CALL);
        //     //     hangup();
        //     // }
        //     console.log(inRing,'???????????????????????????????????????????');
        // }, 20);
    };
    const join = async () =>
    {
        // InCallManager.stopRingtone();
        SoundPlayer.stop();
        setInRing(false);
        InCallManager.start({ media: 'music' });
        onCall !== undefined && onCall();
        console.log('joinning');
        connecting.current = true;
        setGettingCall(false);

        const cRef = firestore().collection('meet').doc(staticIdCaller);
        const offer = (await cRef.get()).data()?.offer;

        if (offer)
        {
            await setupWebRtc();

            collectIceCandidates(cRef, 'callee', 'caller');

            if (pc.current)
            {
                pc.current.setRemoteDescription(new RTCSessionDescription(offer));

                const answer = await pc.current.createAnswer();
                pc.current.setLocalDescription(answer);
                const cWithAnswer = {
                    answer: {
                        id: firebase.auth().currentUser?.uid,
                        type: answer.type,
                        sdp: answer.sdp,
                        timeStart: moment().unix(),
                        name: firebase.auth().currentUser?.displayName,
                    },
                };

                cRef.update(cWithAnswer);
            }
        }
    };
    const hangup = async () =>
    {
        storage.set('idAnswer', '');
        if (amCaller === true)
        {
            // stopRecord();
            setAmCaller(false);
        }

        InCallManager.stop();
        // InCallManager.stopRingtone();
        SoundPlayer.stop();
        setInRing(false);
        onHangup !== undefined && onHangup();
        console.log('hangup');
        setGettingCall(false);
        connecting.current = false;
        streamCleanUp();
        firesotreCleanUp();
        if (pc.current)
        {
            pc.current.close();
        }
    };

    const hangupAndSaveHistory = async () =>
    {
        storage.set('idAnswer', '');
        if (amCaller === true)
        {
            // stopRecord();
            setAmCaller(false);
        }
        InCallManager.stop();
        // InCallManager.stopRingtone();
        SoundPlayer.stop();
        setInRing(false);
        onHangup !== undefined && onHangup();
        console.log('hangup');
        setGettingCall(false);
        connecting.current = false;

        await firestore()
            .collection('meet')
            .doc(staticIdCaller)
            .get()
            .then((data) =>
            {
                const dataData = data.data();
                const saveAvaible = {
                    idCaller: dataData?.offer?.id ?? '',
                    idCallee: dataData?.answer?.id ?? '',
                    nameCaller: dataData?.offer.name ?? '',
                    nameCallee: dataData?.answer.name ?? '',
                    start: dataData?.answer.timeStart ?? '',
                    end: moment().unix(),
                };
                firestore()
                    .collection('meet')
                    .doc('conversation')
                    .collection('history')
                    .add(saveAvaible)
                    .then((rs) =>
                    {
                        rs.update({ id: rs?.id });
                    });
                console.log(saveAvaible, 'data to save');
            });

        streamCleanUp();
        firesotreCleanUp();
        if (pc.current)
        {
            pc.current.close();
        }
    };

    // helper Func
    const streamCleanUp = async () =>
    {
        // console.error('clear stream');

        if (localStream)
        {
            localStream.getTracks().forEach((t) => t.stop());
            localStream.release();
        }
        setLocalStream(null);
        setRemoteStream(null);
        setStaticIdCaller(undefined);
    };

    const firesotreCleanUp = async () =>
    {
        // console.error('clear fireStore');
        const cRef = firestore().collection('meet').doc(staticIdCaller);
        if (cRef)
        {
            const calleeCandidate = await cRef.collection('callee').get();
            calleeCandidate.forEach(async (candidate) =>
            {
                await candidate.ref.delete();
                // console.log('remove callee');
            });

            const callerCandidate = await cRef.collection('caller').get();
            callerCandidate.forEach(async (candidate) =>
            {
                await candidate.ref.delete();
                // console.log('remove caller');
            });
            cRef.delete();
        }
    };

    const collectIceCandidates = async (cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>, localName: string, remoteName: string) =>
    {
        const candiedateCollection = cRef.collection(localName);
        console.error('join collecIce');

        if (pc.current)
        {
            // on new ICE add it to firestore
            pc.current.onicecandidate = (event) =>
            {
                if (event.candidate)
                {
                    candiedateCollection.add(event.candidate);
                }
            };
        }

        // get candidate added to fireStore and update to localPC
        cRef.collection(remoteName).onSnapshot((snapshot) =>
        {
            snapshot.docChanges().forEach((change: any) =>
            {
                if (change.type == 'added')
                {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current?.addIceCandidate(candidate);
                }
            });
        });
    };

    // display waiting component
    const WaitingComponent = (): JSX.Element =>
    {
        return (
            <GettingCall
                hangup={hangup}
                join={join}
            />
        );
    };

    // display both stream
    const BothStream = (): JSX.Element =>
    {
        return (
            <VideoCallComponent
                hangup={hangup}
                hangupAndSave={hangupAndSaveHistory}
                localStream={localStream}
                remoteStream={remoteStream}
            />
        );
    };

    // End call
    return (
        <ViewShot
            ref={refViewShot}
            style={[styles.container, { flex: 1 }]}
            options={{ result: 'base64', quality: 0.5 }}
        >
            {!gettingCall && !localStream && (
                <>
                    {onCall === undefined && onHangup === undefined && (
                        <Header
                            title={''}
                            shadow={false}
                        />
                    )}
                    <TouchableOpacity
                        style={styles.btnBig}
                        onPress={create}
                    >
                        <Icon
                            type={'MaterialIcons'}
                            name={'call'}
                            size={moderateScale(30, 0.5)}
                            color={'white'}
                        />
                        <Text style={styles.txtBigBtn}>{language?.RanCall}</Text>
                    </TouchableOpacity>
                    <OnlineList
                        color={color2}
                        language={language}
                        navigation={navigation}
                        userInfor={userInfor}
                        onCallPerson={() => create()}
                    />
                </>
            )}

            {/* <GettingCall hangup={hangup} join={join} /> */}
            {/* <VideoCallComponent hangup={hangup} localStream={localStream} remoteStream={remoteStream}/> */}
            {gettingCall && <WaitingComponent />}
            {localStream && <BothStream />}
        </ViewShot>
    );
};

function mapStateToProps(state: any)
{
    return {
        color: state.controlApp.settings.color.VIDEOCALL,
        color2: state.controlApp.settings.color.HOME,
        userInfor: state.user.userInfor,
        language: state.controlApp.settings.language,
    };
}

function mapDispatchToProps(dispatch: any)
{
    return {
        setBackgroundScreenDrawer: bindActionCreators(ControlAppActions.setBackgroundScreenDrawer, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoCall);
