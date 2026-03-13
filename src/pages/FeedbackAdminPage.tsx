import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Feedback {
    id: number;
    userId: number;
    username: string;
    message: string;
    createdAt: string;
}

const FeedbackAdminPage: React.FC = () => {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/feedback', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch feedback');
                }

                const data = await response.json();
                setFeedback(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        if (user?.isAdmin) {
            fetchFeedback();
        }
    }, [user]);

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/feedback/${id}`,
             {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete feedback');
            }

            setFeedback(feedback.filter(item => item.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>用户反馈管理</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>反馈ID</th>
                        <th>用户</th>
                        <th>内容</th>
                        <th>提交时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {feedback.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.username}</td>
                            <td>{item.message}</td>
                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleDelete(item.id)}>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeedbackAdminPage;
