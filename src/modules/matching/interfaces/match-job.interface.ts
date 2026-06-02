export interface LostItemMatchJob {
  lostPostId: number;
}

export interface PostTextSnapshot {
  id: number;
  title: string;
  description: string;
}

export interface MatchCandidate {
  foundPostId: number;
  score: number;
}
