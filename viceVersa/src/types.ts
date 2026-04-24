export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isTeam: boolean;
  members: User[];
}

export interface TournamentFormData {
  name: string;
  game: string;
  format: string;
  entryType: "solo" | "team";
  participants: Participant[];
}

export interface Match {
  id: string;
  tournamentId: string | null;
  round: number;
  status: "Pending" | "In Progress" | "Completed";
  player1: Participant | null;
  player2: Participant | null;
  winnerId?: string | null;
  score?: { p1: number; p2: number };
}

export interface TournamentDetails {
  id: string;
  name: string;
  game: string;
  status: "Upcoming" | "Live" | "Completed";
  format: string;
  entryType: "solo" | "team";
  participants: Participant[];
  matches: Match[];
}

export interface PastTournament {
  id: string;
  name: string;
  game: string;
  dateCompleted: string;
  participantCount: number;
  winner: User;
}

export interface TeamFormData {
  name: string;
  members: User[];
}

export interface PersonalMatch extends Match {
  tournamentName: string;
  date: string;
  result: "win" | "loss" | "draw";
}
