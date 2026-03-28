export type ScoreDto = {
  id: number;
  tastingId: number;
  memberId: number;
  position: number;
  score: number;
};

export type ScoreCreateDto = {
  memberId: number;
  position: number;
  score: number;
};

export type ScoresConfig = {
  numberOfPositions: number;
  participantIds: number[];
  revealed: boolean;
};
