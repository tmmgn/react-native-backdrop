import React, {Fragment, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Backdrop from 'react-native-backdrop';

const App = () => {
  const [visible, setVisible] = useState(false);
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Fragment>
      <StatusBar
        backgroundColor="rgba(255,255,255, 0)"
        barStyle="dark-content"
        translucent
      />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={styles.buttonStyle}>
          <Text>Backdrop</Text>
        </TouchableOpacity>
      </View>

      <Backdrop
        visible={visible}
        handleClose={handleClose}
        handleOpen={() => setVisible(true)}
        closedHeight={32}>
        <View>
          <Text style={styles.textCenter}>Some backdrop Content</Text>
          <View style={styles.cardStyle}>
            <Text style={styles.textWhite}>Content inside view 1</Text>
          </View>
          <View style={[styles.cardStyle, {backgroundColor: '#8F9BF9'}]}>
            <Text style={styles.textWhite}>Content inside view 2</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.textWhite}>Action Button</Text>
          </TouchableOpacity>
        </View>
      </Backdrop>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    backgroundColor: '#fff',
  },
  cardStyle: {
    marginTop: 12,
    backgroundColor: '#FF7D8B',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textWhite: {
    color: '#fff',
  },
  textCenter: {
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 24,
    marginBottom: 12,
    backgroundColor: '#5162F5',
  },
});

export default App;
