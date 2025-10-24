import React, { PropsWithChildren, ReactElement, SetStateAction, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, TouchableHighlight, Modal, Dimensions, FlatList, LayoutChangeEvent, Pressable } from "react-native";
import { useAppTheme } from "./ThemeProvider";
import { AppTheme } from "../styles/themes";
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { closeSheet, useAppDispatch, useAppSelector } from "../store";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface BottomSheetProps {
  data: ReactElement[];
  name: string;
  setIdx: React.Dispatch<SetStateAction<number>>;
}

export default function BottomSheet(props: BottomSheetProps) {
  const {data, name, setIdx} = props;

  const isOpen = useAppSelector(state => state.sheet.openName === name);
  const dispatch = useAppDispatch();

  const theme = useAppTheme();
  const styles = createStyles(theme);
  
  const y = useSharedValue(100);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: `${y.value}%`,
    }]
  }));

  useAnimatedReaction(
    () => isOpen,
    (open) => {
      if (open) {
        y.value = withTiming(0, { duration: 300 });
      }
    },
    [isOpen]
  );

  const closeAnimatioin = () => {
    const close = () => dispatch(closeSheet());
    y.value = withTiming(100, {duration: 200}, (finished) => {
      if (finished) 
        scheduleOnRN(close);
    });
  }

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      onRequestClose={() => closeAnimatioin()}
    >
    <Pressable 
      style={styles.background}
      onPress={closeAnimatioin}
    >
      <Animated.View 
        style={[styles.container, animatedStyle]}
      >
        <FlatList
          data={data}
          style={styles.list}
          renderItem={
            ({item, index}) => 
            <SheetItem 
              onPress={() => {
                setIdx(index);
                closeAnimatioin();
              }}
              children={item}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </Animated.View>
    </Pressable>
    </Modal>
  )
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000088"
  },
  container: {
    maxHeight: Dimensions.get("screen").height * 0.4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: theme.background,
  },
  list: {
    marginVertical: 10
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: theme.lightGray,
  }
});


interface SheetItemProps extends PropsWithChildren {
  onPress: () => void;
}

function SheetItem(props: SheetItemProps) {
  const theme = useAppTheme();

  return (
    <TouchableHighlight
      style={{
        paddingVertical: 10,
        alignItems: "center",
      }}
      underlayColor={theme.lightGray}
      onPress={props.onPress}
    >
      {props.children}
    </TouchableHighlight>
  )
}