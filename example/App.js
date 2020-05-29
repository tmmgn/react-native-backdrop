import React, {Fragment, useState} from 'react';
import {SafeAreaView, TouchableOpacity, Text, View} from 'react-native';
import {Backdrop} from 'react-native-backdrop';

const App = () => {
  const [visible, setVisible] = useState(false);
  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={handleOpen}
          style={{
            height: 40,
            paddingHorizontal: 16,
            backgroundColor: '#f0f0f0',
          }}>
          <Text>Backdrop</Text>
        </TouchableOpacity>
      </View>
      <Backdrop
        visible={visible}
        handleOpen={handleOpen}
        handleClose={handleClose}
        overlayColor={'rgba(0,0,0,0.6)'}
        header={
          <View>
            <Text>Header</Text>
          </View>
        }
        containerStyle={{backgroundColor: '#fafafa'}}
        beforeOpen={() => console.log('beforeOpen')}
        afterOpen={() => console.log('afterOpen')}
        beforeClose={() => console.log('beforeClose')}
        afterClose={() => console.log('afterClose')}
        closedHeight={52}>
        <View>
          <Text>Backdrop Content 1</Text>
          <Text>Backdrop Content 2</Text>
          <Text>Backdrop Content 3</Text>
          <Text>Backdrop Content 4</Text>
          <Text>Backdrop Content 5</Text>
          <Text>Backdrop Content 6</Text>
          <Text>Backdrop Content 7</Text>
        </View>
      </Backdrop>
    </SafeAreaView>
  );
};

export default App;
