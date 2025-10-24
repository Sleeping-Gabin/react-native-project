import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReviewListScreen from "../screens/ReviewListScreen";
import { View } from "react-native";
import { ReviewStackParamList } from "./types";
import ReviewWriteScreen from "../screens/ReviewWriteScreen";
import ReviewDetailScreen from "../screens/ReviewDetailScreen";
import { pressSave, useAppDispatch } from "../store";
import { useNavigation } from "@react-navigation/native";
import { NitroSQLite } from "react-native-nitro-sqlite";
import HeaderBtn from "./HeaderBtn";
import NavHeader from "./NavHeader";

const Stack = createNativeStackNavigator<ReviewStackParamList>();

export default function ReviewNavigation() {
  const dispatch = useAppDispatch();
  const rootNavigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerBackground: () => <NavHeader />,
      }}
    >
      <Stack.Screen 
        name="ReviewList" 
        component={ReviewListScreen} 
        options={{
          title: "독서 기록"
        }}
      />
      <Stack.Screen
        name="ReviewDetail"
        component={ReviewDetailScreen}
        options={({navigation, route}) => ({
          title: "",
          headerRight: () => (
            <View 
              style={{
                flexDirection: "row",
                gap: 10
              }}
            >
              <HeaderBtn
                name="수정"
                onPress={() => {
                  navigation.navigate("ReviewWrite", {
                    mode: "modify",
                    reviewId: route.params.reviewId
                  })
                }}
              />
              <HeaderBtn
                name="삭제"
                onPress={() => {
                  NitroSQLite.executeAsync("db.sqlite", `
                    DELETE FROM review WHERE id = ?;
                  `, [route.params.reviewId]);

                  rootNavigation.reset({
                    routes: [{name: "ReviewNav"}]
                  });
                }}
              />
            </View>
          )
        })}
      />
      <Stack.Screen
        name="ReviewWrite"
        component={ReviewWriteScreen}
        options={{
          title: "기록 작성",
          headerRight: () => <HeaderBtn name="저장" onPress={() => dispatch(pressSave())} />
        }}
      />
    </Stack.Navigator>
  );
}