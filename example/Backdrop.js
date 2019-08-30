import React, {Component} from 'react';
import {
  StyleSheet,
  Animated,
  View,
  SafeAreaView,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from 'react-native';

const {height} = Dimensions.get('window');

const swipeConfigDefault = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 50,
};

const animationConfigDefault = {
  duration: 50,
  speed: 14,
  bounciness: 4,
};

const isValidSwipe = (
  velocity,
  velocityThreshold,
  directionalOffset,
  directionalOffsetThreshold,
) =>
  Math.abs(velocity) > velocityThreshold &&
  Math.abs(directionalOffset) < directionalOffsetThreshold;

class Backdrop extends Component {
  static defaultProps = {
    onClose: () => {},
    backdropStyle: {},
    animationConfig: {},
    swipeConfig: {},
    overlayColor: 'rgba(0,0,0,0.32)',
    paddingBottom: 40,
    hideClosePlate: false,
    loading: true,
    closedHeight: 0,
  };

  state = {
    backdropHeight: 0,
  };

  swipeConfig = {...swipeConfigDefault, ...this.props.swipeConfig};

  animationConfig = {
    ...animationConfigDefault,
    ...this.props.animationConfig,
  };

  _transitionY = new Animated.Value(this.props.closedHeight);
  _currentPosition = this.props.closedHeight;

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
    this._transitionY.setValue(
      event.nativeEvent.layout.height - this.props.closedHeight,
    );
    this.setState(
      {
        backdropHeight: event.nativeEvent.layout.height,
        loading: false,
      },
      () => {
        if (this.props.visible) {
          this.handleAnimationInit();
        }
      },
    );
  };

  handleAnimationInit = () => {
    const spring = Animated.spring;
    const {backdropHeight} = this.state;

    if (this.anim) {
      this.anim = null;
    }

    const startAnimation = spring(this._transitionY, {
      toValue: 40,
      useNativeDriver: true,
      ...this.animationConfig,
    });

    this._transitionY.addListener(({value}) => (this._currentPosition = value));

    const closeAnimation = spring(this._transitionY, {
      toValue: backdropHeight - this.props.closedHeight,
      useNativeDriver: true,
      ...this.animationConfig,
    });

    this.setState({
      closeAnimation: closeAnimation,
    });

    this.anim = startAnimation;
    this.anim.start();
  };

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if (gestureState.dy > 0 || gestureState.dy < 0) {
        return true;
      }
    },
    onPanResponderMove: async (evt, gestureState) => {
      const {paddingBottom, closedHeight, visible} = this.props;
      const {backdropHeight} = this.state;
      const startingPosition = backdropHeight - closedHeight;
      let currentPosition = this._transitionY.__getValue();
      let isMaxHeight = this._currentPosition < paddingBottom;
      console.log(gestureState.moveY, backdropHeight);
      // height - backdropHeight + paddingBottom < gestureState.moveY;
      const isMinHeight = currentPosition > startingPosition;

      if (
        !visible &&
        gestureState.dy < 0 &&
        gestureState.moveY >= startingPosition
      ) {
        const newPosition = startingPosition + gestureState.dy;
        this._transitionY.setValue(newPosition);
      } else if (visible && gestureState.dy > 0) {
        const newPosition = gestureState.dy + paddingBottom;
        this._transitionY.setValue(newPosition);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      const {paddingBottom, handleOpen, visible} = this.props;
      if (this._isValidVerticalSwipe(gestureState)) {
        if (gestureState.vy > 0) {
          this._handleClose();
        } else if (gestureState.vy <= 0) {
          if (visible) {
            this.anim.start();
          } else {
            handleOpen();
          }
        }
      } else {
        const {vy, dy} = gestureState;
        const {backdropHeight} = this.state;
        const halfHeight = dy > (backdropHeight - paddingBottom * 2) / 2;
        if (!visible) {
          handleOpen();
          if (vy <= 0) {
            Animated.spring(this._transitionY, {
              toValue: 40,
              useNativeDriver: true,
              ...this.animationConfig,
            }).start();
          } else {
            this._handleClose();
          }
        } else {
          if (vy > 0 && halfHeight) {
            this._handleClose();
          } else {
            Animated.spring(this._transitionY, {
              toValue: 40,
              useNativeDriver: true,
              ...this.animationConfig,
            }).start();
          }
        }
      }
    },
    onPanResponderTerminate: (evt, gestureState) => {
      this._handleClose();
    },
  });

  _isValidVerticalSwipe(gestureState) {
    const {vy, dx} = gestureState;
    const {velocityThreshold, directionalOffsetThreshold} = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  }

  _handleClose = () => {
    const {onClose, handleClose} = this.props;

    if (handleClose) {
      this.props.handleClose();
    }

    if (this.state.closeAnimation) {
      this.state.closeAnimation.start(() => {
        this.anim = null;
        this._transitionY.setValue(
          this.state.backdropHeight - this.props.closedHeight,
        );
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
      overlayColor,
      closedHeight,
    } = this.props;
    const {backdropHeight} = this.state;

    let opacityAnimation = backdropHeight
      ? this._transitionY.interpolate({
          inputRange: [40, backdropHeight - closedHeight],
          outputRange: [1, 0],
        })
      : 0;

    return (
      <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
        <Animated.View
          style={[
            styles.overlayStyle,
            {
              backgroundColor: overlayColor,
              opacity: opacityAnimation,
            },
          ]}
          pointerEvents={visible ? 'auto' : 'none'}>
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
              opacity: backdropHeight ? 1 : 0, // Hide before layout prevents blink
              transform: [
                {
                  translateY: this._transitionY,
                },
              ],
            },
          ]}>
          <View
            pointerEvents={backdropHeight ? 'auto' : 'none'}
            style={[
              styles.container,
              {paddingBottom: this.props.paddingBottom + 12},
              backdropStyle,
            ]}
            onLayout={this.onLayout}
            {...this._panResponder.panHandlers}>
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
    justifyContent: 'flex-end',
    flex: 1,
    paddingTop: 40,
  },
  container: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  overlayTouchable: {
    flex: 1,
  },
  contentContainer: {
    marginTop: 48,
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  closePlateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    flex: 1,
  },
  closePlate: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#bdbdbd',
  },
});

export default Backdrop;
