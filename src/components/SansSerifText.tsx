import { Text, TextProps } from "react-native";
import { useAppTheme } from "./ThemeProvider";

interface SansSerifText extends TextProps {
  type?: "Light"|"Medium"|"Regular"|"SemiBold";
}

export default function SansSerifText(props: SansSerifText) {
  let type = props.type ?? "Regular";
  const theme = useAppTheme();

  return (
    <Text {...props}
      style={[
        {
          fontFamily: `Pretendard-${type}`,
          color: theme.text
        },
        props.style
      ]}
    >
      {props.children}
    </Text>
  )
}