import React, { FC, memo, useCallback, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styleScaled from './style';
import { numberHelpers } from '../../../Utils/Helpers';
import ModalFriends from '../../BaseComponents/ModalFriends';

interface Props {
  color: any;
  totalCall?: number;
  makeCall?: number;
  getCall?: number;
  language: object;
}

const Friends: FC<Props> = (props) =>
{
    const { color, language } = props;
    const styles = styleScaled(color);
    const refModalImage = useRef();

    const [count,setCount] = useState(0);

    const showAvatar = () =>
    {
        refModalImage.current.show();
        setCount((c)=>c + 1);
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.containerCount}
                onPress={showAvatar}
            >
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Friends
                </Text>
            </TouchableOpacity>
            <ModalFriends
                ref={refModalImage}
                color={color}
                count={count}
            />
        </View>
    );
};
export default memo(Friends);
