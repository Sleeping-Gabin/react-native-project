import { MaterialDesignIconsIconName } from "@react-native-vector-icons/material-design-icons";
import { QueryResultRow } from "react-native-nitro-sqlite";

export interface IconInfo {
  id: string;
  name: string;
  icon: MaterialDesignIconsIconName;
}

export const BookTypes: IconInfo[] = [
  {
    id: "paperBook",
    name: "종이책",
    icon: "book-open-blank-variant-outline"
  },
  {
    id: "eBook",
    name: "전자책",
    icon: "cellphone-text"
  },
  {
    id: "audioBook",
    name: "오디오북",
    icon: "headphones"
  }
]

export const Emotions: IconInfo[] = [
  {
    id: "happy",
    name: "행복",
    icon: "emoticon-excited-outline"
  },
  {
    id: "good",
    name: "재밌음",
    icon: "emoticon-happy-outline"
  },
  {
    id: "lol",
    name: "웃김",
    icon: "emoticon-lol-outline"
  },
  {
    id: "soso",
    name: "그럭저럭",
    icon: "emoticon-neutral-outline"
  },
  {
    id: "sad",
    name: "감동",
    icon: "emoticon-cry-outline"
  },
  {
    id: "bad",
    name: "별로",
    icon: "emoticon-angry-outline"
  },
  {
    id: "confuse",
    name: "복잡함",
    icon: "emoticon-confused-outline"
  },
  {
    id: "scary",
    name: "무서움",
    icon: "emoticon-dead-outline"
  },
]

export interface ReviewOption {
  starRate: number;
  text: string;
  type: IconInfo;
  emotion: IconInfo;
  date: Date;
}

export default class Review {
  id?: number;
  starRate: number;
  text: string;
  type: IconInfo;
  emotion: IconInfo;
  date: Date;

 getDateString() {
    const year = this.date.getFullYear();
    const month = String(this.date.getMonth() + 1).padStart(2, '0');
    const day = String(this.date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  }

  constructor (param: QueryResultRow | ReviewOption) {
    if ("id" in param) {
      this.id = Number(param.id);
      this.starRate = Number(param.star_rate);
      this.text = String(param.text);
      this.type = BookTypes.find(type => type.id===param.type)!;
      this.emotion = Emotions.find(emotion => emotion.id===param.emotion)!;
      this.date = new Date(String(param.write_date));
    }
    else {
      this.starRate = Number(param.starRate);
      this.text = String(param.text);
      this.type = BookTypes.find(type => type.id===param.type)!;
      this.emotion = Emotions.find(emotion => emotion.id===param.emotion)!;
      this.date = param.date as Date;
    }
  }
}