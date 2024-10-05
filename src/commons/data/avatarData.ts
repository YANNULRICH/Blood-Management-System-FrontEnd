import UserImage2 from '../../assets/img/wanna/wanna2.png';
import UserImage2Webp from '../../assets/img/wanna/wanna2.webp';
import UserImage2Blur from '../../assets/img/wanna/wanna2-blur.png';
import UserImage2WebpBlur from '../../assets/img/wanna/wanna2-blur.webp';
import UserImage7 from '../../assets/img/wanna/wanna7.png';
import UserImage7Webp from '../../assets/img/wanna/wanna7.webp';
import UserImage7Blur from '../../assets/img/wanna/wanna7-blur.png';
import UserImage7WebpBlur from '../../assets/img/wanna/wanna7-blur.webp';

export type AvatarType = 'guy1' | 'girl1';

export type AvatarItem = {
    name: AvatarType,
    src: any,
    srcSet: any,
    srcBlur: any,
    srcSetBlur: any,
};

export const avatars: Record<AvatarType, AvatarItem> = {
    guy1: {
        name: 'guy1',
        src: UserImage2,
        srcSet: UserImage2Webp,
        srcBlur: UserImage2Blur,
        srcSetBlur: UserImage2WebpBlur,
    },
    girl1: {
        name: 'girl1',
        src: UserImage7,
        srcSet: UserImage7Webp,
        srcBlur: UserImage7Blur,
        srcSetBlur: UserImage7WebpBlur,
    },
}
