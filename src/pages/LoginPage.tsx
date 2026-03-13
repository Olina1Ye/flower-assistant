import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('请输入用户名和密码');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // 检查响应类型是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('非 JSON 响应:', text);
                throw new Error('服务器返回了非 JSON 响应。请确保后端服务正在运行（npm run dev）。如果问题仍然存在，请检查服务器日志。');
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '登录失败');
            }

            const { token } = await response.json();
            login(token);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>登录</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>用户名</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>密码</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">登录</button>
            </form>
            <p>
                没有账户？ <a href="/register">注册</a>
            </p>
        </div>
    );
};

export default LoginPage;
