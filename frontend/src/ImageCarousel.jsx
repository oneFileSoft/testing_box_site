import React from "react";
import "./App.css"; // Make sure you create this file!
//https://console.cloudinary.com/app/c-78659faad30eab1c254af189e17c88/assets/media_library/folders/cb7051465989432938625a6eefc18c3968?view_mode=mosaic
const images = [
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/001_dg6slm.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/002_xlgsow.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/003_x03seq.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/004_m3xzsn.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/005_attpkt.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/006_lrcpcd.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525187/007_lusxtw.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/008_ize7vg.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/009_diakua.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/010_zxkoet.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525188/012_uaqm1d.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/013_ysu4nw.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/015_owxi9z.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/020_gfr02v.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/021_wphypt.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/022_hisk8u.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/024_rwywad.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525189/027_jfaxhg.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/028_yfg9ol.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/031_jgmffk.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/032_sfzioc.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/033_ijmcur.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525190/034_heamae.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525191/035_wctids.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747599411/036_ve5egl.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747599320/039_dpqv78.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/046_iugg9m.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/047_thiaga.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/049_hqkdjm.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747525192/048_ckmk5x.png",
  "https://res.cloudinary.com/dhytjj4rp/image/upload/v1747624802/050_ooj1gh.png"
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
      </div>

    </div>
  );
}
