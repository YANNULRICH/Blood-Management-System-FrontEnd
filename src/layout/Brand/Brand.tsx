import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../components/icon/Icon';
import LogoText from '../../components/LogoText';
import img from "../../assets/img/wanna/wanna2.png"
import {useAppSelector} from "../../store/redux.types";

interface IBrandProps {
	asideStatus: boolean;
	setAsideStatus(...args: unknown[]): unknown;
}

const Brand: FC<IBrandProps> = ({ asideStatus, setAsideStatus }) => {
	const { settings, authUserData } = useAppSelector(({ settings, authUser, }) => ({
		settings,
		authUserData: authUser.data
	}));

	return (
		<div className=" pb-5">
			<div className='brand'>
				<div className='brand-logo'>
					<h1 className='brand-title '>
						<LogoText
							spanProps={{ className: 'text-white' }}
							hideSubtitle
						/>
					</h1>
				</div>

				<button
					type='button'
					className='btn brand-aside-toggle bg-dark'
					aria-label='Toggle Aside'
					onClick={() => setAsideStatus(!asideStatus)}>
					<Icon icon='FirstPage' className='brand-aside-toggle-close' />
					<Icon icon='LastPage' className='brand-aside-toggle-open' />
				</button>
			</div>

		</div>

	);
};
Brand.propTypes = {
	asideStatus: PropTypes.bool.isRequired,
	setAsideStatus: PropTypes.func.isRequired,
};

export default Brand;
