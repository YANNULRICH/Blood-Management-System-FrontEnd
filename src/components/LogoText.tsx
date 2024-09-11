import React, { FC } from 'react';
import classNames from 'classnames';
import logo from '../assets/img/landing2/logo-chart.webp';

interface ILogoTextProps extends React.HTMLAttributes<HTMLAnchorElement> {
	spanProps?: React.HTMLAttributes<HTMLSpanElement>,
	hideSubtitle?: boolean
}

const LogoText: FC<ILogoTextProps> = ({ spanProps = {}, hideSubtitle = false, className, ...restProps }) => {
	const { className: spanClassName, ...restSpanProps } = spanProps;
	return (
		<a
			// href="#"
			className={classNames('d-inline-block logo-text mb-3 mb-sm-0', className)}
			{...restProps}>
			<img src={logo} alt="logo" className="img-fluid header-scu-logo"/>
			{/*<span className={classNames(spanClassName, 'logo-title', hideSubtitle && 'no-subtitle')} {...restSpanProps}>CSU</span>*/}
			{/*<span className='logo-subtitle'> Card System</span>*/}
		</a>
	);
};

export default LogoText;
