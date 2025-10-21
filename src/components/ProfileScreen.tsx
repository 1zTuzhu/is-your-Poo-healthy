import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, LogOut, TrendingUp, Calendar, Activity, BarChart3 } from 'lucide-react';
import { AnalysisResult } from '../App';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ProfileScreenProps {
  username: string;
  results: AnalysisResult[];
  onBackToCamera: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ username, results, onBackToCamera, onLogout }: ProfileScreenProps) {
  // 统计数据
  const totalChecks = results.length;
  const last7Days = results.filter(r => {
    const daysDiff = (new Date().getTime() - r.date.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7;
  }).length;

  // 健康状态统计
  const healthStats = {
    healthy: results.filter(r => r.health === 'healthy').length,
    attention: results.filter(r => r.health === 'attention').length,
    concern: results.filter(r => r.health === 'concern').length,
  };

  // 布里斯托类型统计
  const bristolStats = Array.from({ length: 7 }, (_, i) => ({
    type: `第${i + 1}型`,
    count: results.filter(r => r.bristolType === i + 1).length,
  }));

  // 健康状态饼图数据
  const pieData = [
    { name: '健康', value: healthStats.healthy, color: '#22c55e' },
    { name: '注意', value: healthStats.attention, color: '#f59e0b' },
    { name: '关注', value: healthStats.concern, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // 最近7天趋势数据
  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayResults = results.filter(r => {
      const resultDate = new Date(r.date);
      return resultDate.toDateString() === date.toDateString();
    });
    
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      healthy: dayResults.filter(r => r.health === 'healthy').length,
      attention: dayResults.filter(r => r.health === 'attention').length,
      concern: dayResults.filter(r => r.health === 'concern').length,
    };
  });

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
          <h1 className="text-lg">个人中心</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* User Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-green-500 text-white text-xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{username}</h2>
                <p className="text-gray-500">健康管理用户</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{totalChecks}</p>
                  <p className="text-sm text-gray-500">总检查次数</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{last7Days}</p>
                  <p className="text-sm text-gray-500">近7天检查</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Status Distribution */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>健康状态分布</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bristol Scale Distribution */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>布里斯托分类统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bristolStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 7-Day Trend */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>近7天趋势</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last7DaysData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="healthy" stroke="#22c55e" name="健康" />
                    <Line type="monotone" dataKey="attention" stroke="#f59e0b" name="注意" />
                    <Line type="monotone" dataKey="concern" stroke="#ef4444" name="关注" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>健康建议</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthStats.healthy > healthStats.attention + healthStats.concern && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  优秀
                </Badge>
                <p className="text-sm">您的肠胃健康状况良好，请继续保持！</p>
              </div>
            )}
            
            {healthStats.attention > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  注意
                </Badge>
                <p className="text-sm">建议注意饮食结构，多摄入纤维素</p>
              </div>
            )}
            
            {healthStats.concern > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  关注
                </Badge>
                <p className="text-sm">建议咨询医生，关注肠胃健康</p>
              </div>
            )}

            {results.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                暂无数据，开始第一次检查吧！
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={onBackToCamera}
          >
            开始新的检查
          </Button>
        </div>
      </div>
    </div>
  );
}