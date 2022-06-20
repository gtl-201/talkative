/* eslint-disable react/display-name */
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import Modal from 'react-native-modal';
import styleScaled from './style';
import { Pressable, Text, View } from 'react-native';
import { connect } from 'react-redux';

const ModalConfirm = forwardRef(({ color, title, description, textAction, onConfirm, language }, ref) =>
{
    const styles = styleScaled(color);
    const [visible, setVisible] = useState(false);

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

    const confirm = useCallback(() =>
    {
        close();
        onConfirm();
    }, [onConfirm]);

    return (
        <Modal
            isVisible={visible}
            animationIn={'fadeInUp'}
            animationInTiming={200}
            animationOutTiming={200}
            animationOut={'fadeOutDown'}
            backdropTransitionInTiming={200}
            backdropTransitionOutTiming={200}
            backdropColor={'black'}
            backdropOpacity={1}
            hasBackdrop={false}
            swipeDirection={'down'}
            style={styles.modal}
            hideModalContentWhileAnimating
            useNativeDriver
            statusBarTranslucent
            onSwipeComplete={() => setVisible(false)}
        >
            <View style={styles.containerModal}>
                <View style={styles.viewContent}>
                    <Text style={styles.txtTitle}>{title}</Text>
                    <Text style={styles.txtDescription}>{description}</Text>

                    <View style={styles.viewButton}>
                        <Pressable
                            style={styles.pressAble}
                            onPress={close}
                        >
                            <Text style={styles.txtCancel}>{language.CANCEL}</Text>
                        </Pressable>

                        <Pressable
                            style={styles.pressAble}
                            onPress={confirm}
                        >
                            <Text style={styles.txtConfirm}>{textAction}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

function mapStateToProps(state: any)
{
    return {
        color: state.controlApp.settings.color.MODAL_CONFIRM,
        language: state.controlApp.settings.language,
    };
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(ModalConfirm);
