import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input } from '@/components/common';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function NewTask() {
  const router = useRouter();
  const [taskName, setTaskName] = useState('');
  const [matter, setMatter] = useState('');
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const addTodoItem = () => {
    if (!newTodoText.trim()) return;
    
    setTodoList([
      ...todoList,
      {
        id: Date.now().toString(),
        text: newTodoText,
        completed: false
      }
    ]);
    setNewTodoText('');
  };

  const toggleTodoItem = (id: string) => {
    setTodoList(todoList.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeTodoItem = (id: string) => {
    setTodoList(todoList.filter(item => item.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodoItem();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <Card className="bg-[#1A1A1A] p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Task Name</label>
                <Input
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Enter task name"
                  className="bg-[#2D2D2D] text-white w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Matter</label>
                <Input
                  value={matter}
                  onChange={(e) => setMatter(e.target.value)}
                  placeholder="Enter matter name"
                  className="bg-[#2D2D2D] text-white w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">To-do List</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a new to-do item"
                      className="bg-[#2D2D2D] text-white flex-1"
                    />
                    <Button onClick={addTodoItem} variant="secondary">Add</Button>
                  </div>
                  <div className="space-y-2 mt-4">
                    {todoList.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 bg-[#2D2D2D] p-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleTodoItem(item.id)}
                          className="hidden"
                        />
                        <div 
                          onClick={() => toggleTodoItem(item.id)}
                          className={`w-4 h-4 rounded border cursor-pointer flex items-center justify-center ${
                            item.completed ? 'border-[#FFD700] bg-[#FFD700]' : 'border-gray-400'
                          }`}
                        >
                          {item.completed && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M9 1L3.5 6.5L1 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className={`flex-1 text-white ${item.completed ? 'line-through text-gray-400' : ''}`}>
                          {item.text}
                        </span>
                        <button
                          onClick={() => removeTodoItem(item.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[#2D2D2D] text-white w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                  <div className="flex items-center space-x-4">
                    {(['high', 'medium', 'low'] as const).map((level) => (
                      <label key={level} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={priority === level}
                          onChange={() => setPriority(level)}
                          className="hidden"
                        />
                        <div className={`w-4 h-4 rounded-full border ${
                          priority === level ? 'border-[#FFD700] bg-[#FFD700]' : 'border-gray-400'
                        }`} />
                        <span className="text-white capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
                <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
                <Button variant="primary">Create Task</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 