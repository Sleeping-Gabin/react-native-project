import { ScrollView, StyleSheet, View } from "react-native";
import { AppTheme } from "../styles/themes";
import { useAppTheme } from "../components/ThemeProvider";
import BookItem from "../components/BookItem";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReviewStackParamList, RootStackParamList } from "../navigations/types";
import { useEffect, useState } from "react";
import { NitroSQLite, open } from "react-native-nitro-sqlite";
import Book from "../entity/Book";
import SerifText from "../components/SerifText";
import Review from "../entity/Review";
import SansSerifText from "../components/SansSerifText";
import StarRate from "../components/StarRate";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

type ReviewDetailScreenProps = NativeStackScreenProps<RootStackParamList, "ReviewDetail">;

export default function ReviewDetailScreen({route}: ReviewDetailScreenProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [review, setReview] = useState<Review>();
  const [book, setBook] = useState<Book>();

  const getReview = async () => {
    const {rows} = await NitroSQLite.executeAsync("db.sqlite", 
      "SELECT * FROM review WHERE id = ?",
      [route.params.reviewId]
    );

    if (rows?.item(0)) {
      setReview(new Review(rows.item(0)!));
    }
  }

  const getBook = async () => {
    const {rows} = await NitroSQLite.executeAsync("db.sqlite", 
      "SELECT * FROM book WHERE review_id = ?",
      [route.params.reviewId]
    );

    if (rows?.item(0)) {
      setBook(new Book(rows.item(0)!));
    }
  }

  useEffect(() => {
    getReview();
    getBook();
  }, []);

  return (
    <ScrollView style={styles.container}>
    {
      review &&
      <View style={styles.infoContainer}>
        <View style={styles.infos}>
          <StarRate starRate={review.starRate} size={15} />
          <SansSerifText>
            <MaterialDesignIcons name={review.type.icon} color={theme.text} /> 
            {" " + review.type.name}
          </SansSerifText> 
          <SansSerifText>
            <MaterialDesignIcons name={review.emotion.icon} color={theme.text} /> 
            {" " + review.emotion.name}
          </SansSerifText>
        </View>
        <SansSerifText>
          {review.getDateString()}
        </SansSerifText>
      </View>
    }

    {
      book &&
      <BookItem
        book={book}
        imageWidth={99}
        style={styles.book}
      />
    }

    {
      review &&
      <SerifText style={styles.text} selectable>
        {review.text}
      </SerifText>
    }
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginVertical: 20
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  infos: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  book: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: theme.lightGray,
  },
  text: {
    lineHeight: 22,
  }
});