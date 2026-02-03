import Hero from "../components/Hero";
// import Services from "../components/Services";
// import Portfolio from "../components/Portfolio";
import Team from "../components/Team";
import Technologies from "../components/Technologies";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Portfolio2 from "../components/Portfolio2.tsx";

const Home = () => {
    return (
        <>
            <Hero/>
            {/* <Services/> */}
            {/* <Portfolio/> */}
            <Portfolio2/>
            <Team/>
            <Technologies/>
            <Testimonials/>
            <Contact/>
        </>
    );
};

export default Home;
