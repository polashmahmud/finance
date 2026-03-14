const sharp = require('sharp');
const path = require('path');

const ANDROID_RES = 'd:/Sites/Me/finance/src-capacitor/android/app/src/main/res';
const SOURCE_ICON = 'd:/Sites/Me/finance/public/icons/icon-512x512.png';

// Android Adaptive Icon foreground sizes (108dp per density)
const foregroundSizes = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432,
};

// Legacy launcher icon sizes
const launcherSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

async function generateForegroundIcons() {
  console.log('Generating adaptive icon foreground images...');

  for (const [folder, size] of Object.entries(foregroundSizes)) {
    const outputPath = path.join(ANDROID_RES, folder, 'ic_launcher_foreground.png');

    // The mask is 72dp. To avoid cutoffs from circular masks, the max size of a square 
    // icon should be around 50dp. Let's use 50/108 to calculate the correct safe size.
    const safeZoneSize = Math.round(size * (50 / 108));
    const padding = Math.round((size - safeZoneSize) / 2);

    const resizedIcon = await sharp(SOURCE_ICON)
      .resize(safeZoneSize, safeZoneSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: resizedIcon, top: padding, left: padding }])
      .png()
      .toFile(outputPath);

    console.log(`  OK ${folder}/ic_launcher_foreground.png (${size}x${size})`);
  }
}

async function generateLauncherIcons() {
  console.log('Generating legacy launcher icons...');

  for (const [folder, size] of Object.entries(launcherSizes)) {
    const launcherPath = path.join(ANDROID_RES, folder, 'ic_launcher.png');

    // Legacy icons - adding some padding (around 15%) so they don't touch the edges completely
    const legacySafeSize = Math.round(size * 0.70);
    const padding = Math.round((size - legacySafeSize) / 2);

    const resizedIcon = await sharp(SOURCE_ICON)
      .resize(legacySafeSize, legacySafeSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: resizedIcon, top: padding, left: padding }])
      .png()
      .toFile(launcherPath);

    console.log(`  OK ${folder}/ic_launcher.png (${size}x${size})`);

    const roundPath = path.join(ANDROID_RES, folder, 'ic_launcher_round.png');
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: resizedIcon, top: padding, left: padding }])
      .png()
      .toFile(roundPath);

    console.log(`  OK ${folder}/ic_launcher_round.png (${size}x${size})`);
  }
}

async function main() {
  await generateForegroundIcons();
  await generateLauncherIcons();
  console.log('\nAll icons generated successfully!');
}

main().catch(console.error);
