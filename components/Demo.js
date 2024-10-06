import React from 'react';

const Demo = () => {
  return (
    <section className="py-20 bg-[url('/images/BackgroundFinterpret3.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8"></h2>
        <div className=" h-[400px] max-w-4xl mx-auto">
          <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="App Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Demo;
