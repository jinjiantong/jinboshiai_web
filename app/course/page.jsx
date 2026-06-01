'use client'

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { ImageModal, VideoModal } from './components/Modal';
import settings from '../../setting.json';

export default function CoursePage() {
  const [courseData, setCourseData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [cachedContent, setCachedContent] = useState({});
  const [theme, setTheme] = useState('purple');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [contentError, setContentError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  const processTextElements = (elements) => {
    const processedElements = [];
    const linksFound = [];
    
    elements.forEach(el => {
      if (el.text_run) {
        let linkUrl = null;
        if (el.text_run.text_element_style && el.text_run.text_element_style.link && el.text_run.text_element_style.link.url) {
          linkUrl = el.text_run.text_element_style.link.url;
          try {
            linkUrl = decodeURIComponent(linkUrl);
          } catch (e) {
            console.error('URL解码失败:', e);
          }
          linksFound.push({
            link: linkUrl,
            text: el.text_run.content
          });
        }
        
        if (linkUrl) {
          processedElements.push({
            type: 'link',
            text: el.text_run.content,
            url: linkUrl
          });
        } else {
          processedElements.push({
            type: 'text',
            text: el.text_run.content
          });
        }
      }
    });
    
    if (linksFound.length > 0) {
      console.log('在返回的数据中找到链接:', linksFound);
    }
    
    return processedElements;
  };

  const parseSidebarData = useCallback((blocks) => {
    if (!blocks || !Array.isArray(blocks)) {
      console.log('parseSidebarData: blocks is empty or not an array');
      return [];
    }

    console.log('parseSidebarData: received blocks count:', blocks.length);

    const result = [];
    let currentChapter = null;

    blocks.forEach(block => {
      const blockType = block.block_type;

      if (blockType !== 4 && blockType !== 5 && blockType !== 6 && blockType !== 7) {
        return;
      }

      let title = '';
      let textElements = [];
      let level = blockType - 2;

      if (blockType === 4 && block.heading2) {
        title = block.heading2.elements?.map(el => el.text_run?.content || '').join('') || '';
        textElements = processTextElements(block.heading2.elements);
        level = 1;
      } else if (blockType === 5 && block.heading3) {
        title = block.heading3.elements?.map(el => el.text_run?.content || '').join('') || '';
        textElements = processTextElements(block.heading3.elements);
        level = 2;
      } else if (blockType === 6 && block.heading4) {
        title = block.heading4.elements?.map(el => el.text_run?.content || '').join('') || '';
        textElements = processTextElements(block.heading4.elements);
        level = 3;
      } else if (blockType === 7 && block.heading5) {
        title = block.heading5.elements?.map(el => el.text_run?.content || '').join('') || '';
        textElements = processTextElements(block.heading5.elements);
        level = 4;
      }

      if (!title.trim()) {
        return;
      }

      const node = {
        id: block.block_id,
        title: title.trim(),
        textElements,
        level,
        children: [],
        content: []
      };

      if (level === 1) {
        result.push(node);
        currentChapter = node;
      } else if (level === 2) {
        if (currentChapter) {
          currentChapter.children.push(node);
        } else {
          result.push(node);
        }
      } else if (level === 3) {
        if (currentChapter) {
          currentChapter.children.push(node);
        } else {
          result.push(node);
        }
      } else if (level === 4) {
        if (currentChapter) {
          currentChapter.children.push(node);
        } else {
          result.push(node);
        }
      }
    });

    console.log('parseSidebarData: result count:', result.length);
    console.log('parseSidebarData: result:', JSON.stringify(result, null, 2));

    return result;
  }, []);

  const parseContentData = useCallback((blocks) => {
    const contentData = [];

    if (!blocks || !Array.isArray(blocks)) {
      return [];
    }

    console.log('All blocks:', blocks);

    const blockMap = new Map();
    blocks.forEach(block => {
      blockMap.set(block.block_id, block);
    });

    let pageBlock = null;
    blocks.forEach(block => {
      if (block.block_type === 1 && block.page) {
        pageBlock = block;
        console.log('Found page block:', pageBlock);
      }
    });

    const processBlockRecursive = (blockId, parentArray) => {
      const block = blockMap.get(blockId);
      if (!block) return;
      
      console.log('Processing block:', block.block_type, block);
      
      let node = null;
      
      if (block.block_type === 3 && block.heading1) {
        const title = block.heading1.elements.map(el => el.text_run.content).join('');
        const textElements = processTextElements(block.heading1.elements);
        if (title && title.trim()) {
          node = {
            id: block.block_id,
            title,
            textElements,
            level: 1,
            children: [],
            content: []
          };
        }
      }
      else if (block.block_type === 4 && block.heading2) {
        const title = block.heading2.elements.map(el => el.text_run.content).join('');
        const textElements = processTextElements(block.heading2.elements);
        if (title && title.trim()) {
          node = {
            id: block.block_id,
            title,
            textElements,
            level: 2,
            children: [],
            content: []
          };
        }
      }
      else if (block.block_type === 5 && block.heading3) {
        const title = block.heading3.elements.map(el => el.text_run.content).join('');
        const textElements = processTextElements(block.heading3.elements);
        if (title && title.trim()) {
          node = {
            id: block.block_id,
            title,
            textElements,
            level: 3,
            children: [],
            content: []
          };
        }
      }
      else if (block.block_type === 6 && block.heading4) {
        const title = block.heading4.elements.map(el => el.text_run.content).join('');
        const textElements = processTextElements(block.heading4.elements);
        if (title && title.trim()) {
          node = {
            id: block.block_id,
            title,
            textElements,
            level: 4,
            children: [],
            content: []
          };
        }
      }
      else if (block.block_type === 7 && block.heading5) {
        const title = block.heading5.elements.map(el => el.text_run.content).join('');
        const textElements = processTextElements(block.heading5.elements);
        if (title && title.trim()) {
          node = {
            id: block.block_id,
            title,
            textElements,
            level: 5,
            children: [],
            content: []
          };
        }
      }
      else if (block.block_type === 2 && block.text) {
        const content = block.text.elements.map(el => el.text_run.content).join('');
        const textElements = processTextElements(block.text.elements);
        if (content && content.trim()) {
          node = {
            id: block.block_id,
            type: 'text',
            title: content,
            textElements,
            level: 6,
            children: [],
            content: []
          };
        }
      }
      else if (block.block_type === 27 && block.image) {
        node = {
          id: block.block_id,
          type: 'image',
          image: block.image,
          level: 4,
          children: [],
          content: []
        };
      }
      else if ((block.block_type === 28 && block.video) || (block.block_type === 23 && block.file && block.file.video)) {
        node = {
          id: block.block_id,
          type: 'video',
          video: block.video || block.file,
          level: 4,
          children: [],
          content: []
        };
      }
      else if (block.block_type === 23 && block.file) {
        const fileType = block.file.file_type || '';
        const fileName = block.file.name || '';
        if (fileType.includes('video') || fileName.match(/\.(mp4|avi|mov|wmv|flv|mkv)$/i)) {
          node = {
            id: block.block_id,
            type: 'video',
            video: block.file,
            level: 4,
            children: [],
            content: []
          };
        }
      }
      else if (block.block_type === 33 && block.view) {
        console.log('Processing view node:', block);
        if (block.children && block.children.length > 0) {
          block.children.forEach(childId => {
            processBlockRecursive(childId, parentArray);
          });
        }
      }
      
      if (node) {
        parentArray.push(node);
        
        if (block.children && block.children.length > 0) {
          block.children.forEach(childId => {
            processBlockRecursive(childId, node.children);
          });
        }
      }
    };
    
    if (pageBlock && pageBlock.children) {
      console.log('Page block children:', pageBlock.children);
      
      pageBlock.children.forEach(childId => {
        processBlockRecursive(childId, contentData);
      });
    }

    console.log('Parsed content data:', contentData);
    console.log('Parsed content length:', contentData.length);
    return contentData;
  }, []);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (settings.data.useLocalCache) {
        const cachedData = localStorage.getItem('courseDataCache');
        const cacheTimestamp = localStorage.getItem('courseDataCacheTimestamp');
        const currentTime = Date.now();
        const cacheExpiry = settings.data.cacheExpiry || 86400000;

        if (cachedData && cacheTimestamp && (currentTime - parseInt(cacheTimestamp)) < cacheExpiry) {
          console.log('使用本地缓存数据');
          const parsedData = JSON.parse(cachedData);
          setCourseData(parsedData);
          
          if (parsedData.length > 0) {
            setSelectedItem(parsedData[0]);
          }
          setLoading(false);
          return;
        }
      }

      const nodeResponse = await axios.get('/api/feishu/wiki/node');

      if (nodeResponse.data.code !== 0) {
        throw new Error(`Feishu API error: ${nodeResponse.data.msg || 'Unknown error'}`);
      }

      const documentId = nodeResponse.data.data.node.obj_token;

      const contentResponse = await axios.get(`/api/feishu/docx/blocks?document_id=${documentId}`);

      if (contentResponse.data.code !== 0) {
        throw new Error(`Feishu API error: ${contentResponse.data.msg || 'Unknown error'}`);
      }

      console.log('飞书API返回的原始数据:', contentResponse.data);
      console.log('飞书API返回的data字段:', contentResponse.data.data);
      
      if (!contentResponse.data.data) {
        console.error('解析失败: data字段不存在');
        throw new Error('Invalid response format: missing data');
      }
      
      console.log('飞书API返回的items字段:', contentResponse.data.data.items);
      if (!contentResponse.data.data.items) {
        console.error('解析失败: items字段不存在');
        console.log('尝试查找其他可能的字段:', Object.keys(contentResponse.data.data));
        
        if (contentResponse.data.data.blocks) {
          console.log('发现blocks字段，尝试使用blocks数据');
          const parsedData = parseSidebarData(contentResponse.data.data.blocks);
          setCourseData(parsedData);
          
          localStorage.setItem('courseDataCache', JSON.stringify(parsedData));
          localStorage.setItem('courseDataCacheTimestamp', Date.now().toString());
          
          if (parsedData.length > 0) {
            setSelectedItem(parsedData[0]);
          }
          return;
        }
        
        throw new Error('Invalid response format: missing items or blocks');
      }

      const parsedData = parseSidebarData(contentResponse.data.data.items);
      
      setCourseData(parsedData);

      localStorage.setItem('courseDataCache', JSON.stringify(parsedData));
      localStorage.setItem('courseDataCacheTimestamp', Date.now().toString());

      if (parsedData.length > 0) {
        setSelectedItem(parsedData[0]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [parseSidebarData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userName = params.get('name');
    const userType = params.get('type');
    
    if (!userName) {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserInfo(parsedUser);
      } else {
        setNotLoggedIn(true);
        return;
      }
    } else {
      setUserInfo({ name: userName, type: userType });
      sessionStorage.setItem('currentUser', JSON.stringify({ name: userName, type: userType }));
    }
    
    fetchCourseData();
  }, [fetchCourseData]);

  useEffect(() => {
    const scrollToTop = () => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    };
    
    scrollToTop();
    
    const timer = setTimeout(scrollToTop, 200);
    
    return () => clearTimeout(timer);
  }, [selectedItem, cachedContent]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleToggleAll = () => {
    const allIds = new Set();
    const collectIds = (items) => {
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id);
          collectIds(item.children);
        }
      });
    };
    collectIds(courseData);
    
    const allExpanded = Array.from(allIds).every(id => expandedItems.has(id));
    setExpandedItems(allExpanded ? new Set() : allIds);
  };

  const areAllExpanded = () => {
    const allIds = new Set();
    const collectIds = (items) => {
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id);
          collectIds(item.children);
        }
      });
    };
    collectIds(courseData);
    
    return Array.from(allIds).every(id => expandedItems.has(id));
  };

  const loadCourseContent = async (item) => {
    if (item.textElements) {
      const linkElement = item.textElements.find(el => el.type === 'link');
      if (linkElement) {
        if (cachedContent[linkElement.url]) {
          console.log('使用内存缓存的内容');
        } else {
          const localStorageKey = `wikiContent_${btoa(linkElement.url)}`;
          const cachedWikiContent = localStorage.getItem(localStorageKey);
          const cacheTimestamp = localStorage.getItem(`${localStorageKey}_timestamp`);
          const currentTime = Date.now();
          const cacheExpiry = settings.data.cacheExpiry || 86400000;

          if (settings.data.useLocalCache && cachedWikiContent && cacheTimestamp && (currentTime - parseInt(cacheTimestamp)) < cacheExpiry) {
            console.log('使用本地存储缓存的内容');
            const parsedContent = JSON.parse(cachedWikiContent);
            setCachedContent(prev => ({
              ...prev,
              [linkElement.url]: { content: parsedContent, timestamp: Date.now() }
            }));
          } else {
            console.log('获取新的wiki内容:', linkElement.url);
            setContentError(null);
            try {
              const response = await axios.get(`/api/feishu/wiki/content?url=${encodeURIComponent(linkElement.url)}`);
              
              if (response.data.code !== 0) {
                throw new Error(`Feishu API error: ${response.data.msg || 'Unknown error'}`);
              }
              
              console.log('Wiki内容API返回的原始数据:', response.data);
              
              if (!response.data.data || !response.data.data.items) {
                throw new Error('Invalid response format: missing data or items');
              }
              
              const parsedContent = parseContentData(response.data.data.items);
              console.log('解析后的Wiki内容:', parsedContent);
              
              setCachedContent(prev => ({
                ...prev,
                [linkElement.url]: { content: parsedContent, timestamp: Date.now() }
              }));
              
              localStorage.setItem(localStorageKey, JSON.stringify(parsedContent));
              localStorage.setItem(`${localStorageKey}_timestamp`, Date.now().toString());
              
              console.log('wiki内容获取成功并缓存');
            } catch (error) {
              console.error('获取wiki内容失败:', error);
              setContentError(error.message);
            }
          }
        }
      }
    }
  };

  const handleNavItemClick = async (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }, 100);
    if (item.children && item.children.length > 0) {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    }
    
    await loadCourseContent(item);
  };

  const scrollToSelectedItem = (itemId) => {
    setTimeout(() => {
      const sidebarNav = document.querySelector('.sidebar-nav');
      if (sidebarNav) {
        const selectedElement = sidebarNav.querySelector(`[data-item-id="${itemId}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 150);
  };

  const handlePrevLesson = async () => {
    if (!selectedItem) return;

    const flattenItems = (items) => {
      let result = [];
      items.forEach(item => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          result = result.concat(flattenItems(item.children));
        }
      });
      return result;
    };

    const allItems = flattenItems(courseData);
    const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);

    if (currentIndex > 0) {
      const prevItem = allItems[currentIndex - 1];
      setSelectedItem(prevItem);
      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.scrollTop = 0;
        }
      }, 100);
      scrollToSelectedItem(prevItem.id);
      await loadCourseContent(prevItem);
    }
  };

  const handleNextLesson = async () => {
    if (!selectedItem) return;

    const flattenItems = (items) => {
      let result = [];
      items.forEach(item => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          result = result.concat(flattenItems(item.children));
        }
      });
      return result;
    };

    const allItems = flattenItems(courseData);
    const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);

    if (currentIndex < allItems.length - 1) {
      const nextItem = allItems[currentIndex + 1];
      setSelectedItem(nextItem);
      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.scrollTop = 0;
        }
      }, 100);
      scrollToSelectedItem(nextItem.id);
      await loadCourseContent(nextItem);
    }
  };

  const handleImageClick = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentImageUrl('');
  };

  const handleVideoClick = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
  };

  if (notLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">请先登录</h2>
          <p className="text-gray-600 mb-6">您需要先登录才能访问课件系统</p>
          <button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            返回登录
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 ${theme === 'purple' ? 'border-purple-500' : 'border-blue-500'} border-t-transparent`}></div>
          <p className="mt-4 text-gray-600">正在加载课程数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <span className="text-red-500 text-6xl mb-4">❌</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">加载失败</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            className={`${theme === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-3 rounded-md transition-all duration-300 transform hover:scale-105`}
            onClick={fetchCourseData}
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        courseData={courseData}
        selectedItem={selectedItem}
        onItemClick={handleNavItemClick}
        expandedItems={expandedItems}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        theme={theme}
        onToggleAll={handleToggleAll}
        areAllExpanded={areAllExpanded()}
      />

      <main 
        id="main-content"
        className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col"
      >
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <Content
              selectedItem={selectedItem}
              cachedContent={cachedContent}
              contentError={contentError}
              theme={theme}
              onImageClick={handleImageClick}
              onVideoClick={handleVideoClick}
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevLesson}
                disabled={!selectedItem || courseData.length === 0}
                className={`px-6 py-3 rounded-xl shadow-md transition-all duration-300 flex items-center gap-3 font-medium ${
                  !selectedItem || courseData.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : `${theme === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} text-white hover:shadow-xl transform hover:scale-105`
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                上一课
              </button>
              <button
                onClick={handleNextLesson}
                disabled={!selectedItem || courseData.length === 0}
                className={`px-6 py-3 rounded-xl shadow-md transition-all duration-300 flex items-center gap-3 font-medium ${
                  !selectedItem || courseData.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : `${theme === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} text-white hover:shadow-xl transform hover:scale-105`
                }`}
              >
                下一课
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <ImageModal 
        isOpen={isImageModalOpen} 
        onClose={closeImageModal} 
        imageUrl={currentImageUrl} 
      />

      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={closeVideoModal} 
        videoUrl={currentVideoUrl} 
      />
    </div>
  );
}
