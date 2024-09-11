import {connect, ConnectedProps} from 'react-redux';
// import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import {StoreType} from "../store/redux.types";

/* Redux Provide */
const mapStateToProps = ({ requestGlobalLoader }: StoreType) => ({ requestGlobalLoader });
const mapDispatchToProps = {};

/* State and Props Type */
const RequestGlobalLoaderConnected = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof RequestGlobalLoaderConnected>;
/**
 * Display a loader indicating that a request is ongoing
 * @param requestGlobalLoader
 * @constructor
 */
const RequestGlobalLoader = ({ requestGlobalLoader }: PropsFromRedux) => (
    <div className="global-loader justify-content-center">
        {requestGlobalLoader && (
            <div className="global-loader-progress">
                <span className='global-loader-progress-bar'>
                    <span className='global-loader-progress-bar-content' />
                </span>
            </div>
        )}
        <div className={`${requestGlobalLoader ? 'global-loader-overlay' : ''}`} />
    </div>
);

export default RequestGlobalLoaderConnected(RequestGlobalLoader);