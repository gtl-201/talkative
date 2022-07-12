import { firebase } from '@react-native-firebase/auth';
/* eslint-disable require-yield */
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserInfor } from '../../Models';
import moment from 'moment';

interface UserInforAction {
    type: any;
    userInfor: UserInfor;
}
interface MoreUserInfor {
    howKnowWe: string;
    level: string;
    whyLearn: string;
    purpose: string;
}

interface UploadAvatarAction {
    type?: any;
    path: string;
    name: string;
}

function* uploadAvatar({ path, name }: UploadAvatarAction)
{
    const res = {
        error: null,
        downloadUrl: null,
    };
    const referenceAvatar = storage().ref('images/avatars/' + name + '.jpg');

    const task = referenceAvatar.putFile(path);

    yield task
        .then(async () =>
        {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res.downloadUrl = await referenceAvatar.getDownloadURL();
        })
        .catch((reason) =>
        {
            res.error = reason;
        });

    return res;
}

async function uploadThumbnail({ path, name }: UploadAvatarAction)
{
    const res = {
        error: null,
        downloadUrl: null,
    };
    const referenceThumbnail = storage().ref('images/thumbnails/' + name + '.jpg');

    const task = referenceThumbnail.putFile(path);

    await task
        .then(async () =>
        {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res.downloadUrl = await referenceThumbnail.getDownloadURL();
        })
        .catch((reason) =>
        {
            res.error = reason;
        });

    return res;
}

function setUserInfo(uInfor: MoreUserInfor)
{
    firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .set(uInfor)
        .then(() =>
        {
            console.log('new added');
        });
}

function* setInfor({ userInfor }: UserInforAction)
{
    firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .set(userInfor)
        .then(() =>
        {
            console.log('User added!');
        });

    firestore()
        .collection('UserLites')
        .doc(auth().currentUser?.uid)
        .set({
            id: userInfor.id,
            nickname: userInfor.nickname,
            name: userInfor.name,
            thumbnail: userInfor.thumbnail,
            gender: userInfor.gender,
            howKnowWe: '',
            level: '',
            whyLearn: '',
            purpose: '',
        })
        .then(() =>
        {
            console.log('UserLite added!');
        })
        .catch((e) => console.log(e));

    const durationCreateTS = moment.duration(moment(new Date()).diff(moment(userInfor.create_ts))).asHours();

    if (durationCreateTS < 0.1)
    {
        firestore()
            .collection('Statistics')
            .doc('counter')
            .get()
            .then((querySnapshot) =>
            {
                const data = querySnapshot.data();
                firestore()
                    .collection('Statistics')
                    .doc('counter')
                    .update({ b_user: data?.b_user + 1 })
                    .then(() =>
                    {
                        console.log('Statistics b_user updated!');
                    });
            });
    }
}

function* updateInfor({ userInfor }: UserInforAction)
{
    firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .update(userInfor)
        .then(() =>
        {
            console.log('User updated!');
        });

    if (userInfor.name)
    {
        firestore()
            .collection('UserLites')
            .doc(auth().currentUser?.uid)
            .update({ name: userInfor.name })
            .then(() =>
            {
                console.log('UserLite updated!');
            });
    }

    if (userInfor.thumbnail)
    {
        firestore()
            .collection('UserLites')
            .doc(auth().currentUser?.uid)
            .update({ thumbnail: userInfor.thumbnail })
            .then(() =>
            {
                console.log('UserLite updated!');
            });
    }

    if (userInfor.gender)
    {
        firestore()
            .collection('UserLites')
            .doc(auth().currentUser?.uid)
            .update({ gender: userInfor.gender })
            .then(() =>
            {
                console.log('UserLite updated!');
            });
    }
}

async function getUserInfor(_id: String)
{
    const data = await firestore()
        .collection('Users')
        .doc((auth().currentUser?.uid as any) ?? _id)
        .get();

    const userData = { ...data.data() };
    userData.create_ts = data.data()?.create_ts?.toDate() || null;
    userData.dob = data.data()?.dob?.toDate() || null;
    userData.posts = data.data()?.posts.map((item) =>
    {
        return { ...item, create_ts: item.create_ts?.toDate() || null };
    });
    return userData;
}

async function getUidUserInfor(_id: string): Promise<any>
{
    const data = await firestore().collection('Users').doc(_id).get();

    const userData = { ...data.data() };
    userData.create_ts = data.data()?.create_ts?.toDate() || null;
    userData.dob = data.data()?.dob?.toDate() || null;
    userData.posts = data.data()?.posts.map((item) =>
    {
        return { ...item, create_ts: item.create_ts?.toDate() || null };
    });
    return userData;
}
async function getUidUserLiteInfor(_id: string): Promise<any>
{
    const data = await firestore().collection('UserLites').doc(_id).get();

    return data.data();
}
async function getUidUserOnline()
{
    return await firestore()
        .collection('OnlineList')
        .where('id', '!=', firebase.auth().currentUser?.uid)
        .get()
        .then((querySnapshot) =>
        {
            return querySnapshot.docs.map((item) => item.data());
        });
}

async function getUserMeetingCaller(_id: String)
{
    const data = await firestore()
        .collection('meet')
        .doc('conversation')
        .collection('history')
        .where('idCaller', '==', (auth().currentUser?.uid as any) ?? _id)
        .get();

    return data.docs.map((doc) => doc.data());
}
async function getUserMeetingCallee(_id: String)
{
    const data = await firestore()
        .collection('meet')
        .doc('conversation')
        .collection('history')
        .where('idCallee', '==', (auth().currentUser?.uid as any) ?? _id)
        .get();

    return data.docs.map((doc) => doc.data());
}

async function getUidUserMeetingCaller(id: String)
{
    const data = await firestore().collection('meet').doc('conversation').collection('history').where('idCaller', '==', id).get();

    return data.docs.map((doc) => doc.data());
}
async function getUidUserMeetingCallee(id: String)
{
    const data = await firestore().collection('meet').doc('conversation').collection('history').where('idCallee', '==', id).get();

    return data.docs.map((doc) => doc.data());
}

export async function checkNickname(nickname: string): Promise<boolean>
{
    return firestore()
        .collection('Users')
        .where('nickname', '==', nickname)
        .get()
        .then((querySnapshot) =>
        {
            return querySnapshot.size > 0;
        });
}

export async function getAllUser()
{
    return await firestore()
        .collection('UserLites')
        .get()
        .then((querySnapshot) =>
        {
            return querySnapshot.docs.map((item) => item.data());
        });
}

export async function getUserById(id: string)
{
    return await firestore()
        .collection('UserLites')
        .doc(id)
        .get()
        .then((x) =>
        {
            return x.data();
        });
}
export async function getAllUsers()
{
    return await firestore()
        .collection('Users')
        .get()
        .then((querySnapshot) =>
        {
            return querySnapshot.docs.map((item) => item.data());
        });
}

export async function getUsersById(id: string)
{
    return await firestore()
        .collection('Users')
        .doc(id)
        .get()
        .then((x) =>
        {
            return x.data();
        });
}

export async function getAllGate()
{
    return await firestore()
        .collection('Quest')
        .get()
        .then((querySnapshot) =>
        {
            const data: any[] = [];
            const data2 = querySnapshot.docs.map((item) => item.data());

            querySnapshot.forEach((item, index) => data.push({ id: item.id, data: data2[index] }));
            return data;
        });
}

export async function getAllRound(gate: string)
{
    return await firestore()
        .collection('Quest')
        .doc(gate)
        .get()
        .then((data) =>
        {
            return data.data();
        });
}

export async function getLevel(gate: string, round: string)
{
    return await firestore()
        .collection('Quest')
        .doc(gate)
        .collection(round)
        .get()
        .then((querySnapshot) =>
        {
            return querySnapshot.docs.map((item) => item.id);
        });
}

export async function getQuest(gate: string, round: string, level: string)
{
    return await firestore()
        .collection('Quest')
        .doc(gate)
        .collection(round)
        .doc(level)
        .collection('listQuest')
        .get()
        .then((querySnapshot) =>
        {
            return querySnapshot.docs.map((item) => item.data());
        });
}
export async function sendRequestFriends(id: string)
{
    return await firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .update({ requestSent: [id] })
        .then(async() =>
        {
            return await firestore()
                .collection('Users')
                .doc(id)
                .update({ request: [{ id: auth().currentUser?.uid,name: auth().currentUser?.displayName }] })
                .then(() =>
                {
                    console.log('sendRequestFriends success!');
                    return true;
                });
        });
}
export async function acceptRequestFriends(id: string,name: string,arrayRequest: any,arrayRequestSent: any)
{
    return await firestore()
        .collection('Users')
        .doc(id)
        .update({ requestSent: arrayRequestSent })
        .then(async() =>
        {
            return await firestore()
                .collection('Users')
                .doc(auth().currentUser?.uid)
                .update({ request: arrayRequest })
                .then(async() =>
                {
                    return await firestore()
                        .collection('Users')
                        .doc(auth().currentUser?.uid)
                        .update({ friends: [{ id: id,name: name }] })
                        .then(async() =>
                        {
                            return await firestore()
                                .collection('Users')
                                .doc(id)
                                .update({ friends: [{ id: auth().currentUser?.uid,name: auth().currentUser?.displayName }] })
                                .then(() =>
                                {
                                    console.log('acceptRequestFriends success!');
                                    return true;
                                });
                        });
                
                });
        });
    
}
export async function cancelRequestFriends(id: string,arrayRequest: any,arrayRequestSent: any)
{
    return await firestore()
        .collection('Users')
        .doc(id)
        .update({ request: arrayRequest })
        .then(async() =>
        {
            return await firestore()
                .collection('Users')
                .doc(auth().currentUser?.uid)
                .update({ requestSent: arrayRequestSent })
                .then(() =>
                {
                    console.log('cancelRequestFriends success!');
                    return true;
                });
        });
}
export async function removeRequestFriends(id: string,arrayRequest: any,arrayRequestSent: any)
{
    return await firestore()
        .collection('Users')
        .doc(id)
        .update({ requestSent: arrayRequestSent })
        .then(async() =>
        {
            return await firestore()
                .collection('Users')
                .doc(auth().currentUser?.uid)
                .update({ request: arrayRequest })
                .then(() =>
                {
                    console.log('removeRequestFriends success!');
                    return true;
                });
        });
}
export async function cancelFriends(id: string,myFriends: any,yourFriends: any)
{
    return await firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .update({ friends: myFriends })
        .then(async() =>
        {
            return await firestore()
                .collection('Users')
                .doc(id)
                .update({ friends: yourFriends })
                .then(() =>
                {
                    console.log('cancelFriends success!');
                    return true;
                });
        });
}

export async function getAchievements()
{
    return await firestore()
        .collection('achievements')
        .get()
        .then((querySnapshot) =>
        {
            return querySnapshot.docs.map((item) => item.data());
        });
}

export async function updateArchivement(field?: any)
{
    // console.log(field, '99999');
    
    return await firestore()
        .collection('achievements')
        .doc(auth().currentUser?.uid)
        .update(field ?? undefined)
        .then(() =>
        {
            console.log('Archivments updated!');
        });
}

export const UserServices = {
    uploadAvatar,
    uploadThumbnail,
    setInfor,
    updateInfor,
    checkNickname,
    getUserInfor,
    getAllUser,
    getUserMeetingCaller,
    getUserMeetingCallee,
    getUidUserInfor,
    getUserById,
    getUidUserMeetingCaller,
    getUidUserMeetingCallee,
    getUidUserOnline,
    getUidUserLiteInfor,
    getAllGate,
    getAllRound,
    getLevel,
    getQuest,
};
