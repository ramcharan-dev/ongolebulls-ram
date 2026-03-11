import React from "react";
import HomeSection from "./HomeSection.jsx";
import FinancialGoals from "../FinancialGoals/FinancialGoals.jsx";
import HelpSection from "../HelpSection/HelpSection.jsx"
import KeyQuestions from "../KeyQuestions/KeytQuestions.jsx"
import AboutUsSection from "../AboutUsSection/AboutUsSection.jsx"
import FinancialServices from "../FinancialServices/FinancialServices.jsx"
import CorePrinciples from "../CorePrinciples/CorePrinciples.jsx"
import DataSecuritySection from "../DataSecurity/DataSecuritySection.jsx"
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs.jsx"



function Home() {
    return (
        <div className="home-page">

            <HomeSection />
            <FinancialGoals />
            <HelpSection />
            <KeyQuestions />
            <AboutUsSection />
            <FinancialServices />
            <CorePrinciples />
            <DataSecuritySection />
            <WhyChooseUs />



        </div>
    );
}

export default Home;
