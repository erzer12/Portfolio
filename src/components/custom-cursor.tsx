"use client";

import { useEffect } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  useEffect(() => {
    const cursorBig = document.querySelector('.cursor__ball--big');
    const cursorSmall = document.querySelector('.cursor__ball--small');
    const hoverables = document.querySelectorAll('a, button, [role="button"], input, textarea, select');

    let posX = 0;
    let posY = 0;
    let mouseX = 0;
    let mouseY = 0;

    gsap.to({}, 0.016, {
      repeat: -1,
      onRepeat: function () {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;

        gsap.set(cursorBig, {
          css: {
            left: posX - 15,
            top: posY - 15,
          },
        });

        gsap.set(cursorSmall, {
          css: {
            left: mouseX - 5,
            top: mouseY - 5,
          },
        });
      },
    });

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseEnter = () => {
      gsap.to(cursorBig, {
        duration: 0.3,
        scale: 2,
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursorBig, {
        duration: 0.3,
        scale: 1,
      });
    };

    document.addEventListener('mousemove', onMouseMove);

    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <div className="cursor">
      <div className="cursor__ball cursor__ball--big ">
        <svg height="30" width="30">
          <circle cx="15" cy="15" r="12" strokeWidth="0"></circle>
        </svg>
      </div>
      <div className="cursor__ball cursor__ball--small">
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="4" strokeWidth="0"></circle>
        </svg>
      </div>
    </div>
  );
};

export default CustomCursor;
