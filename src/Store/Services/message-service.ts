import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

async function getUserConversation(user: string | 'user' | 'group'): Promise<any>
{
    switch (user)
    {
        case 'user':
            return firestore()
                .collection('Conversation')
                .where('users', 'array-contains', auth().currentUser?.uid)
                .get()
                .then((res) =>
                {
                    let data: any = [];
                    if (res.docs)
                    {
                        data = res.docs.map((e: any) => e._data);
                    }
                    data = data.filter((e: any) => !e.isGroup);
                    return data;
                });
            break;
        case 'group':
            return firestore()
                .collection('Conversation')
                .where('users', 'array-contains', auth().currentUser?.uid)
                .get()
                .then((res) =>
                {
                    let data: any = [];
                    if (res.docs)
                    {
                        data = res.docs.map((e: any) => e._data);
                    }
                    data = data.filter((e: any) => e.isGroup);
                    return data;
                });
            break;

        default:
            return firestore()
                .collection('Conversation')
                .where('users', 'array-contains', auth().currentUser?.uid)
                .get()
                .then((res) =>
                {
                    let data: any = [];
                    if (res.docs)
                    {
                        data = res.docs.map((e: any) => e._data);
                    }
                    data = data.filter((e: any) => !e.isGroup);
                    return data;
                });
            break;
    }
}

async function getConversation(id: string): Promise<any>
{
    return firestore()
        .collection('Conversation')
        .doc(id)
        .get()
        .then((res) =>
        {
            return res.data();
        });
}

async function getTargetUsers(uid: string[]): Promise<any>
{
    return firestore()
        .collection('Users')
        .where('id', 'in', uid)
        .get()
        .then((res) =>
        {
            let data: any = [];
            if (res.docs)
            {
                data = res.docs.map((e: any) => e._data);
            }
            return data;
        });
}

async function getMessages(conversation: string): Promise<any>
{
    if (conversation)
    {
        return firestore()
            .collection('Messages')
            .where('conversation', '==', conversation)
            .orderBy('createdAt', 'desc')
            .get()
            .then((res) =>
            {
                let data: any = [];
                if (res.docs)
                {
                    data = res.docs.map((e: any) =>
                    {
                        return {
                            ...e._data,
                            createdAt: new Date(e._data.createdAt.seconds * 1000),
                        };
                    });
                }
                return data;
            });
    }
    else
    {
        return [];
    }
}

async function getNewestMessage(conversation: string): Promise<any>
{
    return firestore()
        .collection('Messages')
        .where('conversation', '==', conversation)
        .orderBy('createdAt', 'desc')
        .get()
        .then((res) =>
        {
            if (res.empty)
            {
                return { text: '', notifiState: false };
            }
            return {
                ...res.docs[0].data(),
                createdAt: new Date(res.docs[0].data().createdAt.seconds * 1000),
            };
        });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function setMessages(messages: any): Promise<any>
{
    firestore()
        .collection('Messages')
        .add({ ...messages, notifiState: true })
        .then((mess) =>
        {
            mess.update({ id: mess.id });
            console.log('Message added!');
        })
        .catch((error) => console.error(error));
}

async function setConversation(conversation: { isGroup: boolean; users: string[]; title: string; permission?: any })
{
    return await firestore()
        .collection('Conversation')
        .add(conversation)
        .then((result) =>
        {
            result.update({ id: result.id });
            return result.get();
        });
}

export const MessageService = {
    getConversation,
    getTargetUsers,
    getNewestMessage,
    getMessages,
    setMessages,
    getUserConversation,
    setConversation,
};
