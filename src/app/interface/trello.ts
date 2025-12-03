export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  url: string;
  prefs: {
    backgroundColor?: string;
    backgroundImage?: string;
  };
  lists?: TrelloList[];
}

export interface TrelloList {
  id: string;
  name: string;
  cards?: TrelloCard[];
}

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  due: string | null;
  labels: Array<{ name: string; color: string }>;
  idList: string;
}