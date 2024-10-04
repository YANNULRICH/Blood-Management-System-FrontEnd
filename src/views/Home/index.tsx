import React from 'react';
import "./home.scss"
import NavHeader from "./navigation/Nav";
import CardHeader from "./Card";
import lo1 from "../../assets/images/voir.jpeg"
import lo2 from "../../assets/images/logo/lo1.jpeg"
import lo3 from "../../assets/images/logo/lo2.jpeg"
import lo4 from "../../assets/images/logo/lo3.jpeg"
import blood from "../../assets/images/blood1.jpeg"

const Index = () => {
    return (
        <div className="home-global">
            <div className="home_header">
                <NavHeader mode={"home"} />
                <div className="h-100 w-100 d-flex align-items-center justify-content-end" style={{paddingRight: "18rem"}}>
                    <p className="textStyle">
                        Blood is not only a vital fluid in our bodies; it's a lifeline for those in need. Every donation can save multiple lives.
                        <div className="">
                            <button className="headerButton">Know more</button>
                        </div>
                    </p>
                </div>
                <div className="headerCard">
                    <div className="d-flex">
                        <CardHeader logo={lo1} text={"Making Your Donation"} />
                        <CardHeader logo={lo3} text={"Find a Donor\n" +
                        "Center"} />
                        <CardHeader logo={lo4} text={"Learn About\n" +
                        "Blood"} />
                        <CardHeader logo={lo2} text={"Can I Donate?"} />
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="d-flex flex-column community" style={{marginTop:"16rem"}}>
                    <h1 className="community__title">A Lifeline for Communities</h1>
                    <p className="community__content">
                        This application is designed to streamline and optimize the process of blood donation, storage,
                        and distribution. It serves as a centralized platform for donors, recipients, and site visitors
                        to connect and manage blood-related activities. By providing a user-friendly interface, the system
                        facilitates efficient blood collection, inventory management, and timely delivery to those in need
                        This technology aims to enhance the overall efficiency and effectiveness of blood management operations,
                        ensuring a reliable and sustainable supply of blood for critical medical
                    </p>
                </div>
                <div className="Donation">
                    <div className="row">
                        <div className="col-lg-6 col-12">
                            <img src={blood} className="Donation__image" alt=""/>
                        </div>
                    <div className="col-lg-6 col-12 Donation__content">
                        <h1 className="Donation__content__title">What is the process of donating blood</h1>
                        <p className="Donation__content__content">
                            Donatina pood invoves a ore neath
                            screenina. Dood donation. and
                            refreshments. Un average, a single blood
                            donation can save up to three ives
                        </p>
                        <p className="Donation__content__content1">
                            Only 5.5 million blood donations are made annually in Africa, falling short by over 1.5 million.
                        </p>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Index;