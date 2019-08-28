import React, {Fragment, useState} from 'react';
import {TouchableOpacity, Text, View, StatusBar} from 'react-native';
import Backdrop from './src/components/Backdrop';

const App = () => {
  const [visible, setVisible] = useState(false);
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{
            width: 200,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 1,
            backgroundColor: '#fff',
          }}>
          <Text>Backdrop</Text>
        </TouchableOpacity>
      </View>

      <Backdrop
        visible={visible}
        handleClose={handleClose}
        swipeConfig={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        overlayColor="rgba(0,0,0,0.32)"
        backdropStyle={{
          backgroundColor: '#fff',
        }}
        animationConfig={{
          speed: 10,
          bounciness: 12,
        }}
        hideClosePlate>
        <View>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
          <Text>Backdrop</Text>
        </View>
      </Backdrop>
    </Fragment>
  );
};

export default App;
