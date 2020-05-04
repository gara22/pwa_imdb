export interface Actor {
  biography: string;
  birthday: string;
  deathday: string;
  id: number;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  profile_path: string;
}

export interface CastMember {
  character: string;
  id: number;
  name: string;
  profile_path: string;
}
