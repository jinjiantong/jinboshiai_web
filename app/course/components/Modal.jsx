export function ImageModal({ isOpen, onClose, imageUrl }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <button 
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10"
        onClick={onClose}
      >
        ✕
      </button>
      <img 
        src={imageUrl} 
        alt="放大图片"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export function VideoModal({ isOpen, onClose, videoUrl }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <button 
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10"
        onClick={onClose}
      >
        ✕
      </button>
      <video 
        src={videoUrl} 
        controls
        className="max-w-[90vw] max-h-[90vh] rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
