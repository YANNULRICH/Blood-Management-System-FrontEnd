import React from 'react';
import {Routes, Route} from "react-router-dom";

import Error404 from './Error404';
import Error403 from './Error403';
import {ERRORS} from "../../commons/urls/front";

const Errors = () => {
    return (
        <Routes>
            <Route path={ERRORS.ROUTES_ENGINE["403"]} element={<Error403 />} />
            <Route path='*' element={<Error404 />} />
        </Routes>
    );
};

export default Errors;
