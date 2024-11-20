import React from 'react';
import Footer from '../../../layout/Footer/Footer';
import IntlMessages from '../../../components/IntlMessages';

const DefaultFooter = () => {
	return (
		<Footer>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col'>
						<IntlMessages id='footer.copyright' />
					</div>
				</div>
			</div>
		</Footer>
	);
};

export default DefaultFooter;
