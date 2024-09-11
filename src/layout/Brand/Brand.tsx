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
			<div className='brand bg-primary'>
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
			{authUserData.person && (
				<div className="text-black mt-2">
					<div className="text-center">
						<img className="rounded-image" style={{width: "5rem", height: "5rem", borderRadius: "50%", border: "solid 1px black"}} src={authUserData.person?.pictureFile} alt="ilf"/>
					</div>

					<div className="text-center  d-flex flex-column">
						<span className="fw-bold" style={{fontSize: "1.3rem"}}>{authUserData.person?.name}</span>
						{/*<span>Lorem ipsum dolor sit amet.</span>*/}
					</div>
				</div>
			)}

		</div>

	);
};
Brand.propTypes = {
	asideStatus: PropTypes.bool.isRequired,
	setAsideStatus: PropTypes.func.isRequired,
};

export default Brand;
