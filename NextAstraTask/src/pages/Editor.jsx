
import { useEffect, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function Editor({ imageSrc }) {
  const canvasRef = useRef();
  const imgRef = useRef();

  useEffect(() => {
    const detect = async () => {
      const model = await cocoSsd.load();
      const predictions = await model.detect(imgRef.current);

      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(imgRef.current, 0, 0);

      predictions.forEach(pred => {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(...pred.bbox);
        ctx.fillText(pred.class, pred.bbox[0], pred.bbox[1] - 4);
      });
    };

    if (imgRef.current.complete) detect();
    else imgRef.current.onload = detect;
  }, [imageSrc]);

  return (
    <div className="relative">
      <img ref={imgRef} src={imageSrc} alt="Uploaded" className="hidden" />
      <canvas ref={canvasRef} width={640} height={480} className="border" />
    </div>
  );
}
