import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CalendarStackParamList } from "./types";
import CalendarScreen from "../screens/CalendarScreen";
import NavHeader from "./NavHeader";

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export default function CalendarNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerBackground: () => <NavHeader />,
      }}
    >
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: "달력"
        }}
      />
    </Stack.Navigator>
  )
}