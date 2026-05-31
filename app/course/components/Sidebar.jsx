const NavItem = ({ node, level, onItemClick, selectedItemId, expandedItems, theme }) => {
    const handleClick = () => {
      onItemClick(node);
    };
  
    const isExpanded = expandedItems.has(node.id);
    const isSelected = selectedItemId === node.id;
  
    const themeColors = {
      purple: {
        selected: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-l-4 border-purple-500',
        hover: 'hover:bg-purple-50 hover:border-l-2 hover:border-purple-300',
        icon: 'text-purple-500',
        level1: 'text-lg text-purple-800',
        gradient: 'from-purple-500 to-purple-600'
      },
      blue: {
        selected: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-l-4 border-blue-500',
        hover: 'hover:bg-blue-50 hover:border-l-2 hover:border-blue-300',
        icon: 'text-blue-500',
        level1: 'text-lg text-blue-800',
        gradient: 'from-blue-500 to-blue-600'
      }
    };
  
    const colors = themeColors[theme] || themeColors.purple;
  
    return (
      <li key={node.id} className="transition-all duration-300">
        <button
          className={`w-full text-left py-3 px-4 rounded-xl flex items-center transition-all duration-300 font-medium ${
            isSelected
              ? `${colors.selected} shadow-md`
              : `${colors.hover} hover:shadow-sm`
          }`}
          style={{ 
            paddingLeft: `${level * 16 + 16}px`,
            marginLeft: '8px',
            marginRight: '8px'
          }}
          onClick={handleClick}
          data-item-id={node.id}
        >
          {node.children && node.children.length > 0 && (
            <svg
              className={`w-5 h-5 ${colors.icon} mr-3 transition-all duration-300 flex-shrink-0`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              )}
            </svg>
          )}
          <span
            className={`flex-1 transition-all duration-300 ${
              node.level === 1
                ? `${colors.level1} font-bold`
                : node.level === 2
                ? 'text-base text-gray-800 font-semibold'
                : node.level === 3
                ? 'text-sm text-gray-700 font-medium'
                : 'text-xs text-gray-600'
            }`}
            style={{ wordBreak: 'break-word' }}
          >
            {node.textElements && node.textElements.length > 0 ? (
              node.textElements.map((element, index) => 
                element.type === 'link' ? (
                  <span key={index} className="cursor-pointer hover:text-blue-600 transition-colors">
                    {element.text}
                  </span>
                ) : (
                  <span key={index}>{element.text}</span>
                )
              )
            ) : (
              node.title.replace(/^\d+\.\s*/, '')
            )}
          </span>
        </button>
        {node.children && node.children.length > 0 && (
          <ul className={`mt-1 space-y-1 transition-all duration-300 ease-in-out ${
            isExpanded ? 'block opacity-100 max-h-[2000px]' : 'hidden opacity-0 max-h-0'
          }`}>
            {node.children.map(child => (
              <NavItem
                key={child.id}
                node={child}
                level={level + 1}
                onItemClick={onItemClick}
                selectedItemId={selectedItemId}
                expandedItems={expandedItems}
                theme={theme}
              />
            ))}
          </ul>
        )}
      </li>
    );
  };
  
  export default function Sidebar({ courseData, selectedItem, onItemClick, expandedItems, sidebarCollapsed, onToggleSidebar, theme, onToggleAll, areAllExpanded }) {
    const themeColors = {
      purple: {
        header: 'bg-gradient-to-r from-purple-600 to-purple-700',
        button: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
        buttonActive: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      },
      blue: {
        header: 'bg-gradient-to-r from-blue-600 to-blue-700',
        button: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
        buttonActive: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }
    };
  
    const colors = themeColors[theme] || themeColors.purple;
  
    return (
      <aside 
        className={`bg-white shadow-xl transition-all duration-500 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-80'
        } flex flex-col relative`}
      >
        <div className={`${colors.header} p-4 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">📚</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white">课程目录</h1>
                <p className="text-xs text-purple-200 no-underline">金博士AI实验室</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        {sidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="absolute top-16 right-2 p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
  
        {!sidebarCollapsed && (
          <div className="px-4 py-4">
            <button
              onClick={onToggleAll}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                areAllExpanded 
                  ? colors.buttonActive
                  : colors.button
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {areAllExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
              {areAllExpanded ? '收起所有' : '展开所有'}
            </button>
          </div>
        )}
  
        <nav className="sidebar-nav flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="space-y-2 px-2">
            {courseData.map(node => (
              <NavItem 
                key={node.id} 
                node={node} 
                level={1} 
                onItemClick={onItemClick}
                selectedItemId={selectedItem?.id}
                expandedItems={expandedItems}
                theme={theme}
              />
            ))}
          </ul>
        </nav>
      </aside>
    );
  }
