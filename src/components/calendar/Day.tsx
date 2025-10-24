import { memo } from "react";
import { ImageBackground, View, TouchableOpacity, StyleSheet } from "react-native";
import { useAppSelector, useAppDispatch, changeSelected } from "../../store";
import { AppTheme } from "../../styles/themes";
import SansSerifText from "../SansSerifText";
import { useAppTheme } from "../ThemeProvider";
import dayjs from "dayjs";
import { DAY_HEIGHT } from "./utils";

interface DayProps {
  date: dayjs.Dayjs;
  active: boolean;
  marked: boolean;
  thumbnail: string | undefined;
}

const Day = memo((props: DayProps) => {
  const {date, active, marked, thumbnail} = props;

  const selected = useAppSelector(state => state.calendar.selectedDate === date.format("YYYY-MM-DD"));
  const dispatch = useAppDispatch();
  
  const theme = useAppTheme();
  const styles = createDayStyles(theme);
  
  const handleDayPress = () => {
    dispatch(changeSelected(date.format("YYYY-MM-DD")));
  }
  
  const DateText = () => (
    <SansSerifText
      style={[
        styles.text,
        !active && styles.inactiveText
      ]}
    >
      {date.date()}
    </SansSerifText>
  );

  const renderMarkedDay = () => (
    <ImageBackground
      style={[styles.day, styles.markedDay]}
      source={{uri: thumbnail}}
    >
      {
        selected &&
        <View style={[styles.day, styles.selectedDay, styles.selectedMarkedDay]}>
          <DateText />
        </View>
      }
    </ImageBackground>
  );

  const renderNormalDay = () => (
    <View 
      style={[
        styles.day,
        selected && styles.selectedDay
      ]}
    >
      <DateText />
    </View>
  );

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleDayPress}
    >
    { (marked && thumbnail) ? renderMarkedDay() : renderNormalDay() }
    </TouchableOpacity>
  )
}, (prev, next) => (
  prev.date.isSame(next.date) &&
  prev.active === next.active &&
  prev.marked === next.marked &&
  prev.thumbnail === next.thumbnail
));

const createDayStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  day: {
    width: DAY_HEIGHT,
    height: DAY_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDay: {
    borderRadius: 12,
    backgroundColor: theme.primaryContainer
  },
  markedDay: {
    borderRadius: 12,
    overflow: "hidden",
  },
  selectedMarkedDay: {
    opacity: 0.7,
  },
  text: {
    textAlign: "center",
    color: theme.text
  },
  inactiveText: {
    color: theme.primaryContainer
  },
});

export default Day;