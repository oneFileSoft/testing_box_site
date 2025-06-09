import React from "react";
import "./App.css"; // Make sure you create this file!
// https://splakhin.imgbb.com/
//https://console.cloudinary.com/app/c-78659faad30eab1c254af189e17c88/assets/media_library/folders/cb7051465989432938625a6eefc18c3968?view_mode=mosaic
const images = [
"https://i.ibb.co/4ZfTYy27/gitHub.png",
"https://i.ibb.co/r20K5w2m/002.png",
"https://i.ibb.co/V090X7qt/031.png",
"https://i.ibb.co/0yZ1NF23/032.png",
"https://i.ibb.co/p63yYMZN/033.png",
"https://i.ibb.co/W4YCY2wd/034.png",
"https://i.ibb.co/tMy8T0Z9/008.png",
"https://i.ibb.co/GvnKTLNf/015.png",
"https://i.ibb.co/Z6TBTWT9/028.png",
"https://i.ibb.co/wrbPf71p/react.png", //////////////////////////
"https://i.ibb.co/bg8tbVGy/001.png",
"https://i.ibb.co/tpRKS9G6/003.png",
"https://i.ibb.co/tMP3kcSj/004.png",
"https://i.ibb.co/XBQbSwd/005.png",
"https://i.ibb.co/VcbRJY6x/006.png",
"https://i.ibb.co/zVm4bDQv/007.png",
"https://i.ibb.co/pBWhx9CG/009.png",
"https://i.ibb.co/gFdbJZvL/047.png",
"https://i.ibb.co/vvQ7btpY/049.png",
"https://i.ibb.co/mV4C56xt/048.png",
"https://i.ibb.co/9HS2rXJK/carusel.png",
"https://i.ibb.co/GQxVWJVs/playwright.png", ////////
"https://i.ibb.co/v6knNkPx/010.png",
"https://i.ibb.co/fVDS8zdM/011.png",
"https://i.ibb.co/1JbnTcRj/012.png",
"https://i.ibb.co/My6fc84T/013.png",
"https://i.ibb.co/YFCptyWY/bash-aliases.png",
"https://i.ibb.co/PzY2TK3v/0113.png",
"https://i.ibb.co/kVDdS5ck/jmeter.png", ////////
"https://i.ibb.co/844P8Bkc/020.png",
"https://i.ibb.co/HDNtk3KT/021.png",
"https://i.ibb.co/Z1xvqZ2R/024.png",
"https://i.ibb.co/GfkBSVQ5/027.png",
"https://i.ibb.co/xS0BsLHp/022.png",
"https://i.ibb.co/HpdfYRrQ/jenkins.png", /////////
"https://i.ibb.co/h1TtqJFv/039.png",
"https://i.ibb.co/wZf5Vp2R/035.png",
"https://i.ibb.co/0RKSYTZV/036.png",
"https://i.ibb.co/F4FCLjDf/046.png"
];

export default function ImageCarousel() {
  return (
    <div className="carousel-wrapper">
      <div className="carousel-track">
        {images.map((src, index) => (
          <div className="carousel-image-container" key={index}>
            <img src={src} />
          </div>
        ))}
        // CI / CD pipeline ->->->->->->->
        {images.map((src, index) => (
              <div className="carousel-image-container" key={`dup-${index}`}>
                <img src={src} />
              </div>
            ))
        }
      </div>

    </div>
  );
}
