import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { useAppTheme } from "../components/ThemeProvider";
import { AppTheme } from "../styles/themes";
import { useEffect, useState } from "react";
import Review from "../entity/Review";
import ReviewItem from "../components/ReviewItem";
import { open } from "react-native-nitro-sqlite";
import { useNavigation } from "@react-navigation/native";

export default function ReviewListScreen() {
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [query, setQuery] = useState("");

  const navigation = useNavigation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const getReviews = async () => {
    const db = open({
      name: "db.sqlite",
      location: "default"
    });

    const {rows} = await db.executeAsync(`
      SELECT * FROM review 
      ORDER BY write_date DESC, id DESC;
    `);

    if (rows) {
      const newList: Review[] = [];

      for (let i=0; i<rows.length; i++) {
        const review = new Review(rows.item(i)!)
        newList.push(review);
      }
      setReviewList(newList);
    }
  }

  const filteringReviews = async () => {
    if (query === "") {
      getReviews();
      return;
    }

    const db = open({
      name: "db.sqlite",
      location: "default"
    });

    const {rows} = await db.executeAsync(`
      SELECT review.* FROM review
      JOIN book ON review.id = book.review_id
      WHERE (book.title LIKE ?) OR (review.text LIKE ?)
      ORDER BY write_date DESC, id DESC;
    `, [`%${query}%`, `%${query}%`]);

    if (rows) {
      const newList: Review[] = [];

      for (let i=0; i<rows.length; i++) {
        const review = new Review(rows.item(i)!)
        newList.push(review);
      }

      setReviewList(newList);
    }
  }

  useEffect(() => {
    getReviews();
  }, []);

  const renderReviewItem = ({item}: {item: Review}) => (
    <ReviewItem 
      review={item} 
      onPress={() => 
        navigation.navigate("ReviewDetail", {
          reviewId: item.id!
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="기록 검색"
        placeholderTextColor={theme.darkGray}
        value={query}
        onChangeText={(text) => setQuery(text)}
        onSubmitEditing={() => filteringReviews()}
      />

      <FlatList
        data={reviewList}
        contentContainerStyle={styles.listContainer}
        keyExtractor={item => item.id!.toString()}
        renderItem={renderReviewItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    alignSelf: "center",
    width: "50%",
    marginVertical: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 8,
    color: theme.text,
    fontFamily: "Pretendard-Regular"
  },
  filterContainer: {
    flexWrap: "wrap"
  },
  listContainer: {    
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: theme.lightGray,
  }
});