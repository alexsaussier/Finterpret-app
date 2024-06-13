import Image from "next/image";
//import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";
import ButtonLead from "@/components/ButtonLead";
import HeroImage from "@/public/images/HeroImage.jpg";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero1-background min-h-screen bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-20 py-8 lg:py-20 md:pt-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start w-full max-w-xl mx-auto">
        <h1
          className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4"
          style={{ lineHeight: "1.2" }}
        >
          Invest smartly{"\n "}
          <span style={{ color: "#05d8be" }}> using AI.</span>
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Connect your investment accounts to {config.appName}, and retrieve AI-augmented
          insights on your portfolio.
        </p>
      </div>
      <div className="w-full max-w-xl mx-auto">
        <Image
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
