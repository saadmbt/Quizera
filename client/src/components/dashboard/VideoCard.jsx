import { Play } from "lucide-react";

const VideoCard = ({ video }) => (
  <div 
    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    onClick={() => window.open(video.url, '_blank')}
  >
    <div className="relative aspect-video">
    <img
      src={video.thumbnail.replace('default', 'hqdefault')}
      alt={video.title}
      className="w-full h-full object-cover"
      onError={(e) => e.target.src = '/fallback-thumbnail.jpg'}
      width={480}
      height={360}
    />
    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
      {video?.duration || '10:00'}
    </div>
    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity duration-300">
      <Play className="h-14 w-14 text-white filter drop-shadow-lg transform hover:scale-110 transition-transform" fill="white" />
    </div>
    </div>
    <div className="p-4">
    <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
      {video.title}
    </h3>
    <div className="space-y-2">
      <p className="text-sm text-gray-700 font-medium truncate">
      {video.channel_title}
      </p>
      <div className="flex items-center text-xs text-gray-500">
      <span>{video?.views ? `${Number(video?.views).toLocaleString()||"80k"} views` : 'No views'}</span>
      <span className="mx-1.5">•</span>
      <span>{new Date(video.timestamp).toLocaleDateString() || 'Recently'}</span>
      </div>
    </div>
    </div>
  </div>
  );
export default VideoCard;