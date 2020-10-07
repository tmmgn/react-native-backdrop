# React Native Backdrop

React Native Backdrop component built with material guidelines for android and ios

| <img src="https://user-images.githubusercontent.com/11463030/64115482-726d4e80-cd98-11e9-8f7d-f2d1f64f6daf.gif" width="300" alt="Without closedHeight"> | <img src="https://user-images.githubusercontent.com/11463030/64115483-74cfa880-cd98-11e9-9413-525568983873.gif" width="300" alt="With closedHeight"> |



## Installation

`$ npm install react-native-backdrop --save`

## Usage

```js
import { Backdrop } from "react-native-backdrop";

const App = () => {
  const [visible, setVisible] = useState(false);
  
  const handleOpen = () => {
    setVisible(true);
  };
  
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
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
        handleOpen={handleOpen}
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
    </>
  );
}


```

### Backdrop Properties

| Prop                  | Description                                                  | Default                                                                                      |
| --------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **`children`**        | Content of backdrop (required)                               |                                                                                              |
| **`visible`**         | Whether the backdrop is visible (required, boolean)          | `false`     
| **`handleOpen`**     | Function to open backdrop (required, function)              | `() => {}`       |
| **`handleClose`**     | Function to close backdrop (required, function)              | `() => {}`                                                                                   |
| **`beforeClose`**         | Callback that is called before close animation    | `() => {}`                                                                                   |
| **`afterClose`**         | Callback that is called after close animation    | `() => {}`                                                                                   |
| **`beforeOpen`**         | Callback that is called before open animation    | `() => {}`                                                                                   |
| **`afterOpen`**         | Callback that is called after open animation    | `() => {}`                                                                                   |
| **`animationConfig`** | Configures Open and Close Animation speed and bounciness     | `{speed: 14, bounciness: 4}`                                                                 |
| **`swipeConfig`**     | Configures Swipe Gesture to close backdrop                   | `{velocityThreshold: 0.3, directionalOffsetThreshold: 80}`                                   |
| **`backdropStyle`**   | Style object for backdrop styling                            | `{}`                                                                                         |
| **`containerStyle`**   | Style object for container styling                            | `{ backgroundColor: "#fff" }`                                                                                         |
| **`overlayColor`**    | Color of backdrop overlay                                    | `rgba(0, 0, 0, 0.32)`                                                                        |
| **`header`**          | Display custom header in backdrop                            | `() => (<View style={styles.closePlateContainer}><View style={styles.closePlate} /></View>)` |
| **`closedHeight`**    | Height of closed backdrop that will be visible and touchable | `0`                                                                                          |
| **`closeOnBackButton`**    | Close backdrop on back button press on android | `false`                                                                                          |

velocityThreshold - Velocity that has to be breached in order for swipe to be triggered (vx and vy properties of gestureState)
directionalOffsetThreshold - Absolute offset that shouldn't be breached for swipe to be triggered (dy for horizontal swipe, dx for vertical swipe)

## License

[MIT License](http://opensource.org/licenses/mit-license.html). © Alexander Bogdanov 2019-
