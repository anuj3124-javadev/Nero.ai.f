import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      <div className="text-center">
        <h2 className="text-slate-700 dark:text-white text-[42px] font-semibold">
          Powerful AI Tools
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>

        <div className="flex flex-wrap mt-10 justify-center">
          {AiToolsData.map((tool, index) => (
            <div
              key={index}
              className="p-8 m-4 max-w-xs rounded-2xl bg-[#FDFDFE] dark:bg-gray-800
                    shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:-translate-y-2 transition-all
                    duration-300 cursor-pointer"
              onClick={() => user && navigate(tool.path)}
            >
              <tool.Icon className="w-12 h-12 p-3 text-white rounded-xl" style=
              {{background:`linear-gradient(to bottom, ${tool.bg.from}, ${tool.
              bg.to})`}} />
              <h3 className="mt-6 mb-3 text-lg font-semibold dark:text-white">{tool.title}</h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm max-w-[95%] text-balance">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiTools;
