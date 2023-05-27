import { CameraIcon, GlobeAltIcon, MusicalNoteIcon, PaintBrushIcon, RocketLaunchIcon, TagIcon, TrophyIcon, UserCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export interface Category {
  slug: string;
  name: string;
  icon: any;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'art',
    name: 'Art',
    icon: PaintBrushIcon,
  },
  {
    slug: 'domain-names',
    name: 'Domain Names',
    icon: TagIcon,
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    icon: RocketLaunchIcon,
  },
  {
    slug: 'memberships',
    name: 'Memberships',
    icon: UserGroupIcon,
  },
  {
    slug: 'music',
    name: 'Music',
    icon: MusicalNoteIcon,
  },
  {
    slug: 'pfps',
    name: 'PFPs',
    icon: UserCircleIcon,
  },
  {
    slug: 'photography',
    name: 'Photography',
    icon: CameraIcon,
  },
  {
    slug: 'sports',
    name: 'Sports',
    icon: TrophyIcon,
  },
  {
    slug: 'virtual-worlds',
    name: 'Virtual Worlds',
    icon: GlobeAltIcon,
  },
]
