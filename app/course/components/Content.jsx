import { useEffect, useRef, useState } from 'react';

const useLazyLoad = (callback) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [callback]);
  
  return ref;
};

const LazyImage = ({ src, alt, className, onClick, theme, itemId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px', threshold: 0.05 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    setIsInView(true);
  };
  
  return (
    <div ref={containerRef} className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
      <div className={`absolute inset-0 bg-gray-100 transition-opacity duration-500 ${isLoaded || hasError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-full h-full">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" 
               style={{
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 2s infinite linear'
               }}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-4/5 h-4/5 bg-gray-200 rounded-lg opacity-50"></div>
            </div>
          </div>
          <style>{`
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}</style>
        </div>
      </div>
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex flex-col justify-center items-center z-10">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">图片加载失败</p>
          <button 
            className={`${theme === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md transition-all duration-300`}
            onClick={handleRetry}
          >
            重试
          </button>
        </div>
      )}
      {isInView && !hasError && (
        <img
          id={`image-${itemId}`}
          src={src}
          alt={alt}
          className={`max-h-full max-w-full object-contain rounded-lg shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105 cursor-pointer ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClick}
          loading="lazy"
          onLoad={(e) => {
            setIsLoaded(true);
          }}
          onError={(e) => {
            setHasError(true);
          }}
        />
      )}
    </div>
  );
};

const LazyVideo = ({ src, onClick, theme, itemId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px', threshold: 0.05 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    setIsInView(true);
  };
  
  return (
    <div ref={containerRef} className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-xl">
      <div className={`absolute inset-0 bg-gray-100 transition-opacity duration-500 ${isLoaded || hasError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-full h-full">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" 
               style={{
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 2s infinite linear'
               }}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-3/4 h-3/4 bg-gray-200 rounded-lg opacity-50"></div>
                <div className="w-1/3 h-3 bg-gray-300 rounded-full mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 rounded-xl flex flex-col justify-center items-center z-20">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">视频加载失败</p>
          <button 
            className={`${theme === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md transition-all duration-300`}
            onClick={(e) => {
              e.stopPropagation();
              handleRetry();
            }}
          >
            重试
          </button>
        </div>
      )}
      {isInView && !hasError && (
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex justify-center items-center transition-all duration-500 ease-in-out hover:shadow-xl border border-gray-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <video 
            id={`video-${itemId}`}
            src={src} 
            className="w-full h-full object-cover rounded-xl"
            preload="metadata"
            onLoadedMetadata={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
              setIsLoaded(true);
            }}
            onError={(e) => {
              setHasError(true);
            }}
          />
        </div>
      )}
      <button 
        className={`${theme === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-full w-28 h-28 flex justify-center items-center transition-all duration-300 transform hover:scale-110 hover:shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10`}
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
      >
        <span className="text-4xl transition-all duration-300 transform hover:scale-110">▶️</span>
      </button>
    </div>
  );
};

const getIconForTitle = (title) => {
  const iconMap = {
    '介绍': '📖',
    '简介': '📖',
    '概述': '📊',
    '基础': '🏗️',
    '入门': '🚪',
    '安装': '🔧',
    '配置': '⚙️',
    '开发': '💻',
    '实践': '🛠️',
    '实战': '⚔️',
    '案例': '📋',
    '项目': '📁',
    '进阶': '📈',
    '高级': '⭐',
    '优化': '⚡',
    '性能': '🚀',
    '安全': '🔒',
    '测试': '🧪',
    '部署': '☁️',
    '总结': '📝',
    '回顾': '🔄',
    '复习': '📚',
    '作业': '📝',
    '练习': '✏️',
    '实验': '🔬',
    '原理': '🔍',
    '理论': '📚',
    '概念': '💡',
    '指南': '🧭',
    '教程': '📚',
    'API': '🔌',
    '接口': '🔌',
    '数据': '📊',
    '数据库': '🗄️',
    '算法': '🧮',
    '设计': '🎨',
    '架构': '🏛️',
    '模式': '🔷',
    '框架': '🏗️',
    '工具': '🛠️',
    '技巧': '💡',
    '窍门': '💡',
    '调试': '🐛',
    '错误': '🚨',
    '异常': '⚠️',
    '处理': '⚙️',
    '解析': '🔍',
    '分析': '📊',
    '对比': '⚖️',
    '比较': '⚖️',
    '迁移': '🚚',
    '升级': '📈',
    '更新': '🔄',
    '新特性': '✨',
    '版本': '📌',
    '发布': '🚀',
    '流程': '🔄',
    '流程': '📋',
    '工作流': '🔄',
    '自动化': '🤖',
    '集成': '🔗',
    '协作': '🤝',
    '团队': '👥',
    '规范': '📋',
    '最佳实践': '✅',
    '建议': '💡',
    '注意': '⚠️',
    '警告': '⚠️',
    '提示': '💡',
    '技巧': '💡',
    '方法': '🔧',
    '策略': '🎯',
    '方案': '📋',
    '解决方案': '🔧',
    '问题': '❓',
    'FAQ': '❓',
    '问答': '💬',
    '讨论': '💬',
    '社区': '👥',
    '资源': '📦',
    '参考': '📚',
    '文档': '📄',
    '资料': '📚',
    '学习': '📖',
    '路径': '🧭',
    '路线': '🧭',
    '规划': '📋',
    '目标': '🎯',
    '评估': '📊',
    '考核': '📝',
    '考试': '📝',
    '认证': '🏆',
    '证书': '🏆',
    '毕业': '🎓',
    '结业': '🎓',
    'AI': '🤖',
    '人工智能': '🤖',
    '机器学习': '🧠',
    '深度学习': '🧠',
    '神经网络': '🧠',
    '模型': '🧠',
    '训练': '🏋️',
    '推理': '🧠',
    '数据': '📊',
    '大数据': '📊',
    '云': '☁️',
    '云计算': '☁️',
    '服务器': '🖥️',
    '网络': '🌐',
    '前端': '🎨',
    '后端': '⚙️',
    '移动端': '📱',
    'iOS': '🍎',
    'Android': '🤖',
    'React': '⚛️',
    'Vue': '💚',
    'Node': '🟢',
    'Python': '🐍',
    'Java': '☕',
    'JavaScript': '🟨',
    'TypeScript': '🟦',
    'CSS': '🎨',
    'HTML': '📄',
    'Git': '📦',
    'Docker': '🐳',
    'Kubernetes': '☸️',
    'Linux': '🐧',
    'Windows': '🪟',
    'macOS': '🍎'
  };
  
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (title.includes(keyword)) {
      return icon;
    }
  }
  
  const defaultIcons = ['📚', '📖', '💡', '🎯', '🔧', '🌟', '🚀', '💻', '📊', '✨'];
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return defaultIcons[hash % defaultIcons.length];
};

export default function Content({ selectedItem, cachedContent, contentLoading, contentError, theme, onImageClick, onVideoClick, onSubItemClick }) {
    const renderTextWithLinks = (textElements, title) => {
      if (textElements && textElements.length > 0) {
        return textElements.map((element, index) => 
          element.type === 'link' ? (
            <span key={index} className="cursor-pointer hover:text-blue-600 transition-colors">
              {element.text}
            </span>
          ) : (
            <span key={index}>{element.text}</span>
          )
        );
      }
      return title;
    };
  
    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center min-h-96 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === 'purple' ? 'bg-purple-100' : 'bg-blue-100'}`}>
              <svg className={`w-10 h-10 ${theme === 'purple' ? 'text-purple-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">请选择课程内容</p>
            <p className="text-gray-400 text-sm mt-2">从左侧目录中选择一个章节开始学习</p>
          </div>
        </div>
      );
    }

    // 检查是否有内容链接
    const hasLinkElement = selectedItem.textElements && 
      selectedItem.textElements.some(el => el.type === 'link');
    
    // 只有当有子项目并且没有内容链接时，才显示目录列表
    if (selectedItem.children && selectedItem.children.length > 0 && !hasLinkElement) {
      return (
        <div className="p-8">
          <div className="mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${theme === 'purple' ? 'text-purple-800' : 'text-blue-800'}`}>
              {renderTextWithLinks(selectedItem.textElements, selectedItem.title)}
            </h2>
            <p className="text-gray-500">请选择以下章节开始学习</p>
          </div>
          <div className="space-y-4">
            {selectedItem.children.map((child, index) => (
              <div 
                key={child.id || index}
                onClick={() => onSubItemClick && onSubItemClick(child)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  theme === 'purple' 
                    ? 'border-purple-200 hover:border-purple-400 bg-purple-50' 
                    : 'border-blue-200 hover:border-blue-400 bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'purple' ? 'bg-purple-200 text-purple-700' : 'bg-blue-200 text-blue-700'
                  } font-bold text-lg`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold ${theme === 'purple' ? 'text-purple-800' : 'text-blue-800'}`}>
                      {renderTextWithLinks(child.textElements, child.title)}
                    </h3>
                    {child.textElements && child.textElements.length > 0 && (
                      <p className="text-gray-600 mt-2">
                        点击查看详细内容
                      </p>
                    )}
                  </div>
                  <svg className={`w-6 h-6 ${theme === 'purple' ? 'text-purple-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  
    if (selectedItem.isAITools) {
      return (
        <div className="w-full h-full">
          <iframe 
            src="/tool.html" 
            className="w-full h-[80vh] border-0 rounded-xl shadow-lg"
            title="AI工具集合"
          />
        </div>
      );
    }
  
    if (selectedItem.isInstructorInfo) {
      return (
        <div className="space-y-8">
          <div className="transition-all duration-500 ease-in-out p-10 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200">
            <h1 className="text-5xl font-bold text-gray-800 transition-all duration-300 mb-8 text-center">关于讲师</h1>
            <div className={`h-4 w-64 ${theme === 'purple' ? 'bg-purple-500' : 'bg-blue-500'} rounded-full mx-auto`}></div>
          </div>
  
          <div className="transition-all duration-500 ease-in-out p-10 rounded-xl shadow-md bg-gradient-to-br from-white to-gray-50 border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full mb-6 overflow-hidden shadow-lg">
                <img 
                  src="/images/instructor.jpg" 
                  alt="金春浩" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 transition-all duration-300 mb-4">金春浩</h2>
              
              <div className="text-xl text-gray-700 transition-all duration-300 leading-relaxed text-center max-w-4xl">
                <p className="mb-6">13 年资深软件开发工程师，曾任职滴滴出行等一线互联网大厂</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  <div className={`p-4 rounded-lg ${theme === 'purple' ? 'bg-purple-50 border border-purple-200' : 'bg-blue-50 border border-blue-200'}`}>
                    <span className={`mr-2 ${theme === 'purple' ? 'text-purple-600' : 'text-blue-600'}`}>📝</span>
                    精通 iOS、Android、小程序、网站全平台开发
                  </div>
                  <div className={`p-4 rounded-lg ${theme === 'purple' ? 'bg-purple-50 border border-purple-200' : 'bg-blue-50 border border-blue-200'}`}>
                    <span className={`mr-2 ${theme === 'purple' ? 'text-purple-600' : 'text-blue-600'}`}>🚀</span>
                    熟练掌握跨平台技术与主流 AI 技术
                  </div>
                  <div className={`p-4 rounded-lg ${theme === 'purple' ? 'bg-purple-50 border border-purple-200' : 'bg-blue-50 border border-blue-200'}`}>
                    <span className={`mr-2 ${theme === 'purple' ? 'text-purple-600' : 'text-blue-600'}`}>📊</span>
                    具备大型项目架构与落地能力
                  </div>
                  <div className={`p-4 rounded-lg ${theme === 'purple' ? 'bg-purple-50 border border-purple-200' : 'bg-blue-50 border border-blue-200'}`}>
                    <span className={`mr-2 ${theme === 'purple' ? 'text-purple-600' : 'text-blue-600'}`}>✅</span>
                    可一站式完成产品从设计到上线的全流程交付
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    let hasLinkContent = false;
    let linkContent = null;
    if (selectedItem.textElements) {
      const linkElement = selectedItem.textElements.find(el => el.type === 'link');
      if (linkElement && cachedContent[linkElement.url]) {
        hasLinkContent = true;
        linkContent = cachedContent[linkElement.url].content;
      }
    }
  
    if (contentError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-64 p-8 bg-gray-50 rounded-xl border border-gray-200">
          <span className="text-red-500 text-4xl mb-4">❌</span>
          <p className="text-gray-600 mb-4 text-center">内容加载失败</p>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-md">{contentError}</p>
          <button 
            className={`${theme === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-3 rounded-md transition-all duration-300 transform hover:scale-105`}
            onClick={() => window.location.reload()}
          >
            重试
          </button>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        {/* 显示当前选中项目的标题 */}
        <div className="transition-all duration-500 ease-in-out p-10 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 transition-all duration-300 mb-6">
            {renderTextWithLinks(selectedItem.textElements, selectedItem.title)}
          </h1>
          <div className={`h-4 w-64 ${theme === 'purple' ? 'bg-purple-500' : 'bg-blue-500'} rounded-full`}></div>
        </div>
        
        {hasLinkContent && linkContent && linkContent.length > 0 && (
          <div className="space-y-12">
            {(() => {
              const renderedElements = [];
              let textBuffer = [];
              let textKey = 0;

              for (let i = 0; i < linkContent.length; i++) {
                const item = linkContent[i];
                const isText = (item.type === 'text' || (item.level === 6 && !item.type)) && item.title && item.title.trim();
  
                if (isText) {
                  textBuffer.push(item.title);
                } else {
                  if (textBuffer.length > 0) {
                    renderedElements.push(
                    <div key={`text-group-${textKey}`} className="mb-8 p-8 bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        <p className="text-lg text-gray-700 leading-relaxed text-left whitespace-pre-wrap" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          {textBuffer.join('\n')}
                        </p>
                      </div>
                    );
                    textBuffer = [];
                    textKey++;
                  }
                  renderedElements.push(
                    <div key={i} className="transition-all duration-500 ease-in-out">
                      {item.level === 1 && item.title && item.title.trim() && (
                        <div className="mb-12 p-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl">
                          <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-6">
                              <span className="text-4xl">{getIconForTitle(item.title)}</span>
                              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                                {item.title}
                              </h1>
                            </div>
                          </div>
                        </div>
                      )}
                      {item.level === 2 && item.title && item.title.trim() && (
                        <div className={`mb-10 p-8 bg-white rounded-2xl shadow-lg border-l-8 ${theme === 'purple' ? 'border-purple-500' : 'border-blue-500'} hover:shadow-xl transition-all duration-300`}>
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${theme === 'purple' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                              <span className="text-xl">{getIconForTitle(item.title)}</span>
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold text-gray-800">
                                {item.title}
                              </h2>
                            </div>
                          </div>
                        </div>
                      )}
                      {item.level === 3 && item.title && item.title.trim() && (
                        <div className="mb-8 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <span className="text-2xl">{getIconForTitle(item.title)}</span>
                            <div>
                              <h3 className="text-2xl font-semibold text-gray-800">
                                {item.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      )}
                      {item.level === 4 && item.title && item.title.trim() && (
                        <div className="mb-6 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                          <h4 className="text-xl font-semibold text-gray-700 flex items-center gap-3">
                            <span>{getIconForTitle(item.title)}</span>
                            {item.title}
                          </h4>
                        </div>
                      )}
                      {item.level === 5 && item.title && item.title.trim() && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <h5 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                            <span className="text-sm">{getIconForTitle(item.title)}</span>
                            {item.title}
                          </h5>
                        </div>
                      )}
                      {item.type === 'image' && (
                        <div className="mb-12 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200">
                          <div className="flex justify-center items-center h-[80vh]">
                            <LazyImage
                              src={`/api/feishu/media/download?token=${item.image.token}`}
                              alt="课程图片"
                              theme={theme}
                              itemId={item.id}
                              onClick={() => onImageClick(`/api/feishu/media/download?token=${item.image.token}`)}
                            />
                          </div>
                        </div>
                      )}
                      {item.type === 'video' && (
                        <div className="mb-12 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200">
                          <div className="flex justify-center items-center h-[80vh]">
                            <div className="aspect-video w-full max-w-4xl relative cursor-pointer">
                              <LazyVideo
                                src={`/api/feishu/media/download?token=${item.video.token || item.video.file_token || item.video.avatar.token || item.video.avatar.file_token}`}
                                theme={theme}
                                itemId={item.id}
                                onClick={() => onVideoClick(`/api/feishu/media/download?token=${item.video.token || item.video.file_token || item.video.avatar.token || item.video.avatar.file_token}`)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {item.children && item.children.length > 0 && (
                        <div className="pl-8 border-l-2 border-gray-200 space-y-6">
                          {item.children.map((child, childIndex) => (
                            <div key={childIndex} className="transition-all duration-500 ease-in-out hover:shadow-md">
                              {child.level === 1 && (
                                <div className="mb-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200">
                                  <h1 className="text-4xl font-bold text-gray-800 transition-all duration-300 mb-4">
                                    {child.title}
                                  </h1>
                                </div>
                              )}
                              {child.level === 2 && (
                                <div className={`mb-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border-l-6 ${theme === 'purple' ? 'border-purple-500' : 'border-blue-500'}`}>
                                  <h2 className="text-3xl font-bold text-gray-800 transition-all duration-300 mb-3">
                                    {child.title}
                                  </h2>
                                </div>
                              )}
                              {child.level === 3 && (
                                <div className="mb-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200">
                                  <h3 className="text-2xl font-semibold text-gray-800 transition-all duration-300 mb-3">
                                    {child.title}
                                  </h3>
                                </div>
                              )}
                              {child.level === 4 && (
                                <div className="mb-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200">
                                  <h4 className="text-xl font-semibold text-gray-800 transition-all duration-300 mb-3">
                                    {child.title}
                                  </h4>
                                </div>
                              )}
                              {child.level === 5 && (
                                <div className="mb-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200">
                                  <h5 className="text-lg font-semibold text-gray-800 transition-all duration-300 mb-3">
                                    {child.title}
                                  </h5>
                                </div>
                              )}
                              {child.type === 'image' && (
                                <div className="mb-6 p-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200">
                                  <div className="flex justify-center items-center h-[60vh]">
                                    <LazyImage
                                      src={`/api/feishu/media/download?token=${child.image.token}`}
                                      alt="课程图片"
                                      theme={theme}
                                      itemId={child.id}
                                      onClick={() => onImageClick(`/api/feishu/media/download?token=${child.image.token}`)}
                                    />
                                  </div>
                                </div>
                              )}
                              {child.type === 'video' && (
                                <div className="mb-6 p-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200">
                                  <div className="flex justify-center items-center h-[60vh]">
                                    <div className="aspect-video w-full max-w-3xl relative cursor-pointer">
                                      <LazyVideo
                                        src={`/api/feishu/media/download?token=${child.video.token || child.video.file_token || child.video.avatar.token || child.video.avatar.file_token}`}
                                        theme={theme}
                                        itemId={child.id}
                                        onClick={() => onVideoClick(`/api/feishu/media/download?token=${child.video.token || child.video.file_token || child.video.avatar.token || child.video.avatar.file_token}`)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {(child.type === 'text' || (child.level === 6 && !child.type)) && child.title && child.title.trim() && (
                                <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border-l-4 border-gray-300">
                                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{child.title}</p>
                                </div>
                              )}
                              {child.children && child.children.length > 0 && (
                                <div className="pl-6 border-l-2 border-gray-200 space-y-4">
                                  {child.children.map((grandchild, grandchildIndex) => (
                                    <div key={grandchildIndex} className="transition-all duration-300">
                                      {grandchild.level === 1 && grandchild.title && (
                                        <h6 className="text-lg font-semibold text-gray-800 mb-2">{grandchild.title}</h6>
                                      )}
                                      {grandchild.level === 2 && grandchild.title && (
                                        <h6 className="text-base font-semibold text-gray-700 mb-2">{grandchild.title}</h6>
                                      )}
                                      {grandchild.type === 'image' && (
                                        <div className="mb-4">
                                          <LazyImage
                                            src={`/api/feishu/media/download?token=${grandchild.image.token}`}
                                            alt="图片"
                                            theme={theme}
                                            itemId={grandchild.id}
                                            onClick={() => onImageClick(`/api/feishu/media/download?token=${grandchild.image.token}`)}
                                          />
                                        </div>
                                      )}
                                      {(grandchild.type === 'text' || (grandchild.level === 6 && !grandchild.type)) && grandchild.title && (
                                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{grandchild.title}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              }
  
              if (textBuffer.length > 0) {
                renderedElements.push(
                  <div key={`text-group-${textKey}`} className="mb-8 p-8 bg-white rounded-xl shadow-md border-l-4 border-gray-300" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    <p className="text-lg text-gray-700 transition-all duration-300 leading-loose text-left whitespace-pre-wrap" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {textBuffer.join('\n')}
                    </p>
                  </div>
                );
              }
  
              return renderedElements;
            })()}
          </div>
        )}
  
        {!hasLinkContent && (
          <div className="transition-all duration-500 ease-in-out p-8 rounded-xl shadow-md bg-white border border-gray-200">
            <p className="text-gray-600 text-lg">
              点击左侧目录中的章节，即可查看详细内容。
            </p>
          </div>
        )}
      </div>
    );
  }
