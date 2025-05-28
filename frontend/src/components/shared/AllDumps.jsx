import React from "react";
import Button from "../ui/Button";
import allDumps from "../../data/allDumps.json";

const AllDumps = () => {
  return (
    <section className="py-10 px-6 md:px-12">
      <h2 className="text-2xl font-bold text-center mb-6">All Other Dumps</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 justify-items-center">
        {allDumps.map((dump, index) => (
          <Button
            key={index}
            variant="none"
            className="w-full text-xs sm:text-sm md:text-base bg-[#DC143C] text-white text-center"
          >
            {dump}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default AllDumps;
