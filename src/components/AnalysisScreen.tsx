import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, History, AlertCircle, CheckCircle, Info, User } from 'lucide-react';
import { AnalysisResult } from '../App';

interface AnalysisScreenProps {
  imageUrl: string;
  analysis: AnalysisResult | null;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onBackToCamera: () => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  isGuest: boolean;
}

export function AnalysisScreen({ 
  imageUrl, 
  analysis,
  onAnalysisComplete, 
  onBackToCamera, 
  onViewHistory,
  onViewProfile,
  isGuest
}: AnalysisScreenProps) {
  const [analyzing, setAnalyzing] = useState(!analysis);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!analysis) {
      // 模拟AI分析过程
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              performAnalysis();
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [analysis]);

  const performAnalysis = () => {
    // 模拟AI分析结果
    const mockResult: AnalysisResult = {
      id: Date.now().toString(),
      imageUrl,
      date: new Date(),
      bristolType: Math.floor(Math.random() * 3) + 3, // 3-5型
      color: ['棕色', '黄褐色', '深褐色'][Math.floor(Math.random() * 3)],
      shape: ['香肠状', '条状', '软块状'][Math.floor(Math.random() * 3)],
      health: ['healthy', 'attention'][Math.floor(Math.random() * 2)] as 'healthy' | 'attention',
      issues: [],
      recommendations: []
    };

    // 根据类型生成建议
    if (mockResult.bristolType === 3 || mockResult.bristolType === 4) {
      mockResult.issues = ['肠道功能正常'];
      mockResult.recommendations = [
        '继续保持良好的饮食习惯',
        '每天保证充足的水分摄入',
        '适量运动有助于肠道健康'
      ];
    } else if (mockResult.bristolType === 5) {
      mockResult.health = 'attention';
      mockResult.issues = ['可能缺乏纤维素', '肠道蠕动较快'];
      mockResult.recommendations = [
        '增加膳食纤维摄入',
        '多吃粗粮、蔬菜和水果',
        '注意饮食规律，避免刺激性食物'
      ];
    }

    setAnalyzing(false);
    onAnalysisComplete(mockResult);
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'attention':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'concern':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
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
          <h1 className="text-lg">分析结果</h1>
          <div className="flex items-center space-x-2">
            {!isGuest && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onViewHistory}
                >
                  <History className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onViewProfile}
                >
                  <User className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Image Display */}
        <Card>
          <CardContent className="p-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt="分析图片" 
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        {analyzing && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">AI 正在分析中...</h3>
                <p className="text-gray-500 mb-4">请稍等，分析大约需要几秒钟</p>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-400 mt-2">{progress}%</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {!analyzing && analysis && (
          <>
            {/* Health Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getHealthIcon(analysis.health)}
                  <span>健康状态</span>
                  <Badge className={getHealthColor(analysis.health)}>
                    {getHealthText(analysis.health)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">布里斯托分型：</span>
                    <span className="font-medium">第 {analysis.bristolType} 型</span>
                  </div>
                  <div>
                    <span className="text-gray-500">颜色：</span>
                    <span className="font-medium">{analysis.color}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">形状：</span>
                    <span className="font-medium">{analysis.shape}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues */}
            {analysis.issues && analysis.issues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>发现问题</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.issues.map((issue, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>健康建议</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={onBackToCamera}
              >
                开始新的检查
              </Button>
              
              {!isGuest && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onViewHistory}
                >
                  查看历史记录
                </Button>
              )}
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>提醒：</strong>
                本分析结果仅供参考，不能替代专业医疗诊断。如有持续不适，请及时就医。
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}