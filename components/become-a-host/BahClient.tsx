"use client";
import { Bike } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";

const BahClient = () => {
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-8">
      <h1 className="text-3xl font-semibold">Welcome back, Sudip</h1>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Finish your listing</h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => {
            return (
              <Link
                href="/"
                key={i}
                className="p-6 rounded-xl border border-border flex items-center gap-4 hover:bg-accent/30 hover:border-secondary/80 transition-colors duration-200 ease-in-out"
              >
                <div className="rounded-sm bg-accent/50 p-3 w-fit h-fit">
                  <Bike className="size-6" />
                </div>
                <div className="font-medium text-lg">Your bike listing</div>
              </Link>
            );
          })}
        </div>
        <button className="w-fit text-sm font-medium border-b hover:border-b-2 border-secondary/80 cursor-pointer">
          Show all
        </button>
      </div>

      <div className="flex flex-col mt-6 gap-2">
        <h2 className="text-xl font-semibold">Start a new listing</h2>
        <Link
          href="/"
          className="py-6 border-b border-border flex items-center gap-4 justify-between"
        >
          <div className="flex items-center gap-8 font-medium text-lg">
            <div className="relative">
              <Bike className="size-7" />
              <IoMdAddCircleOutline className="size-5 absolute -top-2 -right-4" />
            </div>
            Create a new listing
          </div>
          <FiChevronRight className="size-6" />
        </Link>
      </div>
    </div>
  );
};

export default BahClient;
