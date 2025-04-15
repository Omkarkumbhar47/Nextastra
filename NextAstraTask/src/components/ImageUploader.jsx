import React, { useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Transformer,
} from "react-konva";

const MAX_WIDTH = 600;
const MAX_HEIGHT = 600;

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [scaledDims, setScaledDims] = useState({
    width: 0,
    height: 0,
    scale: 1,
  });
  const [rects, setRects] = useState([]);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const stageRef = useRef();
  const [selectedId, setSelectedId] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = scale;

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setPosition(newPos);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const scale = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height, 1);
      setImage(img);
      setScaledDims({
        width: img.width * scale,
        height: img.height * scale,
        scale,
      });

      setLoading(true);
      const net = await bodyPix.load();
      const segmentation = await net.segmentPerson(img);
      const newRects = getBoundingBoxes(segmentation, scale);
      setRects(newRects);
      setLoading(false);

      setUploadedImageId(Date.now().toString()); // placeholder ID
    };
  };

  const getBoundingBoxes = (segmentation, scale = 1) => {
    const rect = getBoundingBox(segmentation, scale);
    return rect ? [rect] : [];
  };

  const getBoundingBox = (segmentation, scale = 1) => {
    const { data, width, height } = segmentation;
    let top = height,
      left = width,
      right = 0,
      bottom = 0;

    data.forEach((val, idx) => {
      if (val === 1) {
        const x = idx % width;
        const y = Math.floor(idx / width);
        top = Math.min(top, y);
        left = Math.min(left, x);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    });

    if (top >= bottom || left >= right) return null;

    return {
      x: left * scale,
      y: top * scale,
      width: (right - left) * scale,
      height: (bottom - top) * scale,
      stroke: "red",
      draggable: true,
      id: Date.now().toString(),
    };
  };

  const handleDragEnd = (e, id) => {
    const updated = rects.map((rect) =>
      rect.id === id ? { ...rect, x: e.target.x(), y: e.target.y() } : rect
    );
    setRects(updated);
  };

  const handleDelete = (id) => {
    setRects(rects.filter((rect) => rect.id !== id));
  };

  const clearAll = () => {
    setRects([]);
  };

  const saveBoundaries = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const res = await fetch("http://localhost:5000/api/image/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageId: uploadedImageId,
          rects,
        }),
      });

      const data = await res.json();
      console.log("Saved:", data);
      alert("Boundaries saved to DB!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed. Are you logged in?");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="flex flex-col items-center space-y-4 gap-4">
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="text-white file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-full hover:file:bg-blue-700"
        />
        {loading && (
          <p className="text-blue-300 animate-pulse">
            Detecting person in image...
          </p>
        )}

        {rects.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
            >
              Clear All
            </button>
            <button
              onClick={saveBoundaries}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Save Boundaries
            </button>
            {selectedId && (
              <button
                onClick={handleDelete}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg"
              >
                Delete Selected
              </button>
            )}
          </div>
        )}

        {image && (
          <div className="overflow-auto border rounded shadow-lg inline-block max-w-full max-h-[78vh]">
            <Stage
              width={window.innerWidth - 100}
              height={window.innerHeight - 270}
              draggable
              scaleX={scale}
              scaleY={scale}
              x={position.x}
              y={position.y}
              onWheel={handleWheel}
              ref={stageRef}
            >
              <Layer>
                <KonvaImage
                  image={image}
                  width={scaledDims.width}
                  height={scaledDims.height}
                />
                {rects.map((rect) => (
                  <Rect
                    key={rect.id}
                    id={rect.id}
                    {...rect}
                    onClick={() => setSelectedId(rect.id)}
                    onTap={() => setSelectedId(rect.id)}
                    onDragEnd={(e) => handleDragEnd(e, rect.id)}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();

                      const updated = rects.map((r) =>
                        r.id === rect.id
                          ? {
                              ...r,
                              x: node.x(),
                              y: node.y(),
                              width: Math.max(20, node.width() * scaleX),
                              height: Math.max(20, node.height() * scaleY),
                            }
                          : r
                      );

                      node.scaleX(1);
                      node.scaleY(1);
                      setRects(updated);
                    }}
                  />
                ))}
                {selectedId && (
                  <Transformer
                    nodes={[stageRef.current.findOne(`#${selectedId}`)]}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 20 || newBox.height < 20)
                        return oldBox;
                      return newBox;
                    }}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
