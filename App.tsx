import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import RootNavigation from './src/navigations/RootNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { open } from 'react-native-nitro-sqlite';
import { navDarkTheme, navLightTheme } from './src/styles/navigationThemes';
import { darkTheme, lightTheme } from './src/styles/themes';
import ThemeProvider from './src/components/ThemeProvider';
import { Provider } from 'react-redux';
import store from './src/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  const colorScheme = useColorScheme();
  const navTheme = colorScheme==="dark" ? navDarkTheme : navLightTheme;
  const theme = colorScheme==="dark" ? darkTheme : lightTheme;

  const initDB = async () => {
    try {
      const db = open({
        name: "db.sqlite",
        location: "default"
      });

      await db.executeAsync(`
        CREATE TABLE IF NOT EXISTS review (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          star_rate INTEGER NOT NULL CHECK(star_rate >= 1 AND star_rate <= 5),
          text TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'paperBook',
          emotion TEXT NOT NULL DEFAULT 'happy',
          write_date TEXT NOT NULL
        );
      `);

      await db.executeAsync(`
        CREATE TABLE IF NOT EXISTS book (
          review_id INTEGER NOT NULL UNIQUE,
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          authors TEXT NOT NULL,
          publisher TEXT NOT NULL,
          thumbnail TEXT NOT NULL,
          year INTEGER NOT NULL,
          FOREIGN KEY (review_id)
            REFERENCES review (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        );
      `);
    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    initDB();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <StatusBar backgroundColor={theme.background} barStyle={colorScheme==="dark"?"light-content":"dark-content"} />
            <NavigationContainer theme={navTheme}>
              <RootNavigation />
            </NavigationContainer>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
