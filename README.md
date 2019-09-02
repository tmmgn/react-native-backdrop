# React Native Backdrop

React Native Backdrop component built with material guidelines

![Backdrop closed](https://user-images.githubusercontent.com/11463030/63857337-3018cb80-c9ac-11e9-96c9-c047e0937b09.png)
![Backdrop opened](https://user-images.githubusercontent.com/11463030/63857338-3149f880-c9ac-11e9-98f2-311b477a80da.png)

## Installation

`$ npm install react-native-backdrop --save`

## Usage

```js
import { Backdrop } from "react-native-backdrop";

const App = () => {
  const [visible, setVisible] = useState(false);
  const handleClose = () => {
    setVisible(false);
  };

  render() {
    return (
    <Fragment>
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
          <Text>Handle Backdrop</Text>
        </TouchableOpacity>
      </View>
      <Backdrop
        visible={visible}
        handleClose={handleClose}
        onClose={() => {}}
        swipeConfig={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        animationConfig={{
          speed: 14,
          bounciness: 4,
        }}
        overlayColor="rgba(0,0,0,0.32)"
        backdropStyle={{
          backgroundColor: '#fff',
        }}>
        <View>
          <Text>Backdrop Content</Text>
        </View>
      </Backdrop>
    );
  }
}


```

### Backdrop Properties

| Prop                  | Description                                                  | Default                                                                                      |
| --------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **`children`**        | Content of backdrop (required)                               |                                                                                              |
| **`visible`**         | Whether the backdrop is visible (required, boolean)          | `false`                                                                                      |
| **`handleClose`**     | Function to close backdrop (required, function)              | `() => {}`                                                                                   |
| **`onClose`**         | Callback that is called when the user closes the backdrop    | `() => {}`                                                                                   |
| **`animationConfig`** | Configures Open and Close Animation speed and bounciness     | `{speed: 14, bounciness: 4}`                                                                 |
| **`swipeConfig`**     | Configures Swipe Gesture to close backdrop                   | `{velocityThreshold: 0.3, directionalOffsetThreshold: 80}`                                   |
| **`backdropStyle`**   | Style object for backdrop styling                            | `{}`                                                                                         |
| **`overlayColor`**    | Color of backdrop overlay                                    | `rgba(0, 0, 0, 0.32)`                                                                        |
| **`hedaer`**          | Display custom header in backdrop                            | `() => (<View style={styles.closePlateContainer}><View style={styles.closePlate} /></View>)` |
| **`closedHeight`**    | Height of closed backdrop that will be visible and touchable | `0`                                                                                          |

velocityThreshold - Velocity that has to be breached in order for swipe to be triggered (vx and vy properties of gestureState)
directionalOffsetThreshold - Absolute offset that shouldn't be breached for swipe to be triggered (dy for horizontal swipe, dx for vertical swipe)

## License

[MIT License](http://opensource.org/licenses/mit-license.html). © Alexander Bogdanov 2019-
