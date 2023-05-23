export interface Raindrop {
  _id: number;
  link: string;
  title: string;
  excerpt: string;
  tags: string[];
  cover: {
    _id: number;
    type: string;
    url: string;
  };
  domain: string;
  lastUpdate: string;
  created: string;
}

export interface RaindropCollection {
  _id: number;
  title: string;
  parent: number;
  children: number[];
  cover: {
    _id: number;
    type: string;
    url: string;
  };
  public: boolean;
  items: Raindrop[];
}
