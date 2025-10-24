import { NavigatorScreenParams } from "@react-navigation/native";
import Book from "../entity/Book";

export type ReviewWriteParamList = {
  ReviewWrite: {
    mode: "modify" | "write",
    reviewId?: number,
    book?: Book
  };
}

export type ReviewStackParamList = {
  ReviewList: undefined;
  ReviewDetail: {
    reviewId: number,
  };
  ReviewWrite: ReviewWriteParamList["ReviewWrite"];
}

export type WriteStackParamList = {
  BookSearch: undefined;
  ReviewWrite:  ReviewWriteParamList["ReviewWrite"];
}

export type CalendarStackParamList = {
  Calendar: undefined;
}

export type TabParamList = {
  ReviewNav: NavigatorScreenParams<ReviewStackParamList>;
  WriteNav: NavigatorScreenParams<WriteStackParamList>;
  CalendarNav: NavigatorScreenParams<CalendarStackParamList>;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TabParamList {}
  }
}