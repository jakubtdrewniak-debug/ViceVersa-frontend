export type EntryType = 'SOLO' | 'TEAM';
export type TournamentStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';
export type MatchStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface UserDto {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface ParticipantDto {
  id: string;
  name: string;
  avatar?: string;
  isTeam: boolean;
  members?: UserDto[];
}
export interface MatchScoreDto {
  p1: number;
  p2: number;
}
export interface TeamDto {
  id: string;
  name: string;
  avatar?: string;
  captain: UserDto;
  members: UserDto[];
}

export interface MatchDto {
  id: string;
  tournamentId: string | null;
  round: number;
  date: string;
  status: MatchStatus;
  player1: ParticipantDto | null;
  player2: ParticipantDto | null;
  winnerId: string | null;
  score: MatchScoreDto;
  player1Slot: boolean;
  nextMatchId: string | null;
}

export interface TournamentDto {
  id: string;
  name: string;
  game: string;
  type: EntryType;
  status: TournamentStatus;
  winnerId: string | null;
  matches: MatchDto[];
  format?: string;
}

export interface TournamentFormData {
  name: string;
  game: string;
  entryType: EntryType;
  participants: ParticipantDto[];
}

export interface TeamFormData {
  name: string;
  members: UserDto[];
}

export type HistorySearch = {
  filter?: 'all' | 'myTournaments'
}



