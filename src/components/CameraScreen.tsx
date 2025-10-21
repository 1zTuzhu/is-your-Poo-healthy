import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Camera, Upload, History, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface CameraScreenProps {
  onPhotoTaken: (imageUrl: string) => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
  isGuest: boolean;
}

export function CameraScreen({ onPhotoTaken, onViewHistory, onViewProfile, onLogout, isGuest }: CameraScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyze = () => {
    if (preview) {
      toast.success('开始分析...');
      onPhotoTaken(preview);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-6 h-6 text-green-500" />
            <h1 className="text-lg">健康检查</h1>
            {isGuest && (
              <Badge variant="secondary" className="text-xs">
                游客模式
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {!isGuest && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onViewHistory}
                  title="历史记录"
                >
                  <History className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onViewProfile}
                  title="个人中心"
                >
                  <User className="w-5 h-5" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              title={isGuest ? "退出" : "登出"}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Camera Area */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
            {preview ? (
              <img 
                src={preview} 
                alt="预览" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">点击下方按钮上传图片</p>
                <p className="text-sm text-gray-400">支持 JPG、PNG 等格式</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!preview ? (
            <Button
              className="w-full bg-green-500 hover:bg-green-600 h-12"
              onClick={handleCameraClick}
            >
              <Upload className="w-5 h-5 mr-2" />
              选择图片
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                className="w-full bg-green-500 hover:bg-green-600 h-12"
                onClick={handleAnalyze}
              >
                开始分析
              </Button>
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={handleRetake}
              >
                重新选择
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-3 text-gray-800">使用说明</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                1
              </span>
              拍摄或上传清晰的图片
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                2
              </span>
              确保光线充足，图片清晰
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                3
              </span>
              等待AI分析并查看健康建议
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>免责声明：</strong>
            本应用仅供参考，不能替代专业医疗诊断。如有健康问题，请咨询医生。
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}