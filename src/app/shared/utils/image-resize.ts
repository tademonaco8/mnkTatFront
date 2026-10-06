export interface ResizedImage {
  fileName: string;
  contentType: string;
  dataBase64: string; // sin el prefijo "data:...;base64,"
  previewUrl: string; // data URL para mostrar la miniatura
  bytes: number;
}

/**
 * Achica una foto en el navegador (lado mayor máx. `maxSide` px) y la pasa a JPEG,
 * así una foto de celular de 5 MB viaja como ~300 KB.
 */
export async function resizeImage(file: File, maxSide = 1600, quality = 0.82): Promise<ResizedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo no es una imagen.');
  }

  const bitmap = await loadImage(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo procesar la imagen.');

  // Fondo oscuro por si la imagen tiene transparencia (JPEG no la soporta).
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);

  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const dataBase64 = dataUrl.split(',')[1] ?? '';

  return {
    fileName: file.name.replace(/\.[^.]+$/, '') + '.jpg',
    contentType: 'image/jpeg',
    dataBase64,
    previewUrl: dataUrl,
    bytes: Math.round((dataBase64.length * 3) / 4)
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen.'));
    };
    img.src = url;
  });
}
