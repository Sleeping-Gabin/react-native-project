import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { open } from "react-native-nitro-sqlite";
import { AppTheme } from "../styles/themes";
import ReviewItem from "../components/ReviewItem";
import { useAppTheme } from "../components/ThemeProvider";
import Review from "../entity/Review";
import { useAppSelector } from "../store";
import Calendar from "../components/calendar/Calendar";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedReaction, useAnimatedRef, useAnimatedScrollHandler, useSharedValue, withTiming } from "react-native-reanimated";
import { getWeekHeight } from "../components/calendar/utils";
import { scheduleOnRN } from "react-native-worklets";
import dayjs from "dayjs";

export default function CalendarScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const navigation = useNavigation();

  const [dateSet, setDateSet] = useState<Set<string>>(new Set());
  const [reviewMap, setReviewMap] = useState<Map<string, Review[]>>(new Map());

  const selectedDate = useAppSelector(state => state.calendar.selectedDate);
  const month = dayjs(selectedDate).month();

  const getDateSet = async () => {
    const db = open({
      name: "db.sqlite",
      location: "default"
    });

    const {rows} = await db.executeAsync(
      "SELECT DISTINCT write_date FROM review;"
    );

    if (rows) {
      const newSet = new Set<string>();

      for (let i=0; i<rows.length; i++) {
        const date = String(rows.item(i)?.write_date);
        newSet.add(date);
      }

      setDateSet(newSet);
    }
  }

  const getReviewMap = async () => {    
    const db = open({
      name: "db.sqlite",
      location: "default"
    });

    const newMap = new Map<string, Review[]>();

    for (let date of dateSet) {
      const reviewList: Review[] = [];

      const {rows} = await db.executeAsync(
        "SELECT * FROM review WHERE write_date = ?;", 
        [date]
      );

      if (rows) {
        for (let j=0; j<rows.length; j++) {
          reviewList.push(new Review(rows.item(j)!));
        }
      }

      newMap.set(date, reviewList);
    };
    setReviewMap(newMap);
  }

  useEffect(() => {
    getDateSet();
  }, []);

  useEffect(() => {
    getReviewMap();
  }, [dateSet]);
 
  const listRef = useAnimatedRef<Animated.FlatList>();
  const scrollOffset = useSharedValue(0);
  const startoffset = useSharedValue(0);
  const startPoint = useSharedValue(0);

  const maxHeight = useSharedValue(0);
  const minHeight = getWeekHeight(1);
  
  const [weekView, setWeekView] = useState(false);

  const isMin = useSharedValue(false);
  const isMax = useSharedValue(true);
  const calendarHeight = useSharedValue(0);

  useEffect(() => {
    maxHeight.value = getWeekHeight(selectedDate);
    if (!weekView)
      calendarHeight.value = getWeekHeight(selectedDate);
  }, [month]);

  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollOffset.value = e.contentOffset.y;
  });

  const updateValue = (delta: number) => {
    if (!isMin.value && calendarHeight.value === minHeight) {
      startPoint.value = delta;
      startoffset.value = scrollOffset.value;
      isMin.value = true;
    }
    else if (!isMax.value && calendarHeight.value === maxHeight.value) {
      startPoint.value = delta;
      startoffset.value = scrollOffset.value;
      isMax.value = true;
    } 
    else if (calendarHeight.value < maxHeight.value && calendarHeight.value > minHeight) {
      isMin.value = false;
      isMax.value = false;
    }
  }

  const drag = Gesture.Pan()
    .onStart(() => {
      startoffset.value = scrollOffset.value;
      startPoint.value = 0;
    })
    .onUpdate(e => {
      updateValue(e.translationY);

      const move = e.translationY - startPoint.value;

      if (isMin.value && ((move < 0) || (move > 0 && scrollOffset.value > 0))) {
        scheduleOnRN(() => {
          listRef.current?.scrollToOffset({
            offset:  Math.max(0, startoffset.value - move),
            animated: false,
          })
        });
      } 
      else {
        const height = move > 0 ? maxHeight.value : minHeight;
        calendarHeight.value = withTiming(height, {duration: 300});
      }
    })
    .onEnd(e => {
      updateValue(e.translationY);
    })
    .runOnJS(true);
  
  useAnimatedReaction(
    () => calendarHeight.value === minHeight,
    (cur, prev) => {
      if (cur !== prev) {
        scheduleOnRN(setWeekView, cur);
      }
    },
    [calendarHeight]
  );
  
  return (
    <GestureDetector gesture={drag}>
    <View style={styles.container}>
      <Calendar 
        markedDateSet={dateSet}
        style={styles.calendar}
        height={calendarHeight}
        weekView={weekView}
      />

      <Animated.FlatList
        ref={listRef}
        data={reviewMap.get(selectedDate)}
        renderItem={({item}) => (
          <ReviewItem 
            review={item} 
            onPress={() => {
              navigation.navigate("ReviewDetail", {
                reviewId: item.id!
              })
            }}
          />
        )}
        keyExtractor={item => item.id!.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={[styles.list]}
        contentContainerStyle={styles.listContainer}
        onScroll={scrollHandler}
      />
    </View>
    </GestureDetector>
  )
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1
  },
  calendar: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  listContainer: {    
    paddingHorizontal: 15,
    paddingVertical: 0
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: theme.lightGray,
  },
});