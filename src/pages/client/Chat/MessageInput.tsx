import { useState } from 'react';

export function MessageInput({ onSend }: { onSend: any }) {
    const [text, setText] = useState('');

    const handleSend = (e: any) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText('');
    };

    return (
        <form
            onSubmit={handleSend}
            className="w-full border-t border-gray-700 p-3 flex items-center bg-gray-800 message-input"
        >
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                type="submit"
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
                Send
            </button>
        </form>
    );
}
