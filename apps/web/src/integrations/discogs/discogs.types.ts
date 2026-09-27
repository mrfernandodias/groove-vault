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
  results: DiscogsSearchResultDto[];
}

export interface DiscogsArtistDto {
  id: number;
  name: string;
  resource_url: string;
}

export interface DiscogsImageDto {
  type: "primary" | "secondary";
  uri: string;
  uri150: string;
  resource_url: string;
  width: number;
  height: number;
}

export interface DiscogsMasterDto {
  id: number;
  title: string;
  year?: number;
  artists: DiscogsArtistDto[];
  images?: DiscogsImageDto[];
  resource_url: string;
  uri: string;
}
