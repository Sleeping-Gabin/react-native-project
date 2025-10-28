import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchStackParamList } from "./types";
import SearchScreen from "../screens/SearchScreen";
import NavHeader from "./NavHeader";

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchNavigation() { return (
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
    </Stack.Navigator>
  );
}