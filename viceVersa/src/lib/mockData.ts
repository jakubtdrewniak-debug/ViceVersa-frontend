import type {Participant, User} from "../components/CreateTournament";
import type {TournamentDetails, Match} from "../components/TournamentView";
import type {PastTournament} from "../components/TournamentHistory";

export const MOCK_USERS: User[] = [
  {id: 'u_1', name: 'SpongeBob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpongeBob'},
  {id: 'u_2', name: 'Patrick', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick'},
  {id: 'u_3', name: 'Bugs Bunny', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BugsBunny'},
  {id: 'u_4', name: 'Daffy Duck', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DaffyDuck'},
  {id: 'u_5', name: 'Homer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HomerSimpson'},
  {id: 'u_6', name: 'Bart', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BartSimpson'},
  {id: 'u_7', name: 'Finn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FinnTheHuman'},
  {id: 'u_8', name: 'Jake', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JakeTheDog'},
];

export const MOCK_SOLOS: Participant[] = MOCK_USERS.map(u => ({
  id: `p_${u.id}`,
  name: u.name,
  avatar: u.avatar,
  isTeam: false,
  members: [u]
}));

export const MOCK_TEAMS: Participant[] = [
  {
    id: 't_1',
    name: 'Krusty Krab Crew',
    isTeam: true,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KKC',
    members: [MOCK_USERS[0], MOCK_USERS[1]] // SpongeBob & Patrick
  },
  {
    id: 't_2',
    name: 'Looney Tunes',
    isTeam: true,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LT',
    members: [MOCK_USERS[2], MOCK_USERS[3]] // Bugs & Daffy
  },
  {
    id: 't_3',
    name: 'Treehouse Bros',
    isTeam: true,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TB',
    members: [MOCK_USERS[6], MOCK_USERS[7]] // Finn & Jake
  },
];


export const MOCK_ALL_PARTICIPANTS = [...MOCK_SOLOS, ...MOCK_TEAMS];

export const MOCK_LIVE_TOURNAMENT: TournamentDetails = {
  id: 'tourney_live_1',
  name: 'Multiverse Showdown',
  game: 'MultiVersus',
  status: 'Live',
  format: 'single-elimination',
  entryType: 'solo',
  participants: [MOCK_SOLOS[6], MOCK_SOLOS[7], MOCK_SOLOS[0], MOCK_SOLOS[1]], // Finn, Jake, SpongeBob, Patrick
  matches: [

    {
      id: 'm_1',
      tournamentId: "tourney1",
      round: 1,
      status: 'Completed',
      player1: MOCK_SOLOS[6], player2: MOCK_SOLOS[0], // Finn vs SpongeBob
      winnerId: MOCK_SOLOS[6].id, score: {p1: 2, p2: 0}
    },
    {
      id: 'm_2',
      tournamentId: "tourney1",
      round: 1,
      status: 'Completed',
      player1: MOCK_SOLOS[7], player2: MOCK_SOLOS[1], // Jake vs Patrick
      winnerId: MOCK_SOLOS[7].id, score: {p1: 2, p2: 1}
    },

    {
      id: 'm_3',
      tournamentId: "tourney1",
      round: 2,
      status: 'In Progress',
      player1: MOCK_SOLOS[6], player2: MOCK_SOLOS[7], // Finn vs Jake
    }
  ] as Match[]
};


export const MOCK_UPCOMING_TOURNAMENT: TournamentDetails = {
  id: 'tourney_up_1',
  name: 'Cartoon Network 2v2',
  game: 'Brawlhalla',
  status: 'Upcoming',
  format: 'single-elimination',
  entryType: 'team',
  participants: MOCK_TEAMS,
  matches: []
};



export const MOCK_DASHBOARD_CARDS = [
  {
    id: MOCK_LIVE_TOURNAMENT.id,
    name: MOCK_LIVE_TOURNAMENT.name,
    game: MOCK_LIVE_TOURNAMENT.game,
    players: MOCK_LIVE_TOURNAMENT.participants.length,
    status: MOCK_LIVE_TOURNAMENT.status
  },
  {
    id: MOCK_UPCOMING_TOURNAMENT.id,
    name: MOCK_UPCOMING_TOURNAMENT.name,
    game: MOCK_UPCOMING_TOURNAMENT.game,
    players: MOCK_UPCOMING_TOURNAMENT.participants.length,
    status: MOCK_UPCOMING_TOURNAMENT.status
  },
];

export const MOCK_HISTORY: PastTournament[] = [
  {
    id: 'tourney_done_1',
    name: 'Bikini Bottom Rumble',
    game: 'Nick All-Star Brawl 2',
    dateCompleted: 'Mar 12, 2024',
    participantCount: 32,
    winner: MOCK_SOLOS[0] // SpongeBob won
  },
  {
    id: 'tourney_done_2',
    name: 'Warner Bros Tag Tournament',
    game: 'MultiVersus',
    dateCompleted: 'Feb 28, 2024',
    participantCount: 16,
    winner: MOCK_TEAMS[1] // Looney Tunes won
  },
  {
    id: 'tourney_done_3',
    name: 'Land of Ooo Regionals',
    game: 'Super Smash Bros Ultimate',
    dateCompleted: 'Jan 15, 2024',
    participantCount: 64,
    winner: MOCK_SOLOS[6] // Finn won
  },
  {
    id: 'tourney_done_4',
    name: 'Springfield Friday Locals',
    game: 'Tekken 8',
    dateCompleted: 'Jan 05, 2024',
    participantCount: 24,
    winner: MOCK_SOLOS[4] // Homer won
  },
  {
    id: 'tourney_done_5',
    name: 'Cartoon Network 2v2 Clash',
    game: 'Brawlhalla',
    dateCompleted: 'Dec 10, 2023',
    participantCount: 8,
    winner: MOCK_TEAMS[2] // Treehouse Bros won
  },
  {
    id: 'tourney_done_6',
    name: 'Krusty Krab Charity Bracket',
    game: 'Nick All-Star Brawl 2',
    dateCompleted: 'Nov 22, 2023',
    participantCount: 128,
    winner: MOCK_TEAMS[0] // Krusty Krab Crew won
  }
];