import React, {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import Modal from 'react-native-modal';
import styleScaled from './style';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from '../Icon';
import { connect } from 'react-redux';

const ModalFriends = forwardRef(({ url, color }, ref) =>
{
    const styles = styleScaled(color);
    const [visible, setVisible] = useState(false);
    const [handle, setHandle] = useState('all');
    const [data, setData] = useState<any>([]);

    useEffect(() =>
    {
        getData();
    }, []);

    const getData = () =>
    {
        const array = [];
        for (let i = 1; i < 30; i++)
        {
            array.push({
                id: i,
                name: `Nguyễn Văn ${i}`,
                point: 101 - i,
            });
        }
        setData(array);
    };
    useImperativeHandle(ref, () => ({
        show()
        {
            setVisible(true);
        },
        hide()
        {
            setVisible(false);
        },
    }));

    const close = useCallback(() => setVisible(false), []);
    const listFriends = () =>
    {
        return data.map((item, index) => (
            <TouchableOpacity
                key={index}
                activeOpacity={0.7}
            >
                <View style={styles.row}>
                    <View style={{ width: '25%' }}>
                        <View style={styles.avatar} />
                    </View>
                    <View style={{ marginLeft: 10, width: '75%' }}>
                        <View style={{ height: '40%' }}>
                            <Text
                                numberOfLines={2}
                                style={{ fontSize: 15, fontWeight: 'bold' }}
                            >
                                {item.name}
                            </Text>
                        </View>
                        {(handle === 'call' || handle === 'add') && (
                            <View style={styles.viewBtn2}>
                                <TouchableOpacity style={styles.btn4}>
                                    {handle === 'call'
                                        ? <Text style={styles.textBtn2}>Chấp nhận</Text>
                                        : <Text style={styles.textBtn2}>Thêm bạn</Text>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn3}>
                                    {handle === 'call'
                                        ? <Text style={styles.textBtn3}>Xóa</Text>
                                        : <Text style={styles.textBtn3}>Gỡ</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        ));
    };
    return (
        <Modal
            isVisible={visible}
            animationIn={'fadeInUp'}
            animationInTiming={400}
            animationOutTiming={400}
            animationOut={'fadeOutDown'}
            backdropTransitionInTiming={400}
            backdropTransitionOutTiming={400}
            backdropColor={'black'}
            backdropOpacity={1}
            hasBackdrop={false}
            // swipeDirection={'down'}
            style={styles.modal}
            hideModalContentWhileAnimating
            useNativeDriver
            statusBarTranslucent
            // onSwipeComplete={() => setVisible(false)}
        >
            <View style={styles.containerModal}>
                <View style={styles.modalContent}>
                    <View>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search..."
                        />
                    </View>
                    <View style={styles.viewBtn}>
                        <TouchableOpacity
                            style={handle === 'all' ? styles.btn2 : styles.btn}
                            onPress={() => setHandle('all')}
                        >
                            <Text style={handle === 'all' ? styles.textBtn2 : styles.textBtn}>
                Tất cả
                            </Text>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 10 }} />
                        <TouchableOpacity
                            style={handle === 'call' ? styles.btn2 : styles.btn}
                            onPress={() => setHandle('call')}
                        >
                            <Text style={handle === 'call' ? styles.textBtn2 : styles.textBtn}>
                Lời mời
                            </Text>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 10 }} />
                        <TouchableOpacity
                            style={handle === 'add' ? styles.btn2 : styles.btn}
                            onPress={() => setHandle('add')}
                        >
                            <Text style={handle === 'add' ? styles.textBtn2 : styles.textBtn}>
                Thêm bạn
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.hr} />
                    <View style={styles.viewScroll}>
                        <ScrollView>
                            {listFriends()}
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.btnClose}
                    onPress={close}
                >
                    <Icon
                        name="close"
                        style={styles.icClose}
                        type={'FontAwesome'}
                    />
                </TouchableOpacity>
            </View>
        </Modal>
    );
});

function mapStateToProps(state: any)
{
    return {
        color: state.controlApp.settings.color.MODAL_IMAGE,
    };
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(
    ModalFriends,
);
