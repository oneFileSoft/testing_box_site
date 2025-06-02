import React from "react";
import "./App.css"; // Make sure you create this file!
// https://splakhin.imgbb.com/
//https://console.cloudinary.com/app/c-78659faad30eab1c254af189e17c88/assets/media_library/folders/cb7051465989432938625a6eefc18c3968?view_mode=mosaic
const images = [
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624857/gitHub_fxbhrz.png",
"https://i.ibb.co/4ZfTYy27/gitHub.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/002_xlgsow.png",
"https://i.ibb.co/r20K5w2m/002.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/031_jgmffk.png",
"https://i.ibb.co/V090X7qt/031.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/032_sfzioc.png",
"https://i.ibb.co/0yZ1NF23/032.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/033_ijmcur.png",
"https://i.ibb.co/p63yYMZN/033.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/034_heamae.png",
"https://i.ibb.co/W4YCY2wd/034.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/008_ize7vg.png", //gitHub-react
"https://i.ibb.co/tMy8T0Z9/008.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/015_owxi9z.png", //github-playwright
"https://i.ibb.co/GvnKTLNf/015.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/028_yfg9ol.png", //github-jmeter
"https://i.ibb.co/Z6TBTWT9/028.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624857/react_ue3qus.png", //react
"https://i.ibb.co/wrbPf71p/react.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/001_dg6slm.png",
"https://i.ibb.co/bg8tbVGy/001.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/003_x03seq.png",
"https://i.ibb.co/tpRKS9G6/003.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/004_m3xzsn.png",
"https://i.ibb.co/tMP3kcSj/004.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/005_attpkt.png",
"https://i.ibb.co/XBQbSwd/005.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/006_lrcpcd.png",
"https://i.ibb.co/VcbRJY6x/006.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/007_lusxtw.png",
"https://i.ibb.co/zVm4bDQv/007.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/009_diakua.png",
"https://i.ibb.co/pBWhx9CG/009.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/047_thiaga.png",
"https://i.ibb.co/gFdbJZvL/047.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/049_hqkdjm.png",
"https://i.ibb.co/vvQ7btpY/049.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/048_ckmk5x.png",
"https://i.ibb.co/mV4C56xt/048.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748626399/carusel_vu4tds.png",
"https://i.ibb.co/9HS2rXJK/carusel.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624857/Playwright_xsqq1g.png",//playwright
"https://i.ibb.co/GQxVWJVs/playwright.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/010_zxkoet.png",
"https://i.ibb.co/v6knNkPx/010.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/011_oi5pem.png",
"https://i.ibb.co/fVDS8zdM/011.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/012_uaqm1d.png",
"https://i.ibb.co/1JbnTcRj/012.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/013_ysu4nw.png",
"https://i.ibb.co/My6fc84T/013.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624858/jmeter_vfstkf.png",//jmeter
"https://i.ibb.co/kVDdS5ck/jmeter.png"
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/020_gfr02v.png",
"https://i.ibb.co/844P8Bkc/020.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/021_wphypt.png",
"https://i.ibb.co/HDNtk3KT/021.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/024_rwywad.png",
"https://i.ibb.co/Z1xvqZ2R/024.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/027_jfaxhg.png",
"https://i.ibb.co/GfkBSVQ5/027.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/022_hisk8u.png",
"https://i.ibb.co/xS0BsLHp/022.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624857/Jenkins_ppfsb3.png",//jenkins
"https://i.ibb.co/HpdfYRrQ/jenkins.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525191/035_wctids.png",
"https://i.ibb.co/wZf5Vp2R/035.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747599411/036_ve5egl.png",
"https://i.ibb.co/0RKSYTZV/036.png",
//   "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/046_iugg9m.png"
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
