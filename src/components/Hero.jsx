import heroImg from "../assets/photos/high/428A9355-2-3648x2392.webp";

export const Hero = () => {
  return (
    <section id="#">
      <div className="relative h-svh w-full overflow-hidden">
        <img
          className="absolute top-0 object-cover object-center w-full h-full"
          src={heroImg}
          width="3648"
          height="2392"
          sizes="100vw"
          alt="Hero background representing a gallery"
        />

        <div className="absolute right-0 top-0 h-full w-full bg-black opacity-20"></div>

        <div className="absolute right-0 top-0 h-full w-full p-8 text-white md:px-12 md:pt-14">
          <div className="relative h-full">
            <h1 className="absolute [writing-mode:sideways-lr] uppercase bottom-5 left-0 whitespace-nowrap md:bottom-1/2 md:translate-y-1/2">
              <span className="text-[16px] md:text-[18px]">
                Gallery By a6400_pixels
              </span>
            </h1>
            <div className=" absolute top-[6px] left-0 text-center">
              <h1 className="text-md md:text-[18px] px-2">ALEX + SARA</h1>
            </div>
            <a className="flex items-center absolute top-0 right-0">
              <div className="h-8 w-8 shrink-0 overflow-hidden flex items-center justify-center bg-purple-200 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <g transform="translate(2 3)">
                    <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                    <circle cx="10" cy="10" r="4" />
                  </g>
                </svg>
              </div>
              <span className="text-center text-[18px] ml-2">pic-share</span>
            </a>
            <div className="absolute bottom-0 right-0 md:right-1/2 md:translate-x-1/2">
              <button
                onClick={() =>
                  window.scrollBy({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
                className="cursor-pointer"
              >
                <div className="svg-control pointer-events-none w-4 animate-bounce">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 9L12 15L6 9"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
