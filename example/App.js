import React, {Fragment, useState} from 'react';
import {TouchableOpacity, Text, View, StatusBar} from 'react-native';
import {Backdrop} from 'react-native-backdrop';

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

      <Backdrop visible={visible} handleClose={handleClose}>
        <View>
          <Text>Some backdrop Content</Text>
          <View
            style={{
              marginTop: 12,
              backgroundColor: '#bdbdbd',
              padding: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
            }}>
            <Text>Content inside view</Text>
          </View>
        </View>
      </Backdrop>
    </Fragment>
  );
};

export default App;
