import { ISourSize } from '../core/interface';

export async function getImageSize(img: HTMLImageElement): Promise<ISourSize> {
  return new Promise<ISourSize>((resolve, reject) => {
    let checkerTimer: NodeJS.Timer;
    let finished = false;

    // 定时执行获取宽高
    const check = function () {
      // 只要任何一方大于0 表示已经服务器已经返回宽高
      if (img.width > 0 || img.height > 0) {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
        });
        window.clearInterval(checkerTimer);
        finished = true;
        img.onload = null;
        img.onerror = null;
      }
    };
    checkerTimer = setInterval(check, 40);
    // 加载完成获取宽高
    img.onload = function () {
      if (finished) return;
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      });
    };
    img.onerror = function (e) {
      reject(e);
    };
  });
}
