import React from "react";
import "./App.css"; // Make sure you create this file!
//https://console.cloudinary.com/app/c-78659faad30eab1c254af189e17c88/assets/media_library/folders/cb7051465989432938625a6eefc18c3968?view_mode=mosaic
const images = [
    //github
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624857/gitHub_fxbhrz.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/002_xlgsow.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/031_jgmffk.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/032_sfzioc.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/033_ijmcur.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/034_heamae.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/008_ize7vg.png", //gitHub-react
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/015_owxi9z.png", //github-playwright
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/028_yfg9ol.png", //github-jmeter
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624857/react_ue3qus.png", //react
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/001_dg6slm.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/003_x03seq.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/004_m3xzsn.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/005_attpkt.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/006_lrcpcd.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/007_lusxtw.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/009_diakua.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/047_thiaga.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/049_hqkdjm.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/048_ckmk5x.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748626399/carusel_vu4tds.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624857/Playwright_xsqq1g.png",//playwright
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/010_zxkoet.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/011_oi5pem.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/012_uaqm1d.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/013_ysu4nw.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624858/jmeter_vfstkf.png",//jmeter
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/020_gfr02v.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/021_wphypt.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/024_rwywad.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/027_jfaxhg.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/022_hisk8u.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1748624857/Jenkins_ppfsb3.png",//jenkins
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525191/035_wctids.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747599411/036_ve5egl.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/046_iugg9m.png"
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
