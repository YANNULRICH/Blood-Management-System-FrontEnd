import React, { useContext, Suspense } from 'react';
import classNames from 'classnames';
import { useWindowSize } from 'react-use';
import PropTypes from 'prop-types';
import Content from '../Content/Content';
import HeaderRoutes from '../Header/HeaderRoutes';
import FooterRoutes from '../Footer/FooterRoutes';
import ThemeContext from '../../contexts/themeContext';
import ContentSkeletonLoader from "../../components/loaders/ContentSkeletonLoader";
import DefaultFooter from '../../pages/_layout/_footers/DefaultFooter';
import DefaultHeader from '../../pages/_layout/_headers/DefaultHeader';

export const WrapperContainer: React.FC<any> = ({ children, className, ...props }) => {
	const { rightPanel } = useContext(ThemeContext);
	return (
		<div
			className={classNames(
				'wrapper',
				{ 'wrapper-right-panel-active': rightPanel },
				className,
			)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}>
			{children}
		</div>
	);
};
WrapperContainer.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
WrapperContainer.defaultProps = {
	className: null,
};

const WrapperOverlay = () => {
	const { width } = useWindowSize();
	const { asideStatus, setAsideStatus, setLeftMenuStatus, setRightMenuStatus } =
		useContext(ThemeContext);

	if (asideStatus && width < Number(process.env.REACT_APP_MOBILE_BREAKPOINT_SIZE))
		return (
			<div
				role='presentation'
				onClick={() => {
					setAsideStatus(false);
					setLeftMenuStatus(false);
					setRightMenuStatus(false);
				}}
				className='wrapper-overlay'
			/>
		);
	return null;
};

export const Wrapper = () => {
	return (
		<>
			<WrapperContainer>
				<HeaderRoutes />
				<Content />
				<FooterRoutes />
			</WrapperContainer>
			<WrapperOverlay />
		</>
	);
};

export type WrapperLayoutProps = {
	withoutHeader?: boolean;
	withoutFooter?: boolean;
	children: React.ReactNode;
}

export const WrapperLayout = ({ withoutHeader = false, withoutFooter = true, children }: WrapperLayoutProps) => {
	return (
		<>
			<WrapperContainer>
				{!withoutHeader && (
					<DefaultHeader />
				)}

				<main className='content'>
					{/*<Suspense fallback={<ContentSkeletonLoader />}>*/}
					{children}
					{/*</Suspense>*/}
				</main>
				{!withoutFooter && (
					<DefaultFooter />
				)}
			</WrapperContainer>
			<WrapperOverlay />
		</>
	);
};

export default React.memo(WrapperLayout);
