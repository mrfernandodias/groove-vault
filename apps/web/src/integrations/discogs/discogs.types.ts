export type DiscogsResultType = "release" | "master" | "artist" | "label";

export interface DiscogsSearchResultDto {
  id: number;
  type: DiscogsResultType;
  title: string;
  year?: number | string;
  cover_image?: string;
  thumb?: string;
  resource_url: string;
  uri: string;
  master_id?: number;
}

export interface DiscogsSearchResponseDto {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
  results: DiscogsSearchResultDto;
}
