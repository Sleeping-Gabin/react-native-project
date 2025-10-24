import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WriteStackParamList } from "./types";
import ReviewWriteScreen from "../screens/ReviewWriteScreen";
import { pressSave, useAppDispatch } from "../store";
import SearchScreen from "../screens/SearchScreen";
import HeaderBtn from "./HeaderBtn";
import NavHeader from "./NavHeader";

const Stack = createNativeStackNavigator<WriteStackParamList>();

export default function WriteNavigation() {
  const dispatch = useAppDispatch();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerBackground: () => <NavHeader />,
      }}
    >
      <Stack.Screen 
        name="BookSearch" 
        component={SearchScreen} 
        options={{
          title: "책 검색"
        }}
      />
      <Stack.Screen
        name="ReviewWrite"
        component={ReviewWriteScreen}
        options={{
          title: "기록 작성",
          headerRight: () => (
            <HeaderBtn
              name="저장"
              onPress={() => dispatch(pressSave())}
            />
          )
        }}
      />
    </Stack.Navigator>
  );
}