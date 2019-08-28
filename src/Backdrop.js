import React, { Component } from "react";
import {
  StyleSheet,
  Animated,
  View,
  SafeAreaView,
  TouchableOpacity,
  PanResponder,
  Dimensions
} from "react-native";

const { height } = Dimensions.get("window");

const swipeConfigDefault = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

const animationConfigDefault = {
  duration: 50,
  speed: 14,
  bounciness: 4
};

const isValidSwipe = (
  velocity,
  velocityThreshold,
  directionalOffset,
  directionalOffsetThreshold
) =>
  Math.abs(velocity) > velocityThreshold &&
  Math.abs(directionalOffset) < directionalOffsetThreshold;

class Backdrop extends Component {
  static defaultProps = {
    onClose: () => {},
    backdropStyle: {},
    animationConfig: {},
    swipeConfig: {},
    overlayColor: "rgba(0,0,0,0.32)",
    paddingBottom: 40,
    hideClosePlate: false
  };

  state = {
    opacity: new Animated.Value(0.0),
    backdropHeight: 0
  };

  swipeConfig = { ...swipeConfigDefault, ...this.props.swipeConfig };

  animationConfig = {
    ...animationConfigDefault,
    ...this.props.animationConfig
  };

  _transitionY = new Animated.Value(0);

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      this.handleAnimationInit();
    }
  }

  componentWillUnmount() {
    if (this.anim) {
      this.anim.stop();
      this.anim = null;
    }
  }

  onLayout = event => {
    this._transitionY.setValue(event.nativeEvent.layout.height);
    this.setState(
      {
        backdropHeight: event.nativeEvent.layout.height
      },
      () => {
        if (this.props.visible) {
          this.handleAnimationInit();
        }
      }
    );
  };

  handleAnimationInit = () => {
    const spring = Animated.spring;
    const { opacity, backdropHeight } = this.state;

    if (this.anim) {
      this.anim = null;
    }

    const startAnimArr = [
      spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
        ...this.animationConfig
      }),
      spring(this._transitionY, {
        toValue: 40,
        useNativeDriver: true,
        ...this.animationConfig
      })
    ];

    const closeAnimArr = [
      spring(this._transitionY, {
        toValue: backdropHeight,
        useNativeDriver: true,
        ...this.animationConfig
      }),
      spring(opacity, {
        toValue: 0,
        useNativeDriver: true,
        ...this.animationConfig
      })
    ];

    this.setState({
      closeAnimation: Animated.parallel(closeAnimArr)
    });

    this.anim = Animated.parallel(startAnimArr);
    this.anim.start();
  };

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        return true;
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (
        height - this.state.backdropHeight + this.props.paddingBottom <
        gestureState.moveY
      ) {
        const newPosition = gestureState.dy + this.props.paddingBottom;
        this._transitionY.setValue(newPosition);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (this._isValidVerticalSwipe(gestureState)) {
        if (gestureState.dy > 0) {
          this._handleClose();
        }
      } else {
        const { vy, dy } = gestureState;
        const { backdropHeight } = this.state;
        const { paddingBottom } = this.props;
        const halfHeight = dy > (backdropHeight - paddingBottom * 2) / 2;
        if (vy > 0 && halfHeight) {
          this._handleClose();
        } else {
          Animated.spring(this._transitionY, {
            toValue: 40,
            useNativeDriver: true,
            ...this.animationConfig
          }).start();
        }
      }
    },
    onPanResponderTerminate: (evt, gestureState) => {
      this._handleClose();
    }
  });

  _isValidVerticalSwipe(gestureState) {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  }

  _handleClose = () => {
    const { onClose, handleClose } = this.props;

    if (handleClose) {
      this.props.handleClose();
    }

    if (this.state.closeAnimation) {
      this.state.closeAnimation.start(() => {
        this.anim = null;
        this._transitionY.setValue(this.state.backdropHeight);
        if (onClose) {
          onClose();
        }
      });
    } else if (this.anim) {
      this.anim.stop();
      this.anim = null;
    }
  };

  render() {
    const {
      backdropStyle,
      visible,
      children,
      hideClosePlate,
      overlayColor
    } = this.props;
    return (
      <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
        <Animated.View
          style={[
            styles.overlayStyle,
            {
              backgroundColor: overlayColor,
              opacity: this.state.opacity
            }
          ]}
          pointerEvents={visible ? "auto" : "none"}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={this._handleClose}
          />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          accessibilityLiveRegion="polite"
          style={[
            styles.contentContainer,
            {
              opacity: this.state.opacity,
              transform: [
                {
                  translateY: this._transitionY
                }
              ]
            }
          ]}
        >
          <View
            style={[
              styles.container,
              { paddingBottom: this.props.paddingBottom + 12 },
              backdropStyle
            ]}
            onLayout={this.onLayout}
            {...this._panResponder.panHandlers}
          >
            {!hideClosePlate && (
              <View style={styles.closePlateContainer}>
                <View style={styles.closePlate} />
              </View>
            )}
            <View>{children}</View>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
    justifyContent: "flex-end",
    flex: 1,
    paddingTop: 40
  },
  container: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16
  },
  overlayTouchable: {
    flex: 1
  },
  contentContainer: {
    marginTop: 48,
    flex: 1,
    justifyContent: "flex-end"
  },
  overlayStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  closePlateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 16,
    flex: 1
  },
  closePlate: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#bdbdbd"
  }
});

export default Backdrop;
