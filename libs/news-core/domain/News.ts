export type Category = string;

//   'general'
//   'science'
//   'sports'
//   'business'
//   'health'
//   'entertainment'
//   'tech'
//   'politics'
//   'food'
//   'travel'

export interface NewsProps {
  id?: string;
  title: string;
  categories: Category[];
  imgUrl: string;
  description: string;
  content: string;
  authorId: string;
  authorUsername: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetQuery {
  categories?: Category[] | string;
  author?: string;
  createdFrom?: string;
  createdTo?: string;
  limit: number;
  page: number;
}

export interface CreateNewsDto {
  title: string;
  categories: Category[];
  imgUrl: string;
  description: string;
  content: string;
  authorId: string;
  authorUsername: string;
}