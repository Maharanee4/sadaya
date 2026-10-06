const AVATAR_ART = {
  Jepun: { color: '#c46a22', background: '#fff0c9', accent: '#f4bf48' },
  Cempaka: { color: '#bd8b24', background: '#fff5d7', accent: '#f2d76a' },
  Sandat: { color: '#c45b74', background: '#fde6ea', accent: '#f3a7ad' },
  Padma: { color: '#b74768', background: '#fbe1ec', accent: '#e99ab9' },
  Melati: { color: '#648649', background: '#f1f4dc', accent: '#fffdf0' },
  Kenanga: { color: '#b88a28', background: '#fff1c8', accent: '#efd16c' },
  Kamboja: { color: '#d3743d', background: '#ffead9', accent: '#f5bd76' },
  Tunjung: { color: '#536fa1', background: '#e5effc', accent: '#9bb9ec' },
  Jempiring: { color: '#598351', background: '#e7f2df', accent: '#d7e7a0' },
};
const FLOWER_AVATARS = Object.keys(AVATAR_ART);
const LEGACY_AVATARS = ['Jembrana', 'Tabanan', 'Badung', 'Gianyar', 'Klungkung', 'Bangli', 'Karangasem', 'Buleleng', 'Denpasar'];

export const getFlowerAvatarArt = (avatar) => AVATAR_ART[avatar] || AVATAR_ART.Jepun;
export const getFlowerAvatarOptions = () => FLOWER_AVATARS;
export const normalizeBaliAvatar = (avatar) => FLOWER_AVATARS.includes(avatar)
  ? avatar
  : LEGACY_AVATARS.includes(avatar) ? FLOWER_AVATARS[LEGACY_AVATARS.indexOf(avatar)] : 'Jepun';
