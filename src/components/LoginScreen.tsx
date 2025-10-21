import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: (username: string, isGuest?: boolean) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username.trim()) {
      toast.error('请输入用户名');
      return;
    }
    if (!password.trim()) {
      toast.error('请输入密码');
      return;
    }
    
    // 模拟登录
    toast.success('登录成功！可查看历史记录和数据统计');
    onLogin(username, false);
  };

  const handleQuickCheck = () => {
    toast.success('进入快速检查模式，本次检查不会保存数据');
    onLogin('游客用户', true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle>肠胃健康助手</CardTitle>
          <CardDescription>AI智能分析，守护您的肠胃健康</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">用户名</label>
            <Input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm">密码</label>
            <Input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-green-500 hover:bg-green-600" 
            onClick={handleLogin}
          >
            登录（可保存记录和查看统计）
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">或</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleQuickCheck}
          >
            快速检查（不保存数据）
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}