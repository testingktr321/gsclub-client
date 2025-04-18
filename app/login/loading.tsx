"use client"
import { Loader } from 'lucide-react';
import React from 'react';

const Loading = () => {
  return (
    <div className="h-[85vh] flex justify-center items-center">
      <Loader className="w-6 h-6 -mt-10 animate-spin" />
    </div>
  );
};

export default Loading;
