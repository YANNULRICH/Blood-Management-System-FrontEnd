import React from 'react';
import guestOneColor from '../../commons/helpers/colorHelper';
import Avatar from '../Avatar';
import classNames from 'classnames';

const getTwoLetter = (name: string): string => {
	const _name = name.toUpperCase();
	const _splited = _name.split(' ');
	return _splited.length > 1
		? `${_splited[0].charAt(0)}${_splited[1].charAt(0)}`
		: `${_name.charAt(0)}${_name.charAt(1)}`;
}

export type UserAvatarProps = {
	avatar: string | null
	name: string
	className?: string
	width?: number
	height?: number
	showTwoLetter?: boolean,
	shape?: 'rounded' | 'circular'
}

const UserAvatar = ({
						avatar = null,
						name = 'RF',
						className = '',
						width = 40,
						height = 40,
						showTwoLetter = false,
						shape = 'circular'
} : UserAvatarProps) => {
	const _name = name || '';
	return (
		<>
			{avatar ?
				<img
					src={avatar}
					alt={_name}
					className={classNames(`mr-15 align-self-center ${className}`, {
						'rounded-circle': shape === 'circular',
						'rounded': shape === 'rounded',
					})}
					width={width}
					height={height}
				/>
				: (
					<div
						style={{
							width,
							height,
							minWidth: width,
							minHeight: Number(height),
							backgroundColor: guestOneColor()
						}}
						className={classNames('d-inline-block border-radius-50 ', className)}>
						<div className="center-hor-ver w-100 h-100">
							<span className='text-white' style={{ fontSize: "1.5rem" }}>
								{showTwoLetter ? getTwoLetter(_name) : _name.charAt(0).toUpperCase()}
							</span>
						</div>
					</div>
				)
			}
		</>
	);
};

export default React.memo(UserAvatar);
