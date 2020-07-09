import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  Animated,
  View,
  SafeAreaView,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  BackHandler,
} from 'react-native';
import styles from './styles';

const {height} = Dimensions.get('window');

const swipeConfigDefault = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

const animationConfigDefault = {
  useNativeDriver: true,
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

const Backdrop = ({
  visible = false,
  overlayColor = 'rgba(0,0,0,0.3)',
  children,
  handleOpen = () => {},
  handleClose = () => {},
  closedHeight = 0,
  header = null,
  backdropStyle = {},
  containerStyle = {backgroundColor: '#fff'},
  animationConfig = {},
  swipeConfig = {},
  beforeOpen = () => {},
  afterOpen = () => {},
  beforeClose = () => {},
  afterClose = () => {},
  closeOnBackButton = false,
}) => {
  const [contentHeight, setHeight] = useState(0);
  const transitionY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    visible ? animationStart() : animationEnd();
  }, [visible, animationStart, animationEnd]);

  useEffect(() => {
    closeOnBackButton &&
      BackHandler.addEventListener('hardwareBackPress', onBackButtonPress);

    return () => {
      closeOnBackButton &&
        BackHandler.removeEventListener('hardwareBackPress', onBackButtonPress);
    };
  }, [closeOnBackButton, onBackButtonPress]);

  const swipeConfigConcated = {...swipeConfigDefault, ...swipeConfig};

  const animationConfigConcated = {
    ...animationConfigDefault,
    ...animationConfig,
  };

  const animationStart = useCallback(() => {
    Animated.spring(transitionY, {
      toValue: 0,
      ...animationConfigConcated,
    }).start(() => afterOpen());
  }, [transitionY, afterOpen, animationConfigConcated]);

  const animationEnd = useCallback(() => {
    Animated.spring(transitionY, {
      toValue: contentHeight - closedHeight,
      ...animationConfigConcated,
    }).start(() => afterClose());
  }, [
    transitionY,
    contentHeight,
    closedHeight,
    afterClose,
    animationConfigConcated,
  ]);

  const onLayout = useCallback(
    (event) => {
      if (!contentHeight) {
        transitionY.setValue(event.nativeEvent.layout.height - closedHeight);
        setHeight(event.nativeEvent.layout.height);
      }
    },
    [contentHeight, closedHeight, transitionY],
  );

  const onBackButtonPress = useCallback(() => {
    _handleClose();
    return true;
  }, [_handleClose]);

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt) => true,
    onPanResponderMove: (e, gestureState) => {
      if (visible) {
        Animated.event([null, {dy: transitionY}], {useNativeDriver: false})(
          e,
          gestureState,
        );
      } else {
        transitionY.setValue(gestureState.dy + contentHeight - closedHeight);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (_isValidVerticalSwipe(gestureState)) {
        if (gestureState.dy > 0) {
          _handleClose();
        } else {
          _handleOpen();
        }
      } else {
        const {vy, dy} = gestureState;
        const halfHeight = dy > contentHeight / 2;
        if (vy > 0 && halfHeight) {
          _handleClose();
        } else {
          _handleOpen();
        }
      }
    },
  });

  const _isValidVerticalSwipe = useCallback(
    (gestureState) => {
      const {vy, dx} = gestureState;
      const {
        velocityThreshold,
        directionalOffsetThreshold,
      } = swipeConfigConcated;
      return isValidSwipe(
        vy,
        velocityThreshold,
        dx,
        directionalOffsetThreshold,
      );
    },
    [swipeConfigConcated],
  );

  const _handleOpen = useCallback(() => {
    beforeOpen();
    animationStart();
    handleOpen();
  }, [beforeOpen, handleOpen, animationStart]);

  const _handleClose = useCallback(() => {
    beforeClose();
    handleClose();
  }, [beforeClose, handleClose]);

  const clampedTransition = useMemo(
    () =>
      transitionY.interpolate({
        inputRange: [0, contentHeight ? contentHeight - closedHeight : 1],
        outputRange: [
          contentHeight > height ? contentHeight - height + closedHeight : 0,
          contentHeight ? contentHeight - closedHeight : 1,
        ],
        extrapolate: 'clamp',
      }),
    [closedHeight, contentHeight, transitionY],
  );

  const clampedOpacity = useMemo(
    () =>
      transitionY.interpolate({
        inputRange: [0, contentHeight ? contentHeight - closedHeight : 1],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
    [closedHeight, contentHeight, transitionY],
  );

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
      <Animated.View
        style={[
          styles.overlayStyle,
          backdropStyle,
          {
            backgroundColor: overlayColor,
            opacity: clampedOpacity,
          },
        ]}
        pointerEvents={visible ? 'auto' : 'none'}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={_handleClose}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={[
          styles.contentContainer,
          {
            transform: [
              {
                translateY: clampedTransition,
              },
            ],
            opacity: contentHeight ? 1 : 0,
          },
        ]}>
        <View
          style={containerStyle}
          onLayout={onLayout}
          {..._panResponder.panHandlers}>
          {header}
          {children}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Backdrop;
