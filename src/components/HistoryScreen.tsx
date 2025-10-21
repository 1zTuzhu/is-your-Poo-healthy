import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { AnalysisResult } from '../App';

interface HistoryScreenProps {
  results: AnalysisResult[];
  onBackToCamera: () => void;
  onViewItem: (result: AnalysisResult) => void;
}

export function HistoryScreen({ results, onBackToCamera, onViewItem }: HistoryScreenProps) {
  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'attention':
        return <Info className="w-4 h-4 text-yellow-500" />;
      case 'concern':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'concern':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthText = (health: string) => {
    switch (health) {
      case 'healthy':
        return '健康';
      case 'attention':
        return '注意';
      case 'concern':
        return '关注';
      default:
        return '未知';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToCamera}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">历史记录</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无检查记录</p>
              <p className="text-sm">开始第一次健康检查吧！</p>
            </div>
            <Button
              onClick={onBackToCamera}
              className="bg-green-500 hover:bg-green-600"
            >
              开始检查
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <Card 
                key={result.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onViewItem(result)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={result.imageUrl} 
                        alt="检查图片" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getHealthIcon(result.health)}
                          <Badge className={getHealthColor(result.health)}>
                            {getHealthText(result.health)}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(result.date)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span>布里斯托 {result.bristolType} 型</span>
                        <span className="mx-2">•</span>
                        <span>{result.color}</span>
                      </div>
                      
                      {result.issues && result.issues.length > 0 && (
                        <div className="text-xs text-gray-500 line-clamp-2">
                          主要问题: {result.issues.join('、')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}