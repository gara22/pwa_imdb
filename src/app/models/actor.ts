import { setImgPath } from './movie';

export interface Actor {
  biography: string;
  birthday: string;
  deathday: string;
  id: number;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  profile_path: string;
  media_type?: string;
}

export interface CastMember {
  character: string;
  id: number;
  name: string;
  profile_path: string;
}

export function serializeActor(
  biography: string,
  birthday: string,
  deathday: string,
  id: number,
  known_for_department: string,
  name: string,
  place_of_birth: string,
  profile_path: string,
  media_type: string = null
): Actor {
  return {
    biography: biography,
    birthday: birthday,
    deathday: deathday,
    id: id,
    known_for_department: known_for_department,
    name: name,
    place_of_birth: place_of_birth,
    profile_path: setImgPath(profile_path),
    media_type: media_type,
  };
}
