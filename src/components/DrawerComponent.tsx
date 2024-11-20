import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {makeStyles} from '@mui/styles';
import Card, {CardBody, CardTitle} from "./bootstrap/Card";
import {useNavigate} from "react-router-dom";
import clsx from 'clsx';
import Button from "./bootstrap/Button";
import {globalT} from '../lang';
import './Cartp.scss'

type drawer = {
    type: 'right' | 'top' | 'bottom' | 'left',
    onclose: () => void,
    onOpen: () => void,
    data: any[] | null,
    open: boolean,
    label?: string
    children?: React.ReactNode,


}

const useStyles = makeStyles((theme) => ({
    root: {
        background: 'linear-gradient(135deg,  0%, rgba(255, 165, 0, 0.5) 50%, rgba(0, 128, 0, 0.5) 100%)',
        width: 320,
    },
}));

const DrawerComponent = ({type, onclose, open, data, onOpen, children, label}: drawer) => {

    const navigate = useNavigate()
    const classes = useStyles();


    return (
        <div>

            <div className="">
                <SwipeableDrawer
                    anchor={type}
                    open={open}
                    onClose={onclose}
                    onOpen={onOpen}
                    classes={{ paper: clsx(classes.root) }}
                >
                    {label && (
                        <div className="d-flex justify-content-between text-white mt-4 ms-2 me-3">
                            <span className='fw-bold text-black menu-title'>{ label}</span>
                            <Button
                                className='bg-orange'
                                color={"primary"}
                                onClick={onclose}
                                icon='close'
                            />
                        </div>
                    )}

                    <div className="">
                        {data ? (
                            data.map(d => (
                                <div className='mb-3 mb-2'>
                                    <Card>

                                        <CardTitle className="text-underline" style={{marginLeft:'20px'}}>
                                            {d.categoryName}
                                        </CardTitle>

                                        <CardBody className='fw-bold'>
                                            {d.ville}: {d.value}
                                        </CardBody>
                                    </Card>
                                </div>

                            )
                        ) ) : (
                            children
                        )}
                    </div>

                </SwipeableDrawer>
            </div>


        </div>
    );
};

export default DrawerComponent;