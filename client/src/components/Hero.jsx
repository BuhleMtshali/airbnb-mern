import React from 'react';
export const Hero = () => {
  return <div className="relative w-full h-[500px] md:h-[600px] bg-black mt-3">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Beautiful vacation rental by the lake" className="w-full h-full object-cover opacity-80" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Find your place in the world
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
          Discover unique stays and experiences that let you live like a local
        </p>
        <button className="bg-gradient-to-r from-[#E61E4D] to-[#D70466] hover:from-[#D70466] hover:to-[#E61E4D] text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition-all">
          Explore Nearby
        </button>
      </div>
    </div>;
};