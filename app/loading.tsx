"use client"
export default function Loading() {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-black">
        <div
          className="w-10 h-10 rounded-full animate-spin
                      border-2 border-solid border-white border-t-transparent"
        ></div>
      </div>
    );
  }
  