import { Image, TouchableHighlight, StyleSheet, View, ViewStyle } from "react-native";
import Review from "../entity/Review";
import SerifText from "./SerifText";
import SansSerifText from "./SansSerifText";
import { NitroSQLite } from "react-native-nitro-sqlite";
import { useEffect, useState } from "react";
import Book from "../entity/Book";
import MaterialDesignIcons, { MaterialDesignIconsIconName } from "@react-native-vector-icons/material-design-icons";
import { AppTheme } from "../styles/themes";
import { useAppTheme } from "./ThemeProvider";

export interface ReviewItemProps {
  review: Review;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function ReviewItem(props: ReviewItemProps) {
  const {review, style: itemStyle, onPress} = props;

  const [book, setBook] = useState<Book>();
  const theme = useAppTheme();

  const getBook = async () => {
    const {rows} = await NitroSQLite.executeAsync("db.sqlite", 
      "SELECT * FROM book WHERE review_id = ?",
      [review.id]
    );

    if (rows?.item(0)) {
      setBook(new Book(rows.item(0)!));
    }
  }

  useEffect(() => {
    getBook();
  }, []);

  const styles = createStyles(theme);

  return (
    <TouchableHighlight
      style={[styles.item, itemStyle]}
      underlayColor={theme.lightGray}
      onPress={onPress}
    >
      <View>
        <View style={styles.content}>
        {
          book &&
          <Image
            source={{uri: book?.thumbnail}}
            style={styles.image}
          />
        }
          <View style={styles.textContainer}>
            <SerifText
              numberOfLines={1}
              type="SemiBold"
              style={styles.title}
            >
              {book?.title}
            </SerifText>
            <SerifText
              numberOfLines={3}
              style={styles.text}
            >
              {review.text}
            </SerifText>
          </View>
        </View>
        <View style={styles.infos}>
          <SansSerifText style={styles.infoText}>
            <InfoIcon name={review.type.icon} /> | <InfoIcon name="star" color={theme.secondary} />{review.starRate} · <InfoIcon name={review.emotion.icon} />
          </SansSerifText>
          <SansSerifText style={styles.infoText}>
              {review.getDateString()}
          </SansSerifText>
        </View>
      </View>
    </TouchableHighlight>
  )
}

interface InfoIconProps {
  name: MaterialDesignIconsIconName;
  color?: string;
}

function InfoIcon({name, color}: InfoIconProps) {
  const theme = useAppTheme();

  return (
    <MaterialDesignIcons 
      name={name} 
      style={{
        fontSize: 14,
        color: color ? color : theme.darkGray
      }}
    />
  )
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  content: {
    marginBottom: 5,
    flexDirection: "row",
  },
  image: {
    width: 78,
    height: 78/3*4,
    objectFit: "contain",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    marginBottom: 10,
    fontSize: 16,
  },
  text: {
    textAlign: "justify"
  },
  infos: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  infoText: {
    fontSize: 14,
    color: theme.darkGray
  }
});