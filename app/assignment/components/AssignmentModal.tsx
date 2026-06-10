'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, File, Star } from 'lucide-react';
import { Assignment } from '../hooks/useAssignment';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignmentFormData) => void;
  assignment?: Assignment;
}

export interface AssignmentFormData {
  '作业标题': string;
  '作业描述': string;
  '关联学员'?: any;
  '关联课程'?: any;
  '作业分数'?: number;
  '作业状态': string;
  '是否优秀': boolean;
  '作业附件'?: File[];
}

export function AssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  assignment
}: AssignmentModalProps) {
  const [formData, setFormData] = useState<AssignmentFormData>({
    '作业标题': '',
    '作业描述': '',
    '关联学员': undefined,
    '关联课程': undefined,
    '作业分数': undefined,
    '作业状态': '未提交',
    '是否优秀': false,
    '作业附件': []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (assignment) {
        setFormData({
          '作业标题': assignment.fields['作业标题'] || '',
          '作业描述': assignment.fields['作业描述'] || '',
          '关联学员': assignment.fields['关联学员'],
          '关联课程': assignment.fields['关联课程'],
          '作业分数': assignment.fields['作业分数'],
          '作业状态': assignment.fields['作业状态'] || '未提交',
          '是否优秀': assignment.fields['是否优秀'] || false,
          '作业附件': []
        });
      } else {
        setFormData({
          '作业标题': '',
          '作业描述': '',
          '关联学员': undefined,
          '关联课程': undefined,
          '作业分数': undefined,
          '作业状态': '未提交',
          '是否优秀': false,
          '作业附件': []
        });
      }
      setErrors({});
    }
  }, [isOpen, assignment]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData['作业标题']?.trim()) {
      newErrors['作业标题'] = '请输入作业标题';
    }
    
    if (!formData['作业描述']?.trim()) {
      newErrors['作业描述'] = '请输入作业描述';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof AssignmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    setFormData(prev => ({
      ...prev,
      '作业附件': [...(prev['作业附件'] || []), ...validFiles]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    setFormData(prev => ({
      ...prev,
      '作业附件': [...(prev['作业附件'] || []), ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      '作业附件': (prev['作业附件'] || []).filter((_, i) => i !== index)
    }));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
            {assignment ? '编辑作业' : '新增作业'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作业标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData['作业标题']}
                onChange={(e) => handleInputChange('作业标题', e.target.value)}
                placeholder="请输入作业标题"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors['作业标题'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['作业标题'] && (
                <p className="mt-1 text-sm text-red-500">{errors['作业标题']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作业描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData['作业描述']}
                onChange={(e) => handleInputChange('作业描述', e.target.value)}
                placeholder="请输入作业描述"
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  errors['作业描述'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['作业描述'] && (
                <p className="mt-1 text-sm text-red-500">{errors['作业描述']}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关联学员
                </label>
                <select
                  value={formData['关联学员']?.text || ''}
                  onChange={(e) => handleInputChange('关联学员', e.target.value ? { text: e.target.value, value: e.target.value } : undefined)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">请选择学员</option>
                  <option value="学员A">学员A</option>
                  <option value="学员B">学员B</option>
                  <option value="学员C">学员C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关联课程
                </label>
                <select
                  value={formData['关联课程']?.text || ''}
                  onChange={(e) => handleInputChange('关联课程', e.target.value ? { text: e.target.value, value: e.target.value } : undefined)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">请选择课程</option>
                  <option value="课程A">课程A</option>
                  <option value="课程B">课程B</option>
                  <option value="课程C">课程C</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  作业分数
                </label>
                <input
                  type="number"
                  value={formData['作业分数'] || ''}
                  onChange={(e) => handleInputChange('作业分数', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提交状态
                </label>
                <select
                  value={formData['作业状态']}
                  onChange={(e) => handleInputChange('作业状态', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="未提交">未提交</option>
                  <option value="已提交">已提交</option>
                  <option value="已完成">已完成</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData['是否优秀']}
                  onChange={(e) => handleInputChange('是否优秀', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500 focus:ring-offset-0"
                />
                <Star className={`w-4 h-4 ${formData['是否优秀'] ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium text-gray-700">标记为优秀作业</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                附件上传
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">点击上传</span> 或拖拽文件到这里
                </p>
                <p className="text-xs text-gray-400 mt-1">支持文件不超过 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar"
                />
              </div>
              
              {formData['作业附件'] && formData['作业附件'].length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData['作业附件'].map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {assignment ? '保存' : '创建'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AssignmentModal;