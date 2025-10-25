import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { NitroSQLite } from "react-native-nitro-sqlite";
import ReviewDetailScreen from "../screens/ReviewDetailScreen";
import ReviewWriteScreen from "../screens/ReviewWriteScreen";
import { pressSave, useAppDispatch } from "../store";
import HeaderBtn from "./HeaderBtn";
import NavHeader from "./NavHeader";
import { RootStackParamList } from "./types";
import { useNavigation } from "@react-navigation/native";
import TabBar from "./TabBar";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigation() {
  const dispatch = useAppDispatch();
  const rootNavigation = useNavigation();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerBackground: () => <NavHeader />,
      }}
      initialRouteName="Tab"
    >
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
                    routes: [{name: "Tab"}]
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
      <Stack.Screen
        name="Tab"
        component={TabBar}
        options={{
          headerShown: false,
          headerBackground: undefined
        }}
      />
    </Stack.Navigator>
  )
}