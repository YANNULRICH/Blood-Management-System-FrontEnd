import React from 'react';
import classNames from 'classnames';

import "./style.scss"
import { ColorType } from '../../../component.types';

type CircleCheckAnimProps = {
	color: ColorType,
	isDarkMode: boolean
}

const CircleCheckAnim = ({ color, isDarkMode }: CircleCheckAnimProps) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg"
			 className={classNames("circle-check-anim", `circle-check-anim-` + color, isDarkMode && 'dark')} viewBox="0 0 24 24">
			<g strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10">
				<circle
					cx="12"
					cy="12"
					r="11.5"
					className={classNames("circle-check-anim-outline")}
				/>
				<circle
					cx="12"
					cy="12"
					r="11.5"
					className={classNames("circle-check-anim-fill")}
				/>
				<polyline
					className="circle-check-anim-tick"
					points="17,8.5 9.5,15.5 7,13"
				/>
			</g>
		</svg>
	);
};

export default CircleCheckAnim;
