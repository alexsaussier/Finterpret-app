import Image from "next/image";
//import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";
import HeroImage from "@/public/images/HeroImage.jpg";
import "./Hero.css";
import ButtonSignin from "./ButtonSignin";


const Hero = () => {
  return (
    <section className="hero1-background min-h-screen bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 px-6 md:px-16 lg:px-20 py-8 md:py-16 lg:py-20">
      
      

      <div className="flex flex-col gap-10 lg:gap-10 items-center justify-center text-center lg:text-left lg:items-start w-full max-w-xl mx-auto">
        
        <a href="https://www.producthunt.com/posts/finterpret?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-finterpret" target="_blank">
          <Image 
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=478329&theme=light" 
            alt="Finterpret - LLM-Powered Analytics for retail investors | Product Hunt" 
            width={250}
            height={54}
            style={{ width: "250px", height: "54px" }}
            unoptimized
          />      
        </a>
        
        <h1
          className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4"
          style={{ lineHeight: "1.2" }}
        >
          Make smarter investment decisions{"\n "}
          <span style={{ color: "#05d8be" }}> using AI.</span>
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Connect your investment accounts to {config.appName}, and retrieve
          AI-augmented insights on your portfolio.
        </p>

        <div className="items-center justify-center ">
          <ButtonSignin/>
        </div>

        <p className="text-sm opacity-80 leading-relaxed">
          Finterpret is entirely free. We are looking to get your feedback, please email me with your thoughts at alex@finterpret.co
        </p>
        
        
        
      </div>
      <div className="w-full max-w-xl mx-auto relative">
        <Image
          unoptimized
          src={HeroImage}
          alt="Product Demo"
          className="w-full"
          priority={true}
          width={600}
          height={600}
        />
        
        
      </div>
      {/* For the Hero & CTA use this 👇 */}
      {/* 
      <ButtonLead />
      */}
      <div>{/*<TestimonialsAvatars priority={true}  />*/}</div>
      {/*<div className="lg:w-full">
        <Image
          src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
          alt="Product Demo"
          className="w-full"
          priority={true}
          width={500}
          height={500}
        />
      </div>*/}
    </section>
  );
};

export default Hero;
