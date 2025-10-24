import { QueryResultRow } from "react-native-nitro-sqlite";

interface BookOptions {
  title: string;
  authors: string[];
  publisher: string;
  thumbnail: string;
  datetime: string;
}

export default class Book {
  reviewId?: number;
  id?: number;
  title: string;
  authors: string[];
  publisher: string;
  thumbnail: string;
  year: number;

  constructor(param: QueryResultRow | BookOptions) {
    if ("review_id" in param) {
      this.reviewId = Number(param.review_id);
      this.id = Number(param.id);
      this.year = Number(param.year);
    }
    else {
      this.year = Number(param.datetime?.toString().slice(0, 4))
    }

    this.title = String(param.title);
    this.authors = String(param.authors).split(",");
    this.publisher = String(param.publisher);
    this.thumbnail = String(param.thumbnail);
  }
}