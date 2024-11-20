import React from 'react';
import Avatar from '../Avatar';
import UserAvatar, { UserAvatarProps } from './UserAvatar';
import { avatars } from '../../commons/data/avatarData';

type UserAvatarWrapperProps = {
	enrollmentFile: string | undefined,
	fullName: string,
	gender: 'M',
	size?: number,
	shape?: UserAvatarProps['shape']
}

const UserAvatarWrapper = ({ fullName, gender, enrollmentFile, size = 100, shape }: UserAvatarWrapperProps) => {
	const avatar = gender === 'M'
		? { src: avatars.guy1.srcBlur, srcSet: avatars.guy1.srcBlur }
		: { src: avatars.girl1.srcBlur, srcSet: avatars.girl1.srcBlur }

	return (
		<>
			{enrollmentFile ? (
				<UserAvatar
					avatar={enrollmentFile}
					name={fullName}
					width={size}
					height={size}
					shape={shape}
				/>
			) : (
				<Avatar
					src={avatar.src}
					srcSet={avatar.srcSet}
					size={size}
				/>
			)}
		</>
	);
};

export default UserAvatarWrapper;
