export interface Post {
  id: number;
  title: string;
  body: string;
  author: {
    id: number;
    profile_image: string | {};
    is_fake: 0 | 1;
    username: string;
    name: string;
    email: string | null;
    email_verified_at: null;
    remember_token: null;
    created_at: string;
    updated_at: string;
  };
  image: string | {};
  tags: Array<string>;
  created_at: string;
  comments_count: number;
}

export interface PostWithComments extends Post {
  comments: PostComment[];
}

export interface PostComment {
  id: number;
  body: string;
  author: {
    id: number;
    profile_image: string | {};
    is_fake: 0 | 1;
    username: string;
    name: string;
    email: string | null;
    email_verified_at: null;
    remember_token: null;
    created_at: string;
    updated_at: string;
  };
}
