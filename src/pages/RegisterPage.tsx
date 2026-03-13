import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!username || !password) {
            setError('请输入用户名和密码');
            return;
        }

        try {
            const response = await fetch('/api/register', {
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '注册失败');
            }

            setMessage('注册成功！现在可以登录了');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>注册</h2>
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
                {message && <p style={{ color: 'green' }}>{message}</p>}
                <button type="submit">注册</button>
            </form>
            <p>
                已有账户？<a href="/login">登录</a>
            </p>
        </div>
    );
};

export default RegisterPage;
